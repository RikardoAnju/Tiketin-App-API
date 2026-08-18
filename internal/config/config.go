package config

import "os"

type Config struct {
	AppPort     string
	DatabaseURL string
	JWTSecret   string
}

func Load() *Config {
	return &Config{
		AppPort:     getEnv("APP_PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/tiketin?sslmode=disable"),
		JWTSecret:   getEnv("JWT_SECRET", "change-me"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
