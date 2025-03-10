package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
)

// Upload an update
func uploadUpdate(c *gin.Context) {
	var update Update
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Store metadata in DB
	db.Create(&update)

	c.JSON(http.StatusOK, gin.H{"message": "Update uploaded successfully", "data": update})
}

// Get latest update
func getLatestUpdate(c *gin.Context) {
	platform := c.Query("platform")
	environment := c.Query("environment")

	var latestUpdate Update
	result := db.Where("platform = ? AND environment = ?", platform, environment).
		Order("created_at DESC").First(&latestUpdate)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No update found"})
		return
	}

	c.JSON(http.StatusOK, latestUpdate)
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
	fileName := c.Param("fileName")
	bucket := getEnv("S3_BUCKET", "codepush-updates")

	resp, err := s3Client.GetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(fileName),
	})
	if err != nil {
		log.Println("Error fetching file:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "File not found"})
		return
	}
	defer resp.Body.Close()

	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	c.DataFromReader(http.StatusOK, *resp.ContentLength, "application/octet-stream", resp.Body, nil)
}
