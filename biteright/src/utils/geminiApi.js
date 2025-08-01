export const generateMealPlan = async (userData) => {
  console.log("Simulating call to Gemini API with user data:", userData);

  await new Promise(resolve => setTimeout(resolve, 1500));

  const mockMealPlan = {
    id: `plan_${Date.now()}`,
    userId: userData.userId || 'user_123',
    generatedAt: new Date().toISOString(),
    summary: `A 7-day meal plan tailored for ${userData.goal.replace('_', ' ')} and ${userData.dietaryPreferences.join(', ') || 'no specific'} preferences.`,
    days: [
      {
        day: 1,
        meals: [
          {
            type: "Breakfast",
            name: "Overnight Oats with Berries",
            description: "A healthy and filling breakfast with oats, almond milk, chia seeds, and mixed berries.",
            ingredients: [
              "1/2 cup rolled oats",
              "1/2 cup unsweetened almond milk",
              "1 tbsp chia seeds",
              "1/4 cup mixed berries (blueberries, strawberries)",
              "1 tsp maple syrup (optional)"
            ],
            calories: 320,
            protein: 12,
            carbs: 55,
            fat: 8
          },
          {
            type: "Lunch",
            name: "Quinoa Salad with Chickpeas and Veggies",
            description: "A protein-packed salad with quinoa, chickpeas, cucumber, tomatoes, and a lemon-tahini dressing.",
            ingredients: [
              "1 cup cooked quinoa",
              "1/2 cup canned chickpeas (rinsed and drained)",
              "1/2 cucumber (diced)",
              "1/2 cup cherry tomatoes (halved)",
              "2 tbsp tahini",
              "1 tbsp lemon juice",
              "Salt and pepper to taste"
            ],
            calories: 450,
            protein: 18,
            carbs: 60,
            fat: 15
          },
          {
            type: "Dinner",
            name: "Baked Salmon with Roasted Vegetables",
            description: "A delicious and nutritious dinner featuring baked salmon fillet with a side of roasted broccoli and carrots.",
            ingredients: [
              "1 salmon fillet (150g)",
              "1 cup broccoli florets",
              "1/2 cup sliced carrots",
              "1 tsp olive oil",
              "Lemon wedge for serving",
              "Salt and pepper to taste"
            ],
            calories: 420,
            protein: 35,
            carbs: 20,
            fat: 22
          },
          {
            type: "Snack",
            name: "Apple Slices with Almond Butter",
            description: "A simple and satisfying snack combining crisp apple slices with creamy almond butter.",
            ingredients: [
              "1 medium apple (sliced)",
              "1 tbsp almond butter"
            ],
            calories: 180,
            protein: 4,
            carbs: 25,
            fat: 9
          }
        ]
      },

      {
        day: 2,
        meals: [
          { type: "Breakfast", name: "Greek Yogurt Parfait", description: "Layers of yogurt, granola, and fruit.", calories: 300 },
          { type: "Lunch", name: "Lentil Soup with Whole Wheat Bread", description: "Hearty and warming soup with a slice of bread.", calories: 400 },
          { type: "Dinner", name: "Chicken Stir-Fry with Brown Rice", description: "Quick and healthy stir-fry with vegetables.", calories: 500 },
          { type: "Snack", name: "Handful of Nuts", description: "A small portion of mixed nuts.", calories: 170 }
        ]
      }
    ]
  };

  console.log("Mock meal plan generated:", mockMealPlan);
  return mockMealPlan;
};