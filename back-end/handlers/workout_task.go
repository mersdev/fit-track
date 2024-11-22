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

func (h *Handler) CreateWorkoutTask(w http.ResponseWriter, r *http.Request) {
    var task models.WorkoutTask
    if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
        h.Logger.Error("Failed to decode request body", zap.Error(err))
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    task.CreatedAt = time.Now()
    task.UpdatedAt = time.Now()

    if _, err := h.DB.Model(&task).Insert(); err != nil {
        h.Logger.Error("Failed to create workout task", zap.Error(err))
        http.Error(w, "Failed to create workout task", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(task)
}

func (h *Handler) GetWorkoutTask(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    idStr := vars["id"]
    
    id, err := strconv.Atoi(idStr)
    if err != nil {
        h.Logger.Error("Invalid ID format", zap.String("id", idStr))
        http.Error(w, "Invalid ID format", http.StatusBadRequest)
        return
    }

    var task models.WorkoutTask
    err = h.DB.Model(&task).Where("id = ?", id).Select()
    if err != nil {
        if err == pg.ErrNoRows {
            h.Logger.Error("Workout task not found", zap.Int("id", id))
            http.Error(w, "Workout task not found", http.StatusNotFound)
            return
        }
        h.Logger.Error("Failed to get workout task", zap.Error(err))
        http.Error(w, "Failed to get workout task", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(task)
}

func (h *Handler) ListWorkoutTasks(w http.ResponseWriter, r *http.Request) {
    var tasks []models.WorkoutTask
    query := h.DB.Model(&tasks)

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
        h.Logger.Error("Failed to list workout tasks", zap.Error(err))
        http.Error(w, "Failed to list workout tasks", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(tasks)
}

func (h *Handler) UpdateWorkoutTask(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    idStr := vars["id"]
    
    id, err := strconv.Atoi(idStr)
    if err != nil {
        h.Logger.Error("Invalid ID format", zap.String("id", idStr))
        http.Error(w, "Invalid ID format", http.StatusBadRequest)
        return
    }

    // First fetch the existing task
    existingTask := &models.WorkoutTask{ID: id}
    err = h.DB.Model(existingTask).WherePK().Select()
    if err != nil {
        if err == pg.ErrNoRows {
            http.Error(w, "Workout task not found", http.StatusNotFound)
            return
        }
        h.Logger.Error("Failed to fetch workout task", zap.Error(err))
        http.Error(w, "Failed to fetch workout task", http.StatusInternalServerError)
        return
    }

    // Decode the update request
    var updatedTask models.WorkoutTask
    if err := json.NewDecoder(r.Body).Decode(&updatedTask); err != nil {
        h.Logger.Error("Failed to decode request body", zap.Error(err))
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    // Preserve the ID, user_id, and created_at
    updatedTask.ID = id
    updatedTask.UserID = existingTask.UserID
    updatedTask.CreatedAt = existingTask.CreatedAt
    updatedTask.UpdatedAt = time.Now()

    res, err := h.DB.Model(&updatedTask).WherePK().Update()
    if err != nil {
        h.Logger.Error("Failed to update workout task", zap.Error(err))
        http.Error(w, "Failed to update workout task", http.StatusInternalServerError)
        return
    }

    if res.RowsAffected() == 0 {
        http.Error(w, "Workout task not found", http.StatusNotFound)
        return
    }

    json.NewEncoder(w).Encode(updatedTask)
}

func (h *Handler) DeleteWorkoutTask(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    idStr := vars["id"]
    
    // Convert string ID to int
    id, err := strconv.Atoi(idStr)
    if err != nil {
        h.Logger.Error("Invalid task ID", zap.Error(err))
        http.Error(w, "Invalid task ID", http.StatusBadRequest)
        return
    }

    var task models.WorkoutTask
    task.ID = id

    res, err := h.DB.Model(&task).WherePK().Delete()
    if err != nil {
        h.Logger.Error("Failed to delete workout task", zap.Error(err))
        http.Error(w, "Failed to delete workout task", http.StatusInternalServerError)
        return
    }

    if res.RowsAffected() == 0 {
        http.Error(w, "Workout task not found", http.StatusNotFound)
        return
    }

    // Set response header to application/json
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    
    // Return success message
    response := map[string]string{
        "message": fmt.Sprintf("Workout task with ID %d has been successfully deleted", id),
    }
    json.NewEncoder(w).Encode(response)
}

func (h *Handler) GetWorkoutTasksByUserId(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    userId := vars["userId"]

    // First get the profile ID from user_id
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

    // Now get all tasks for this profile
    var tasks []models.WorkoutTask
    query := h.DB.Model(&tasks).Where("user_id = ?", profile.ID)

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

    // Add sorting by created_at in descending order (newest first)
    query.Order("created_at DESC")

    err = query.Select()
    if err != nil {
        h.Logger.Error("Failed to list workout tasks", zap.Error(err))
        http.Error(w, "Failed to list workout tasks", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(tasks)
} 