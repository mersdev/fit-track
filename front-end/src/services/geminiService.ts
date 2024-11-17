import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface WorkoutProfile {
  age: number;
  weight: number;
  height: number;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  goals: string[];
  limitations?: string[];
  equipment?: string[];
}

export async function generateWorkoutPlan(profile: WorkoutProfile) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Create a workout plan for a person with the following profile:
    Age: ${profile.age}
    Weight: ${profile.weight}kg
    Height: ${profile.height}cm
    Fitness Level: ${profile.fitnessLevel}
    Goals: ${profile.goals.join(", ")}
    ${
      profile.limitations
        ? `Limitations: ${profile.limitations.join(", ")}`
        : ""
    }
    ${
      profile.equipment
        ? `Available Equipment: ${profile.equipment.join(", ")}`
        : ""
    }

    Return ONLY a valid JSON array with exactly 3 exercises in this format:
    [
      {
        "name": "Exercise Name",
        "sets": 3,
        "reps": 10,
        "description": "Brief description"
      }
    ]
    
    IMPORTANT: The "reps" field must be a number, not a text description. For timed exercises, convert seconds to rep count (e.g., for a 30-second plank, use reps: 1).`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response text
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Invalid JSON received:", cleanedText);
      // Fallback workout plan
      return [
        {
          name: "Push-ups",
          sets: 3,
          reps: 10,
          description: "Basic bodyweight push-ups for chest and arms",
        },
        {
          name: "Bodyweight Squats",
          sets: 3,
          reps: 12,
          description: "Standard squats targeting legs and core",
        },
        {
          name: "Plank",
          sets: 3,
          reps: 1,
          description: "Hold plank position for 30 seconds",
        },
      ];
    }
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw error;
  }
}
