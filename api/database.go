package main

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Database instance
var db *gorm.DB

func initDB() {
	host := getEnv("POSTGRES_HOST", "localhost")
	port := getEnv("POSTGRES_PORT", "5432")
	user := getEnv("POSTGRES_USER", "codepush")
	password := getEnv("POSTGRES_PASSWORD", "securepassword")
	dbname := getEnv("POSTGRES_DB", "codepushdb")

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ Failed to connect to PostgreSQL: %v", err)
		os.Exit(1)
	}

	// Auto-migrate schema
	if err := db.AutoMigrate(&Update{}, &DeploymentKey{}, &Team{}); err != nil {
		log.Fatalf("❌ Failed to migrate database: %v", err)
	}

	log.Println("✅ Connected to PostgreSQL successfully!")
}
