package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	PublicHost    string
	Port          string
	DBUser        string
	DBPass        string
	DBAddr        string
	DBName        string
	JWTExpiration int64
	JWTSecret     string
	FbCredentials string
}

var Envs = initConfig()

func initConfig() Config {
	godotenv.Load()
	return Config{
		PublicHost:    getEnv("PUBLIC_HOST", "http://localhost"),
		Port:          getEnv("PORT", "8080"),
		DBUser:        getEnv("DB_USER", "root"),
		DBPass:        getEnv("DB_PASS", "root"),
		DBAddr:        fmt.Sprintf("%s:%s", getEnv("DB_HOST", "localhost"), getEnv("DB_PORT", "3306")),
		DBName:        getEnv("DB_NAME", "e_agenda"),
		JWTExpiration: getEnvAsInt("JWT_EXPIRATION", 3600),
		JWTSecret:     getEnv("JWT_SECRET", "secret"),
		FbCredentials: getEnv("FB_CREDENTIALS", "/credentials/fb-credentials.json"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func getEnvAsInt(key string, fallback int64) int64 {
	if value, ok := os.LookupEnv(key); ok {
		v, err := strconv.ParseInt(value, 10, 16)
		if err != nil {
			return fallback
		}
		return v
	}
	return fallback
}
