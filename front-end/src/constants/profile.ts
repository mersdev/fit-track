import { UserProfile } from "../types/profile";

export const fitnessGoalsOptions = [
  "Lose Weight",
  "Build Muscle",
  "Increase Strength",
  "Improve Endurance",
  "Improve Flexibility",
  "General Fitness",
];

export const equipmentOptions = [
  "Dumbbells",
  "Kettlebell",
  "Resistance Bands",
  "Yoga Mat",
  "Pull-up Bar",
  "Bench",
  "None",
];

export const defaultProfile: UserProfile = {
  age: 30,
  weight: 70,
  height: 170,
  fitnessLevel: "beginner",
  fitnessGoals: [],
  healthConditions: [],
  availableEquipment: [],
  preferredWorkoutDuration: 30,
  workoutDaysPerWeek: 3,
};
