export interface WorkoutTask {
  id?: string;
  name: string;
  sets: number;
  reps: number;
  description?: string;
  completed?: boolean;
}
