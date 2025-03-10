package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	loadEnv("")
	initDB()
	initS3()

	router := gin.Default()
	setupRoutes(router)

	port := getEnv("SERVER_PORT", "8080")
	log.Printf("🚀 CodePush server running on port %s", port)

	if err := router.Run(fmt.Sprintf(":%s", port)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
