const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini client.
// IMPORTANT: Set your API key in the Firebase environment variables.
const genAI = new GoogleGenerativeAI(functions.config().gemini.key);

// Define the Cloud Function
exports.generateMealPlan = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check: Ensure the user is logged in.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to request a meal plan."
    );
  }

  // 2. Data Validation: Ensure we received user profile data.
  const userProfile = data.profile;
  if (!userProfile) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "User profile data is required."
    );
  }

  // 3. Prompt Engineering: Create a detailed prompt for the AI.
  const prompt = `
    You are a professional nutritionist creating a 3-day meal plan.
    Your response MUST be a valid JSON object, with no extra text or markdown.
    The JSON object should have keys "Monday", "Tuesday", and "Wednesday".
    Each day should have keys "breakfast", "lunch", and "dinner".

    User Profile:
    - Goals: ${userProfile.goals.join(", ")}
    - Dietary Restrictions: ${userProfile.dietary_restrictions.join(", ")}
    - Allergies: ${userProfile.allergies.join(", ") || "none"}
    - Personal Info: Age ${userProfile.age}, Weight ${userProfile.weight}kg, Height ${userProfile.height}cm.

    Generate the meal plan based on this profile.
  `;

  try {
    // 4. Call the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();

    // 5. Parse and Return the JSON Response
    const mealPlan = JSON.parse(jsonText);
    return { plan: mealPlan };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to generate meal plan."
    );
  }
});