import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../../src/supabaseClient';
import { getServerSupabaseClient } from '../../src/supabaseClient';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.0-flash";
export async function POST(request) {
    try {
        const userData = await request.json();
        console.log("Got the meal plan data!!");
        if (!userData.userId) {
            return new Response(JSON.stringify({ error: "Missing userID" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const prompt = `
        You are a professional world class nutritionist and chef experts in all types of cuisine from all over the world. Generate a personalized 7-day meal plan for a person wth the details mentioned:

        User ID: ${userData.userId}
        Goal: ${userData.goal || 'Not Specified'}
        Activity Level: ${userData.activityLevel || 'Not Specified'}
        Dietary Preferences: ${userData.dietaryPreferences?.join(', ') || 'None specified'}
        Allergies: ${userData.allergies?.join(', ') || 'None Specified'}
        Other Restrictions: ${userData.otherRestrictions || 'None Specified'}

        Please Provide the meal plan that is structured in JSON format that is useable for a web applicaiton and the structure should be as told below:

        {
        "planSummary": "A brief summary of the plan tailored to the user's goals and preferences.",
        "days": [
            {
            "dayNumber": 1,
            "meals": [
                {
                "type": "Breakfast",
                "name": "Name of the breakfast dish",
                "description": "A short description of the dish.",
                "ingredients": ["List", "of", "ingredients"],
                "nutritionalInfo": {
                    "calories": 0, // Approximate calories
                    "protein_g": 0, // Grams of protein
                    "carbs_g": 0,   // Grams of carbohydrates
                    "fat_g": 0      // Grams of fat
                }
                },
                {
                "type": "Lunch",
                "name": "...",
                "description": "...",
                "ingredients": [...],
                "nutritionalInfo": { ... }
                },
                {
                "type": "Dinner",
                "name": "...",
                "description": "...",
                "ingredients": [...],
                "nutritionalInfo": { ... }
                },
                {
                "type": "Snack", // Include 1-2 snacks per day if appropriate
                "name": "...",
                "description": "...",
                "ingredients": [...],
                "nutritionalInfo": { ... }
                }
            ]
            }
            // ... (Include objects for Day 2 through Day 7)
        ]
        }


        Make sure the meals align with the specified dietary preferences and exclude listed allergies/restrictions completely. Provide approximate nutritional information for each meal. Make the meal names and descriptions sound appealing and varied.
        `;

        console.log("Constructed prompt for AI:", prompt.substring(0, 200) + "...");
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text();
        console.log("Raw respone text from AI")


        let mealPlanData;
        try {
            let cleanedText = generatedText.trim();
            if (cleanedText.startsWith("```json")) {
                cleanedText = cleanedText.substring(7);
            }
            if (cleanedText.endsWith("```")) {
                cleanedText = cleanedText.slice(0, -3);
            }
            cleanedText = cleanedText.trim();
            mealPlanData = JSON.parse(cleanedText);
            console.log("Properly parsed meal plan from AI response");
        } catch (parseError) {
            return new Response(JSON.stringify({
                error: "Failed to parse the meal plan from AI response",
                details: parseError.message,
                rawResponse: generatedText.substring(0, 500)
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        return new Response(JSON.stringify({ mealPlan: mealPlanData }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'error when generating meal plan',
            message: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}