export const defaultProfile = {
  age: 30,
  weight: 70,
  height: 170,
  fitnessLevel: "beginner" as const,
  fitnessGoals: [],
  availableEquipment: [],
  preferredWorkoutDuration: 30,
  workoutDaysPerWeek: 3,
};

export const fitnessGoalsOptions = [
  "Weight Loss",
  "Muscle Gain",
  "Endurance",
  "Flexibility",
  "General Fitness",
];

export const equipmentOptions = [
  "Dumbbells",
  "Resistance Bands",
  "Yoga Mat",
  "Pull-up Bar",
  "Bench",
  "None",
];
