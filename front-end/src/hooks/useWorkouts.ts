import { useState, useEffect } from "react";
import { WorkoutTask } from "../types/workout";

const FALLBACK_WORKOUTS: WorkoutTask[] = [
  {
    id: "1",
    name: "Push-ups",
    sets: 3,
    reps: 10,
    description: "Basic push-ups",
  },
  {
    id: "2",
    name: "Squats",
    sets: 3,
    reps: 15,
    description: "Bodyweight squats",
  },
  { id: "3", name: "Planks", sets: 3, reps: 1, description: "30-second holds" },
];

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, []);

  async function loadWorkouts() {
    try {
      // Replace with your actual API call
      // const data = await workoutApi.getAllWorkouts();
      setWorkouts(FALLBACK_WORKOUTS);
      setError(null);
      setIsUsingFallback(true);
    } catch (err) {
      console.warn("Failed to load workouts, using fallback data");
      setWorkouts(FALLBACK_WORKOUTS);
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function addWorkout(workout: Omit<WorkoutTask, "id">) {
    try {
      const newWorkout: WorkoutTask = {
        ...workout,
        id: crypto.randomUUID(),
      };
      setWorkouts((prev) => [...prev, newWorkout]);
      return newWorkout;
    } catch (err) {
      setError("Failed to add workout");
      throw err;
    }
  }

  async function updateWorkout(id: string, updates: Partial<WorkoutTask>) {
    try {
      setWorkouts((prev) =>
        prev.map((workout) =>
          workout.id === id ? { ...workout, ...updates } : workout
        )
      );
    } catch (err) {
      setError("Failed to update workout");
      throw err;
    }
  }

  async function deleteWorkout(id: string) {
    try {
      setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
    } catch (err) {
      setError("Failed to delete workout");
      throw err;
    }
  }

  return {
    workouts,
    isLoading,
    error,
    isUsingFallback,
    addWorkout,
    updateWorkout,
    deleteWorkout,
  };
}
