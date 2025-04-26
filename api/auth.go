package main

import (
	"fmt"
	"net/http"
	"time"

	"maps"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type RequestInfo struct {
	UserID              uint
	ProviderAccessToken string
}

var secretKey = []byte("random123") // Replace with env variable

// GenerateJWT generates a JWT token for a user
func GenerateJWT(userID uint, providerAccessToken string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":               userID,
		"provider_access_token": providerAccessToken,
		"exp":                   time.Now().Add(time.Hour * 24).Unix(), // Expires in 24 hours
	})
	return token.SignedString(secretKey)
}

// AuthMiddleware checks for a valid JWT token in requests
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// authHeader := c.GetHeader("Authorization")
		// if authHeader == "" {
		// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
		// 	c.Abort()
		// 	return
		// }

		// tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		tokenString, err := c.Cookie("auth_token") // Read JWT from cookie
		if err != nil {
			fmt.Println("tokenString", tokenString)
			fmt.Println("err", err)

			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			c.Abort()
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return secretKey, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		payload := make(map[string]any)
		maps.Copy(payload, claims)

		c.Set("requestInfo", RequestInfo{
			UserID:              uint(payload["user_id"].(float64)),
			ProviderAccessToken: payload["provider_access_token"].(string),
		})
		c.Next()
	}
}

func getReqInfo(c *gin.Context) RequestInfo {
	info, ok := c.Get("requestInfo")
	if ok {
		return info.(RequestInfo)
	}

	return RequestInfo{}
}

func CORSMiddleware() gin.HandlerFunc {
	origin := getEnv("NEXTAUTH_URL", "http://localhost:3004")

	fmt.Println("CORSMiddleware - origin", origin)

	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:3004")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Accept")
		c.Header("Access-Control-Allow-Methods", "POST, HEAD, PATCH, DELETE, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
