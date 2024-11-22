package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/supabase-community/gotrue-go"
	"github.com/supabase-community/gotrue-go/types"
	"go.uber.org/zap"
)

type SignUpRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *Handler) SignUp(w http.ResponseWriter, r *http.Request) {
	var req SignUpRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Logger.Error("Failed to decode request body", zap.Error(err))
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if h.SupabaseID == "" || h.SupabaseKey == "" {
		h.Logger.Error("Supabase credentials not set")
		http.Error(w, "Server configuration error", http.StatusInternalServerError)
		return
	}

	client := gotrue.New(h.SupabaseID, h.SupabaseKey)
	
	user, err := client.Signup(types.SignupRequest{
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		h.Logger.Error("Failed to sign up user", zap.Error(err))
		http.Error(w, "Failed to sign up", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Logger.Error("Failed to decode request body", zap.Error(err))
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	client := gotrue.New(h.SupabaseID, h.SupabaseKey)
	
	user, err := client.SignInWithEmailPassword(req.Email, req.Password)
	if err != nil {
		h.Logger.Error("Failed to authenticate", zap.Error(err))
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(user)
} 