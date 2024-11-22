// middleware/logging.go
package middleware

import (
	"net/http"
	"time"

	"go.uber.org/zap"
)

func LoggingMiddleware(logger *zap.Logger, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		logger.Info("Request started",
			zap.String("method", r.Method),
			zap.String("url", r.URL.String()),
			zap.String("remote_addr", r.RemoteAddr),
		)

		next(w, r)

		logger.Info("Request completed",
			zap.String("method", r.Method),
			zap.String("url", r.URL.String()),
			zap.Duration("duration", time.Since(start)),
		)
	}
}