// Get the API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Types
export interface Workout {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  weight: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  fitnessLevel: string;
  fitnessGoals: string[];
  healthConditions: string[];
  availableEquipment: string[];
  preferredWorkoutDuration: number;
  workoutDaysPerWeek: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: any;
}

// Helper function to get auth header
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function to get content type header
const getContentTypeHeader = (): Record<string, string> => ({
  'Content-Type': 'application/json',
});

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getContentTypeHeader(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to login');
    }

    return response.json();
  },

  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getContentTypeHeader(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to register');
    }

    return response.json();
  },
};

// Workout API
export const workoutApi = {
  async getAllWorkouts(): Promise<Workout[]> {
    const response = await fetch(`${API_BASE_URL}/workouts`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }

    return response.json();
  },

  async getWorkout(id: string): Promise<Workout> {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch workout');
    }

    return response.json();
  },

  async createWorkout(workout: Omit<Workout, 'id'>): Promise<Workout> {
    const response = await fetch(`${API_BASE_URL}/workouts`, {
      method: 'POST',
      headers: {
        ...getContentTypeHeader(),
        ...getAuthHeader(),
      },
      body: JSON.stringify(workout),
    });

    if (!response.ok) {
      throw new Error('Failed to create workout');
    }

    return response.json();
  },

  async updateWorkout(id: string, workout: Partial<Workout>): Promise<Workout> {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'PUT',
      headers: {
        ...getContentTypeHeader(),
        ...getAuthHeader(),
      },
      body: JSON.stringify(workout),
    });

    if (!response.ok) {
      throw new Error('Failed to update workout');
    }

    return response.json();
  },

  async deleteWorkout(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete workout');
    }
  },
};

// Profile API
export const profileApi = {
  async getProfile(): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: getAuthHeader(),
      });

      if (response.status === 404) {
        // Profile not found, return null
        return null;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch profile');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch profile');
    }
  },

  async createProfile(profile: UserProfile): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'POST',
        headers: {
          ...getContentTypeHeader(),
          ...getAuthHeader(),
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create profile');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create profile');
    }
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          ...getContentTypeHeader(),
          ...getAuthHeader(),
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update profile');
    }
  },
};