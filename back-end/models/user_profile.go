package models

import (
	"database/sql/driver"
	"fmt"
	"strings"
	"time"
)

type StringArray []string

func (a StringArray) Value() (driver.Value, error) {
	if a == nil {
		return "{}", nil
	}
	
	// Convert to PostgreSQL array format
	elements := make([]string, len(a))
	for i, s := range a {
		elements[i] = `"` + strings.Replace(s, `"`, `\"`, -1) + `"`
	}
	
	return fmt.Sprintf("{%s}", strings.Join(elements, ",")), nil
}

func (a *StringArray) Scan(value interface{}) error {
	if value == nil {
		*a = StringArray{}
		return nil
	}
	
	switch v := value.(type) {
	case []byte:
		// Remove the curly braces and split by comma
		str := string(v)
		str = strings.Trim(str, "{}")
		
		// If empty array
		if str == "" {
			*a = StringArray{}
			return nil
		}

		// Split and clean the elements
		elements := strings.Split(str, ",")
		result := make([]string, len(elements))
		
		for i, elem := range elements {
			// Remove quotes and unescape
			elem = strings.Trim(elem, "\"")
			elem = strings.Replace(elem, `\"`, `"`, -1)
			result[i] = elem
		}
		
		*a = result
		return nil
		
	case string:
		return a.Scan([]byte(v))
		
	default:
		return fmt.Errorf("unsupported type for StringArray: %T", value)
	}
}

type UserProfile struct {
	ID                      int         `json:"id" db:"id"`
	UserID                  string      `json:"user_id"`
	Age                     int         `json:"age" db:"age"`
	Weight                  float64     `json:"weight" db:"weight"`
	Height                  float64     `json:"height" db:"height"`
	FitnessLevel           string      `json:"fitnessLevel" db:"fitness_level"`
	FitnessGoals           StringArray `json:"fitnessGoals" db:"fitness_goals"`
	HealthConditions       StringArray `json:"healthConditions" db:"health_conditions"`
	AvailableEquipment    StringArray `json:"availableEquipment" db:"available_equipment"`
	PreferredWorkoutDuration int      `json:"preferredWorkoutDuration" db:"preferred_workout_duration"`
	WorkoutDaysPerWeek    int         `json:"workoutDaysPerWeek" db:"workout_days_per_week"`
	CreatedAt             time.Time   `json:"createdAt" db:"created_at"`
	UpdatedAt             time.Time   `json:"updatedAt" db:"updated_at"`
}


