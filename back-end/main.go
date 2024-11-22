// main.go
package main

import (
	"crypto/tls"
	"fmt"
	"net/http"
	"os"

	"back-end/app"
	"back-end/handlers"

	"github.com/go-pg/pg/v10"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

type App struct {
	Router *mux.Router
	db     *pg.DB
	logger *zap.Logger
}

func initLogger() (*zap.Logger, error) {
	return zap.NewProduction()
}

func initDB() (*pg.DB, error) {
	host := os.Getenv("SUPABASE_HOST")
	user := os.Getenv("SUPABASE_USER")
	password := os.Getenv("SUPABASE_PASSWORD")
	dbname := os.Getenv("SUPABASE_DBNAME")
	port := os.Getenv("SUPABASE_PORT")

	opt := &pg.Options{
		Addr:     fmt.Sprintf("%s:%s", host, port),
		User:     user,
		Password: password,
		Database: dbname,
		TLSConfig: &tls.Config{
			InsecureSkipVerify: true,
		},
	}

	return pg.Connect(opt), nil
}

func NewApp(db *pg.DB, logger *zap.Logger) *App {
	router := mux.NewRouter()
	app := &App{
		Router: router,
		db:     db,
		logger: logger,
	}
	app.RegisterRoutes()
	return app
}

// Add this method to the App struct
func (a *App) RegisterRoutes() {
	h := &handlers.Handler{
		DB:          a.db,
		Logger:      a.logger,
		SupabaseID: os.Getenv("SUPABASE_ID"),
		SupabaseKey: os.Getenv("SUPABASE_KEY"),
	}
	app.RegisterRoutes(a.Router, h)
}

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		panic("Error loading .env file")
	}

	// Initialize logger
	logger, err := initLogger()
	if err != nil {
		panic(fmt.Sprintf("Failed to initialize logger: %v", err))
	}
	defer logger.Sync()

	// Initialize database
	db, err := initDB()
	if err != nil {
		logger.Fatal("Failed to connect to database", zap.Error(err))
	}
	defer db.Close()

	// Run migrations
	if err := runMigrations(db, logger); err != nil {
		logger.Fatal("Failed to run migrations", zap.Error(err))
	}

	// Initialize app
	app := NewApp(db, logger)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	server := &http.Server{
		Addr:    ":" + port,
		Handler: app.Router,
	}

	logger.Info("Server starting", zap.String("port", port))
	if err := server.ListenAndServe(); err != nil {
		logger.Fatal("Server failed to start", zap.Error(err))
	}
}

func runMigrations(db *pg.DB, logger *zap.Logger) error {
	// Read migration file
	migrationSQL, err := os.ReadFile("db/migrations/001_create_tables.sql")
	if err != nil {
		return fmt.Errorf("failed to read migration file: %w", err)
	}

	// Execute migration
	_, err = db.Exec(string(migrationSQL))
	if err != nil {
		return fmt.Errorf("failed to execute migration: %w", err)
	}

	logger.Info("Successfully ran database migrations")
	return nil
}













