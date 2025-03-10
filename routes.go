package main

import "github.com/gin-gonic/gin"

func setupRoutes(router *gin.Engine) {
	router.POST("/update", uploadUpdate)
	router.GET("/latest", getLatestUpdate)
	router.POST("/rollback", rollbackUpdate)
	router.GET("/download/:fileName", downloadUpdate)
}
