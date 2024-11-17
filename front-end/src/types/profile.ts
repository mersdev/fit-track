export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  fitnessLevel: string;
  fitnessGoals: string[];
  healthConditions: string[];
  availableEquipment: string[];
  preferredWorkoutDuration: number; // Add this
  workoutDaysPerWeek: number; // Add this
}
