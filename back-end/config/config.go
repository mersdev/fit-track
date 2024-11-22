// config/config.go
package config

import "os"

type Config struct {
	SupabaseURL      string
	SupabaseKey      string
	SupabaseUser     string
	SupabasePassword string
	SupabaseDBName   string
	Port             string
}

func LoadConfig() *Config {
	return &Config{
		SupabaseURL:      os.Getenv("SUPABASE_URL"),
		SupabaseKey:      os.Getenv("SUPABASE_KEY"),
		SupabaseUser:     os.Getenv("SUPABASE_USER"),
		SupabasePassword: os.Getenv("SUPABASE_PASSWORD"),
		SupabaseDBName:   os.Getenv("SUPABASE_DB_NAME"),
		Port:             os.Getenv("PORT"),
	}
}