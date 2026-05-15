import AsyncStorage from "@react-native-async-storage/async-storage";
import { RANKS } from "../constants/ranks";

const STORAGE_KEYS = {
  WORKOUTS: "@liftlore_workouts",
  USER_PROFILE: "@liftlore_user_profile",
};

const DEFAULT_PROFILE = {
  name: "Jude",
  xp: 0,
};

// --- BASE HELPERS ---

export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(`Error saving data for key ${key}`, e);
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`Error fetching data for key ${key}`, e);
    return null;
  }
};

// --- WORKOUTS ---

/**
 * Saves a new workout to the local array of workouts and adds XP.
 * @param {Object} workout - The workout object to save.
 */
export const saveWorkout = async (workout) => {
  try {
    const existingWorkouts = await getWorkouts();
    const updatedWorkouts = [workout, ...existingWorkouts];
    await saveData(STORAGE_KEYS.WORKOUTS, updatedWorkouts);

    // Add 20 XP per workout
    await updateUserXP(20);

    return true;
  } catch (e) {
    console.error("Error saving workout", e);
    return false;
  }
};

/**
 * Retrieves the list of all saved workouts.
 * @returns {Promise<Array>}
 */
export const getWorkouts = async () => {
  const workouts = await getData(STORAGE_KEYS.WORKOUTS);
  return workouts || [];
};

// --- USER PROFILE ---

/**
 * Saves or updates the user profile data.
 * @param {Object} profile - The user profile object.
 */
export const saveUserProfile = async (profile) => {
  return await saveData(STORAGE_KEYS.USER_PROFILE, profile);
};

/**
 * Retrieves the stored user profile.
 * @returns {Promise<Object|null>}
 */
export const getUserProfile = async () => {
  return await getData(STORAGE_KEYS.USER_PROFILE);
};

/**
 * Updates the user's XP by a specified amount.
 * @param {number} amount - The amount of XP to add.
 */
export const updateUserXP = async (amount) => {
  const profile = await getUserProfile();
  const updatedProfile = {
    ...profile,
    xp: (profile.xp || 0) + amount,
  };
  await saveUserProfile(updatedProfile);
};

// --- PROGRESSION HELPERS ---

/**
 * Calculates level from total XP.
 * Formula: level = Math.floor(totalXP / 100) + 1
 * @param {number} xp
 */
export const calculateLevel = (xp) => {
  return Math.floor(xp / 100) + 1;
};

/**
 * Determines the rank title based on total XP.
 * @param {number} xp
 */
export const getRank = (xp) => {
  const currentRank = [...RANKS].reverse().find((rank) => xp >= rank.minXP);
  return currentRank ? currentRank.name : RANKS[0].name;
};

/**
 * Gets XP progress towards the next level (0 to 1).
 * @param {number} xp
 */
export const getXPProgress = (xp) => {
  return (xp % 100) / 100;
};

// To clear all data (for testing purposes)
// export const clearAllData = async () => {
//   await AsyncStorage.clear();
// };

/**
 * Calculates the current workout streak.
 * Rules:
 * 1. Consecutive days increase streak.
 * 2. Multiple workouts on same day count as one day.
 * 3. Missing more than 1 day resets streak.
 * @param {Array} workouts
 */
export const calculateStreak = (workouts) => {
  if (!workouts || workouts.length === 0) return 0;

  // Extract unique dates in local time YYYY-MM-DD
  const uniqueDates = [
    ...new Set(
      workouts.map((w) => {
        const d = new Date(w.timestamp);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }),
    ),
  ]
    .sort()
    .reverse();

  if (uniqueDates.length === 0) return 0;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

  const latestWorkoutStr = uniqueDates[0];

  // If the latest workout is older than yesterday, the streak is broken (0).
  if (latestWorkoutStr !== todayStr && latestWorkoutStr !== yesterdayStr) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i]);
    const next = new Date(uniqueDates[i + 1]);

    // Difference in days (using UTC dates to avoid DST issues during diff calculation)
    const diffTime = Math.abs(current.getTime() - next.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // If gap is 1 day (consecutive) or 2 days (1 day missed), continue streak
    if (diffDays <= 2) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export default {
  STORAGE_KEYS,
  saveWorkout,
  getWorkouts,
  saveUserProfile,
  getUserProfile,
  updateUserXP,
  calculateLevel,
  getRank,
  getXPProgress,
  calculateStreak,
};
