import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateWorkoutPlanWithGroq } from "./groqService";

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

const DEFAULT_WORKOUT_PLAN = [
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

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a 503 error or other retryable error
      if (error.message?.includes('503') || error.message?.includes('overloaded')) {
        const delayMs = initialDelayMs * Math.pow(2, attempt);
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delayMs}ms...`);
        await delay(delayMs);
        continue;
      }
      
      // If it's not a retryable error, throw immediately
      throw error;
    }
  }
  
  console.error('All retry attempts failed');
  throw lastError;
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
    ${profile.limitations ? `Limitations: ${profile.limitations.join(", ")}` : ""}
    ${profile.equipment ? `Available Equipment: ${profile.equipment.join(", ")}` : ""}

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
    const generateOperation = async () => {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
      return JSON.parse(cleanedText);
    };

    try {
      // First try with Gemini
      return await retryWithExponentialBackoff(generateOperation, 2);
    } catch (geminiError) {
      console.error("Gemini API failed, falling back to Groq:", geminiError);
      
      try {
        // Try with Groq as fallback
        console.log("Attempting to generate workout plan with Groq...");
        return await generateWorkoutPlanWithGroq(profile);
      } catch (groqError) {
        console.error("Groq API also failed:", groqError);
        // If both APIs fail, return default workout plan
        return DEFAULT_WORKOUT_PLAN;
      }
    }
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return DEFAULT_WORKOUT_PLAN;
  }
}
