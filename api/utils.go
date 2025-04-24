package main

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"mime/multipart"
)

func GenerateSecureToken(length int) (string, error) {
	bytes := make([]byte, length)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func getFileStat(handler *multipart.FileHeader) (multipart.FileHeader, error) {
	if handler == nil {
		return *handler, errors.New("Handler is null")
	}

	return *handler, nil
}
