-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    age INTEGER NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    height DECIMAL(5,2) NOT NULL,
    fitness_level VARCHAR(50) NOT NULL,
    fitness_goals TEXT[] NOT NULL DEFAULT '{}',
    health_conditions TEXT[] NOT NULL DEFAULT '{}',
    available_equipment TEXT[] NOT NULL DEFAULT '{}',
    preferred_workout_duration INTEGER NOT NULL,
    workout_days_per_week INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create workout_tasks table
CREATE TABLE IF NOT EXISTS workout_tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workout_tasks_user_id ON workout_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_fitness_level ON user_profiles(fitness_level);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
