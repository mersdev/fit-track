// models/workout_task.go
package models

import "time"

type WorkoutTask struct {
	ID          int       `json:"id" db:"id"`
	UserID      int       `json:"userId" db:"user_id"`
	Name        string    `json:"name" db:"name"`
	Sets        int       `json:"sets" db:"sets"`
	Reps        int       `json:"reps" db:"reps"`
	Description string    `json:"description,omitempty" db:"description"`
	Completed   bool      `json:"completed" db:"completed"`
	CreatedAt   time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt   time.Time `json:"updatedAt" db:"updated_at"`
}