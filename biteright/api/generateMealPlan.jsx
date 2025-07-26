const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const userProfile = req.body.profile;
    if (!userProfile) {
      return res.status(400).json({ error: "User profile data is required." });
    }

    const prompt = `
      You are a professional nutritionist creating a 3-day meal plan.
      Your response MUST be a valid JSON object, with no extra text or markdown.
      The JSON object should have keys "Monday", "Tuesday", and "Wednesday".
      Each day should have keys "breakfast", "lunch", and "dinner".

      User Profile:
      - Goals: ${userProfile.goals.join(", ")}
      - Dietary Restrictions: ${userProfile.dietary_restrictions.join(", ") || "none"}
      - Allergies: ${userProfile.allergies.join(", ") || "none"}
      - Personal Info: Age ${userProfile.age}, Weight ${userProfile.weight}kg, Height ${userProfile.height}cm.

      Generate the meal plan based on this profile.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const mealPlan = JSON.parse(response.text());

    return res.status(200).json({ plan: mealPlan });

  } catch (error) {
    console.error("Error in Vercel function:", error);
    return res.status(500).json({ error: "Failed to generate meal plan from AI service." });
  }
}