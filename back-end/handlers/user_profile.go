// handlers/user_profile.go
package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"back-end/models"

	"github.com/go-pg/pg/v10"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

func (h *Handler) CreateUserProfile(w http.ResponseWriter, r *http.Request) {
	var profile models.UserProfile
	if err := json.NewDecoder(r.Body).Decode(&profile); err != nil {
		h.Logger.Error("Failed to decode request body", zap.Error(err))
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Check if user_id already exists
	exists, err := h.DB.Model(&models.UserProfile{}).
		Where("user_id = ?", profile.UserID).
		Exists()
	if err != nil {
		h.Logger.Error("Failed to check user_id existence", zap.Error(err))
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	if exists {
		h.Logger.Error("User profile already exists", zap.String("user_id", profile.UserID))
		http.Error(w, "User profile already exists for this user_id", http.StatusConflict)
		return
	}

	profile.CreatedAt = time.Now()
	profile.UpdatedAt = time.Now()

	if _, err := h.DB.Model(&profile).Insert(); err != nil {
		h.Logger.Error("Failed to create user profile", zap.Error(err))
		http.Error(w, "Failed to create user profile", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(profile)
}

func (h *Handler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var profile models.UserProfile
	err := h.DB.Model(&profile).Where("id = ?", id).Select()
	if err != nil {
		if err == pg.ErrNoRows {
			h.Logger.Error("User profile not found", zap.String("id", id))
			http.Error(w, "User profile not found", http.StatusNotFound)
			return
		}
		h.Logger.Error("Failed to get user profile", zap.Error(err))
		http.Error(w, "Failed to get user profile", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(profile)
}

func (h *Handler) ListUserProfiles(w http.ResponseWriter, r *http.Request) {
	var profiles []models.UserProfile

	query := h.DB.Model(&profiles)

	// Add pagination
	limit := 10
	if r.URL.Query().Get("limit") != "" {
		fmt.Sscanf(r.URL.Query().Get("limit"), "%d", &limit)
	}
	offset := 0
	if r.URL.Query().Get("offset") != "" {
		fmt.Sscanf(r.URL.Query().Get("offset"), "%d", &offset)
	}
	query.Limit(limit).Offset(offset)

	err := query.Select()
	if err != nil {
		h.Logger.Error("Failed to list user profiles", zap.Error(err))
		http.Error(w, "Failed to list user profiles", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(profiles)
}

func (h *Handler) UpdateUserProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		h.Logger.Error("Invalid profile ID", zap.Error(err))
		http.Error(w, "Invalid profile ID", http.StatusBadRequest)
		return
	}

	// First, get the existing profile
	existingProfile := &models.UserProfile{ID: id}
	err = h.DB.Model(existingProfile).WherePK().Select()
	if err != nil {
		if err == pg.ErrNoRows {
			http.Error(w, "Profile not found", http.StatusNotFound)
			return
		}
		h.Logger.Error("Failed to fetch profile", zap.Error(err))
		http.Error(w, "Failed to fetch profile", http.StatusInternalServerError)
		return
	}

	// Decode the update request
	var updatedProfile models.UserProfile
	if err := json.NewDecoder(r.Body).Decode(&updatedProfile); err != nil {
		h.Logger.Error("Failed to decode request body", zap.Error(err))
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Preserve the original ID, user_id, and created_at
	updatedProfile.ID = id
	updatedProfile.UserID = existingProfile.UserID
	updatedProfile.CreatedAt = existingProfile.CreatedAt
	updatedProfile.UpdatedAt = time.Now()

	// Update the profile
	_, err = h.DB.Model(&updatedProfile).WherePK().Update()
	if err != nil {
		h.Logger.Error("Failed to update user profile", zap.Error(err))
		http.Error(w, "Failed to update user profile", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(updatedProfile)
}

func (h *Handler) DeleteUserProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	
	// Convert string ID to int
	id, err := strconv.Atoi(idStr)
	if err != nil {
		h.Logger.Error("Invalid profile ID", zap.Error(err))
		http.Error(w, "Invalid profile ID", http.StatusBadRequest)
		return
	}

	var profile models.UserProfile
	profile.ID = id

	res, err := h.DB.Model(&profile).WherePK().Delete()
	if err != nil {
		h.Logger.Error("Failed to delete user profile", zap.Error(err))
		http.Error(w, "Failed to delete user profile", http.StatusInternalServerError)
		return
	}

	if res.RowsAffected() == 0 {
		http.Error(w, "User profile not found", http.StatusNotFound)
		return
	}

	// Set response header to application/json
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	
	// Return success message
	response := map[string]string{
		"message": fmt.Sprintf("User profile with ID %d has been successfully deleted", id),
	}
	json.NewEncoder(w).Encode(response)
}

func (h *Handler) GetUserProfileByUserId(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["userId"]

	var profile models.UserProfile
	err := h.DB.Model(&profile).Where("user_id = ?", userId).Select()
	if err != nil {
		if err == pg.ErrNoRows {
			h.Logger.Error("User profile not found", zap.String("userId", userId))
			http.Error(w, "User profile not found", http.StatusNotFound)
			return
		}
		h.Logger.Error("Failed to get user profile", zap.Error(err))
		http.Error(w, "Failed to get user profile", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(profile)
}

func (h *Handler) UpdateUserProfileByUserId(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["userId"]

	// First, get the existing profile
	existingProfile := &models.UserProfile{}
	err := h.DB.Model(existingProfile).Where("user_id = ?", userId).Select()
	if err != nil {
		if err == pg.ErrNoRows {
			http.Error(w, "Profile not found", http.StatusNotFound)
			return
		}
		h.Logger.Error("Failed to fetch profile", zap.Error(err))
		http.Error(w, "Failed to fetch profile", http.StatusInternalServerError)
		return
	}

	// Decode the update request
	var updatedProfile models.UserProfile
	if err := json.NewDecoder(r.Body).Decode(&updatedProfile); err != nil {
		h.Logger.Error("Failed to decode request body", zap.Error(err))
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Preserve the original ID, user_id, and created_at
	updatedProfile.ID = existingProfile.ID
	updatedProfile.UserID = existingProfile.UserID
	updatedProfile.CreatedAt = existingProfile.CreatedAt
	updatedProfile.UpdatedAt = time.Now()

	// Update the profile
	_, err = h.DB.Model(&updatedProfile).Where("user_id = ?", userId).Update()
	if err != nil {
		h.Logger.Error("Failed to update user profile", zap.Error(err))
		http.Error(w, "Failed to update user profile", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(updatedProfile)
}

func (h *Handler) DeleteUserProfileByUserId(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["userId"]

	var profile models.UserProfile
	res, err := h.DB.Model(&profile).Where("user_id = ?", userId).Delete()
	if err != nil {
		h.Logger.Error("Failed to delete user profile", zap.Error(err))
		http.Error(w, "Failed to delete user profile", http.StatusInternalServerError)
		return
	}

	if res.RowsAffected() == 0 {
		http.Error(w, "User profile not found", http.StatusNotFound)
		return
	}

	// Set response header to application/json
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	
	// Return success message
	response := map[string]string{
		"message": fmt.Sprintf("User profile with user_id %s has been successfully deleted", userId),
	}
	json.NewEncoder(w).Encode(response)
}

