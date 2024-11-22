// middleware/auth.go
package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/supabase-community/gotrue-go"
	"go.uber.org/zap"
)

var (
    supabaseUrl = os.Getenv("SUPABASE_URL")
    supabaseKey = os.Getenv("SUPABASE_KEY")
)

func AuthMiddleware(logger *zap.Logger, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			logger.Error("Missing authorization token")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			logger.Error("Invalid authorization header format")
			http.Error(w, "Invalid authorization header", http.StatusUnauthorized)
			return
		}

		token := parts[1]
		
		projectID := strings.TrimPrefix(supabaseUrl, "https://")
		projectID = strings.TrimSuffix(projectID, ".supabase.co")
		authURL := fmt.Sprintf("https://%s.supabase.co/auth/v1", projectID)
		
		client := gotrue.New(authURL, supabaseKey)
		authedClient := client.WithToken(token)
		_, err := authedClient.GetUser()
		if err != nil {
			logger.Error("Invalid token", zap.Error(err))
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		
		next(w, r)
	}
}
