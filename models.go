package main

import "gorm.io/gorm"

// Update model
type Update struct {
	gorm.Model
	Version     string `json:"version"`
	Platform    string `json:"platform"`
	Environment string `json:"environment"`
	FileName    string `json:"fileName"`
	Mandatory   bool   `json:"mandatory"`
}
