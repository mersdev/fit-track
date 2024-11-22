package handlers

import (
	"github.com/go-pg/pg/v10"
	"go.uber.org/zap"
)

type Handler struct {
	DB           *pg.DB
	Logger       *zap.Logger
	SupabaseID  string
	SupabaseKey  string
} 