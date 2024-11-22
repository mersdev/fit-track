package app

import (
	"back-end/handlers"

	"github.com/gorilla/mux"
)

func RegisterRoutes(router *mux.Router, h *handlers.Handler) {
	// Create a subrouter for v1
	v1 := router.PathPrefix("/v1").Subrouter()

	// Auth routes
	v1.HandleFunc("/auth/signup", h.SignUp).Methods("POST")
	v1.HandleFunc("/auth/login", h.Login).Methods("POST")

	// Health check
	v1.HandleFunc("/health", h.HealthCheck).Methods("GET")

	// User profile routes
	v1.HandleFunc("/profiles", h.CreateUserProfile).Methods("POST")
	v1.HandleFunc("/profiles/{id}", h.GetUserProfile).Methods("GET")
	v1.HandleFunc("/profiles", h.ListUserProfiles).Methods("GET")
	v1.HandleFunc("/profiles/{id}", h.UpdateUserProfile).Methods("PUT")
	v1.HandleFunc("/profiles/{id}", h.DeleteUserProfile).Methods("DELETE")

	// Workout task routes
	v1.HandleFunc("/tasks", h.CreateWorkoutTask).Methods("POST")
	v1.HandleFunc("/tasks/{id}", h.GetWorkoutTask).Methods("GET")
	v1.HandleFunc("/tasks", h.ListWorkoutTasks).Methods("GET")
	v1.HandleFunc("/tasks/{id}", h.UpdateWorkoutTask).Methods("PUT")
	v1.HandleFunc("/tasks/{id}", h.DeleteWorkoutTask).Methods("DELETE")

	// Add these new routes
	v1.HandleFunc("/profiles/user/{userId}", h.GetUserProfileByUserId).Methods("GET")
	v1.HandleFunc("/profiles/user/{userId}", h.UpdateUserProfileByUserId).Methods("PUT")
	v1.HandleFunc("/profiles/user/{userId}", h.DeleteUserProfileByUserId).Methods("DELETE")
	v1.HandleFunc("/profiles/user/{userId}/tasks", h.GetWorkoutTasksByUserId).Methods("GET")
} 