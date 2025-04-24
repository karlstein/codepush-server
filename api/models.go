package main

import (
	"time"

	"gorm.io/gorm"
)

type BaseModel struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

// Update model
type Update struct {
	BaseModel
	Version     string  `json:"version"`
	Platform    string  `json:"platform"`
	Environment string  `json:"environment"`
	Checksum    string  `json:"checksum"`
	FileName    string  `json:"fileName"`
	Mandatory   bool    `json:"mandatory"`
	ProjectID   uint    `json:"projectId"`
	Project     Project `json:"project" gorm:"foreignKey:ProjectID"`
}

// User model
type User struct {
	BaseModel
	AuthID   string `json:"authId"`
	Provider string `json:"provider"`
	Email    string `json:"email"`
	UserName string `json:"Name"`
	ImageUrl string `json:"imageUrl"`
	IsSuper  bool   `json:"isSuper"`
}

// Project model
type Project struct {
	BaseModel
	ProjectName string `json:"projectName"`
	ProjectDesc string `json:"projectDesc"`
	ImageUrl    string `json:"imageUrl"`
	UserID      uint   `json:"userId"`
	User        User   `json:"user" gorm:"foreignKey:UserID"`
}

// Team model
type Team struct {
	BaseModel
	UserID    uint    `json:"userId" gorm:"uniqueIndex:user_project_index"`
	User      User    `json:"user" gorm:"foreignKey:UserID"`
	ProjectID uint    `json:"projectId" gorm:"uniqueIndex:user_project_index"`
	Project   Project `json:"project" gorm:"foreignKey:ProjectID"`
}

// Project model
type DeploymentKey struct {
	BaseModel
	Key         string    `json:"key"`
	Environment string    `json:"environment" gorm:"uniqueIndex:user_project_index"`
	Expired     time.Time `json:"expired"`
	UserID      uint      `json:"userId" gorm:"uniqueIndex:user_project_index"`
	User        User      `json:"user" gorm:"foreignKey:UserID"`
	ProjectID   uint      `json:"projectId" gorm:"uniqueIndex:user_project_index"`
	Project     Project   `json:"project" gorm:"foreignKey:ProjectID"`
}

type BaseSearchParamsModel struct {
	Limit   int     `form:"limit"`
	Page    int     `form:"page"`
	Keyword *string `form:"keyword"`
}

type ProjectUpdatesParamsModel struct {
	BaseSearchParamsModel
	ProjectID   uint    `form:"projectID"`
	Version     string  `form:"version"`
	Platform    string  `form:"platform"`
	Environment string  `form:"environment"`
	Checksum    string  `form:"checksum"`
	FileName    string  `form:"fileName"`
	Mandatory   *string `form:"mandatory"`
}

type ProjectUpdatesModel struct {
	Project Project  `json:"project"`
	Update  []Update `json:"updates"`
}

type UploadUpdatePayloadModel struct {
	Update        Update `json:"update"`
	DeploymentKey string `json:"deploymentKey"`
}

// Project model
type CreateDeploymentKeyPayload struct {
	Environment string `json:"environment"`
	Expired     string `json:"expired"`
	ProjectID   uint   `json:"projectId" gorm:"uniqueIndex:user_project_index"`
}

// Project model
type DownloadBundlePayload struct {
	UpdateID      uint   `json:"updateId"`
	DeploymentKey string `json:"deploymentKey"`
}
