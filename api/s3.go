package main

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/schollz/progressbar/v3"
)

// S3 Client
var s3Client *s3.Client

func initS3() {
	s3Endpoint := getEnv("S3_ENDPOINT", "http://localhost:9000")
	s3AccessKey := getEnv("S3_ACCESS_KEY", "admin")
	s3SecretKey := getEnv("S3_SECRET_KEY", "admin123")
	s3Location := getEnv("S3_LOCATION", "us-east-1")

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(s3AccessKey, s3SecretKey, "")),
		config.WithRegion(s3Location),
	)
	if err != nil {
		log.Fatalf("❌ Failed to load S3 Bucket config: %v", err)
	}

	// Manually configure endpoint to MinIO
	s3Client = s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(s3Endpoint)
		o.UsePathStyle = true
	})
}

func DownloadFile(bundleName string) (*s3.GetObjectOutput, error) {
	s3Bucket := getEnv("S3_BUCKET", "")

	resp, err := s3Client.GetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(s3Bucket),
		Key:    aws.String(bundleName),
	})

	if err != nil {
		var noKey *types.NoSuchKey
		if errors.As(err, &noKey) {
			log.Printf("Can't get object %s from bucket %s. No such key exists.\n", bundleName, s3Bucket)
			err = noKey
		} else {
			log.Printf("Couldn't get object %v:%v. Here's why: %v\n", s3Bucket, bundleName, err)
		}
		return nil, err
	}

	return resp, nil
}

func UploadFile(file multipart.File, handler *multipart.FileHeader, fileName string) error {
	buffer := new(bytes.Buffer)

	_, err := io.Copy(buffer, file)
	if err != nil {
		return err
	}

	stat, err := getFileStat(handler)
	if err != nil {
		return err
	}

	bar := progressbar.DefaultBytes(stat.Size, "Uploading")
	progressReader := progressbar.NewReader(file, bar)

	_, err = s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(getEnv("S3_BUCKET", "code-push")),
		Key:    aws.String(fileName),
		Body:   progressReader.Reader, // Now correctly implements io.Reader
	})
	if err != nil {
		return err
	}

	fmt.Println("✅ Upload complete!")
	return nil
}
