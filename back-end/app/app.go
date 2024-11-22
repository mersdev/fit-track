// app/app.go
package app

import (
	"net/http"

	"back-end/handlers"
	"back-end/middleware"

	"github.com/go-pg/pg/v10"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

type App struct {
	DB       *pg.DB
	Router   *mux.Router
	Logger   *zap.Logger
	handlers *handlers.Handler
}

func NewApp(db *pg.DB, logger *zap.Logger) *App {
	app := &App{
		DB:     db,
		Router: mux.NewRouter(),
		Logger: logger,
		handlers: &handlers.Handler{
			DB:     db,
			Logger: logger,
		},
	}
	app.setupRoutes()
	return app
}

func (app *App) setupRoutes() {
	// Add CORS middleware first
    app.Router.Use(middleware.CorsMiddleware)
	
	// Add logging middleware to all routes
	app.Router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			app.loggingMiddleware(next.ServeHTTP)(w, r)
		})
	})

	// Register v1 routes
	RegisterRoutes(app.Router, app.handlers)
}

func (app *App) loggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return middleware.LoggingMiddleware(app.Logger, next)
}