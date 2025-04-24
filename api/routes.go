package main

import (
	"github.com/gin-gonic/gin"
)

func setupRoutes(r *gin.Engine) {
	r.POST("/update", uploadUpdate)
	r.GET("/latest", getLatestUpdate)
	r.POST("/rollback", rollbackUpdate)
	r.GET("/download", downloadUpdate)

	r.POST("/login", userLogin)
	r.POST("/logout", userLogout)
	// r.GET("/cred/project", getAllProject)

	protected := r.Group("/cred")
	protected.Use(AuthMiddleware())

	{
		protected.GET("/project", getAllProject)
		protected.GET("/project/updates", getProjectUpdates)
		protected.POST("/project/generate-key", createDeploymentKey)
	}
}
