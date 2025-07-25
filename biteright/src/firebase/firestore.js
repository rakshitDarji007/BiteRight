import { db, functions } from './firebaseConfig';
import { collection, query, where, getDocs, addDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";

export const getActiveMealPlan = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;

  const q = query(
    collection(db, 'meal_plans'),
    where('user_id', '==', user.uid),
    where('is_active', '==', true)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

export const generateNewMealPlan = async (userProfile) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated. Cannot generate a new plan.");
  }

  const generateMealPlan = httpsCallable(functions, 'generateMealPlan');

  try {
    const result = await generateMealPlan({ profile: userProfile });
    const newPlanData = result.data.plan;

    const q = query(
      collection(db, 'meal_plans'),
      where('user_id', '==', user.uid),
      where('is_active', '==', true)
    );
    const oldPlansSnapshot = await getDocs(q);
    const batch = writeBatch(db);
    oldPlansSnapshot.forEach(doc => {
      batch.update(doc.ref, { is_active: false });
    });
    await batch.commit();

    const docRef = await addDoc(collection(db, 'meal_plans'), {
      user_id: user.uid,
      plan_data: newPlanData,
      goals: userProfile.goals,
      restrictions: userProfile.dietary_restrictions,
      created_at: serverTimestamp(),
      is_active: true,
    });

    return { id: docRef.id, plan_data: newPlanData, is_active: true };

  } catch (error) {
    console.error("Error calling generateMealPlan function:", error.message);
    throw new Error("Failed to generate a new meal plan from the AI service.");
  }
};