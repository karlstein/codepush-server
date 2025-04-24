package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Upload an update
func uploadUpdate(c *gin.Context) {
	metadataStr := c.Request.FormValue("metadata")
	var payload UploadUpdatePayloadModel
	if err := json.Unmarshal([]byte(metadataStr), &payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var dkModel *DeploymentKey
	result := db.Where("key = ?", payload.DeploymentKey).
		Order("created_at DESC").First(&dkModel)

	if result.Error != nil || dkModel == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No deployment found"})
		return
	}

	file, handler, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, "Error getting file: "+err.Error())
		return
	}

	err = UploadFile(file, handler, payload.Update.FileName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Error uploading file: "+err.Error())
		return
	}

	payload.Update.ProjectID = dkModel.ProjectID

	// Store metadata in DB
	db.Create(&payload.Update)

	c.JSON(http.StatusOK, gin.H{"message": "Update uploaded successfully", "data": payload})
}

// Get latest update
func getLatestUpdate(c *gin.Context) {
	platform := c.Query("platform")
	deploymentKey := c.Query("deploymentKey")
	version := c.Query("version")

	var currDeploymentKey DeploymentKey
	deploymentKeyResult := db.Where("key = ?", deploymentKey).
		Order("created_at DESC").First(&currDeploymentKey)
	if deploymentKeyResult.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Deployment key not found"})
		return
	}

	var latestUpdate *Update
	result := db.Where("platform = ? AND version = ? AND environment = ? AND project_id = ?",
		platform, version, currDeploymentKey.Environment, currDeploymentKey.ProjectID).
		Order("created_at DESC").First(&latestUpdate)

	fmt.Println("sql - getLatestUpdate", result.Statement.SQL.String())

	if result.Error != nil {
		c.JSON(http.StatusOK, gin.H{"data": nil, "message": "Not found (404)"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": latestUpdate})
}

// Rollback update
func rollbackUpdate(c *gin.Context) {
	environment := c.Query("environment")

	var latestUpdate Update
	result := db.Where("environment = ?", environment).
		Order("created_at DESC").Limit(1).Delete(&latestUpdate)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Rollback failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Rollback successful"})
}

// Download update file from MinIO
func downloadUpdate(c *gin.Context) {
	updateId := c.Query("updateId")
	deploymentKey := c.Query("deploymentKey")

	fmt.Println("downloadUpdate - params", updateId, deploymentKey)

	var currDeploymentKey DeploymentKey
	deploymentKeyResult := db.Where("key = ?", deploymentKey).
		Order("created_at DESC").First(&currDeploymentKey)
	if deploymentKeyResult.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Deployment key not found"})
		return
	}

	var latestUpdate Update
	result := db.Where("id = ? AND project_id = ? AND environment = ?",
		updateId,
		currDeploymentKey.ProjectID,
		currDeploymentKey.Environment,
	).
		Order("created_at DESC").First(&latestUpdate)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Update not found"})
		return
	}

	fmt.Println("latestUpdate", latestUpdate)

	resp, err := DownloadFile(latestUpdate.FileName)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", latestUpdate.FileName))
	c.DataFromReader(http.StatusOK, *resp.ContentLength, "application/octet-stream", resp.Body, nil)

	_, copyErr := io.Copy(c.Writer, resp.Body)
	if copyErr != nil {
		fmt.Println("Error streaming bundle:", copyErr)
	}
}

type LoginModel struct {
	User                User   `json:"user"`
	ProviderAccessToken string `json:"provider_access_token"`
	Token               string `json:"token"`
}

// User Login
func userLogin(c *gin.Context) {
	var login LoginModel

	fmt.Println("userLogin")

	if err := c.ShouldBindJSON(&login); err != nil {
		fmt.Println("userLogin - err", err)

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := login.User

	result := db.Where(&User{Email: user.Email}).First(&user)
	if result.RowsAffected == 0 {
		db.Create(&user)
	}

	token, err := GenerateJWT(user.ID, login.ProviderAccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	login.User = user
	login.Token = token

	c.JSON(http.StatusOK, gin.H{
		"message": "User logged in successfully",
		"data":    login,
	})
}

func userLogout(c *gin.Context) {
	c.SetCookie("auth_token", "", -1, "/", "", true, true) // Expire the cookie
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// Get all project
func getAllProject(c *gin.Context) {
	reqInfo := getReqInfo(c)

	if reqInfo.UserID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}

	var projects []Project
	result := db.Raw(`SELECT p.* 
		FROM projects p
		LEFT JOIN teams t ON t.project_id = p.id
		WHERE t.user_id = @user_id 
		OR p.user_id = @user_id`,
		sql.Named("user_id", 1)).
		Scan(&projects)

	if result.Error != nil || len(projects) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No project found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": projects})
}

// Get project with update list
func getProjectUpdates(c *gin.Context) {
	reqInfo := getReqInfo(c)

	if reqInfo.UserID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}

	var params ProjectUpdatesParamsModel
	if err := c.BindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad Request Error"})
		return
	}

	if params.ProjectID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project not found"})
		return
	}

	var projectUpdates ProjectUpdatesModel
	projectResult := db.Where("id = ?", params.ProjectID).First(&projectUpdates.Project)
	if projectResult.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No project found"})
		return
	}

	// whereClausesa := Update{ProjectID: }
	whereClauses := map[string]any{"project_id": params.ProjectID}

	if len(params.Checksum) > 0 {
		searchTerm := fmt.Sprint("%", params.Checksum, "%")
		whereClauses["checksum ILIKE"] = searchTerm
	}

	if len(params.Environment) > 0 {
		searchTerm := fmt.Sprint("%", params.Environment, "%")
		whereClauses["environment ILIKE"] = searchTerm
	}

	if params.Mandatory != nil {
		whereClauses["mandatory"] = params.Mandatory
	}

	if len(params.Platform) > 0 {
		searchTerm := fmt.Sprint("%", params.Platform, "%")
		whereClauses["platform ILIKE"] = searchTerm
	}

	if len(params.Version) > 0 {
		searchTerm := fmt.Sprint("%", params.Version, "%")
		whereClauses["version ILIKE"] = searchTerm
	}

	updatesResult := db.Where(whereClauses)

	if params.Limit > 0 {
		updatesResult = updatesResult.Limit(params.Limit)
	}

	if params.Page > 0 {
		updatesResult = updatesResult.Offset((params.Page - 1) * params.Limit)
	}

	updatesResult = updatesResult.Find(&projectUpdates.Update)
	if updatesResult.Error != nil || len(projectUpdates.Update) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No update found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": projectUpdates})
}

// Create deployment key
func createDeploymentKey(c *gin.Context) {
	reqInfo := getReqInfo(c)
	if reqInfo.UserID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}

	var payload CreateDeploymentKeyPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	key, err := GenerateSecureToken(15)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to generate deployment key"})
		return
	}

	expired, err := time.Parse("2006-01-02", payload.Expired)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse expired date into time.Time"})
		return
	}

	deploymentKey := DeploymentKey{
		Key:         key,
		UserID:      reqInfo.UserID,
		ProjectID:   payload.ProjectID,
		Expired:     expired,
		Environment: payload.Environment,
	}

	// Store metadata in DB
	db.Create(&deploymentKey)

	c.JSON(http.StatusOK, gin.H{
		"message": "Update uploaded successfully",
		"data":    deploymentKey,
	})
}
