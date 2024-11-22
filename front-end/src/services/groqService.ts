import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";

interface WorkoutProfile {
  age: number;
  weight: number;
  height: number;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  goals: string[];
  limitations?: string[];
  equipment?: string[];
}

const model = new ChatGroq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  temperature: 0.1,
  model: "mixtral-8x7b-32768", // Using Mixtral model for better performance
});

const workoutPromptTemplate = PromptTemplate.fromTemplate(`
Create a workout plan for a person with the following profile:
Age: {age}
Weight: {weight}kg
Height: {height}cm
Fitness Level: {fitnessLevel}
Goals: {goals}
{limitations}
{equipment}

Return ONLY a valid JSON array with exactly 3 exercises in this format:
[
  {{
    "name": "Exercise Name",
    "sets": 3,
    "reps": 10,
    "description": "Brief description"
  }}
]

IMPORTANT: 
1. The "reps" field must be a number, not a text description
2. For timed exercises, convert seconds to rep count (e.g., for a 30-second plank, use reps: 1)
3. Response must be valid JSON
4. Include exactly 3 exercises
`);

export async function generateWorkoutPlanWithGroq(profile: WorkoutProfile) {
  try {
    const prompt = await workoutPromptTemplate.format({
      age: profile.age,
      weight: profile.weight,
      height: profile.height,
      fitnessLevel: profile.fitnessLevel,
      goals: profile.goals.join(", "),
      limitations: profile.limitations
        ? `Limitations: ${profile.limitations.join(", ")}`
        : "",
      equipment: profile.equipment
        ? `Available Equipment: ${profile.equipment.join(", ")}`
        : "",
    });

    const response = await model.invoke(prompt);
    const text = response.content.toString();

    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const cleanedText = jsonMatch[0].replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating workout plan with Groq:", error);
    throw error;
  }
}
