
import { RootState } from '../types';

const SAVE_KEY = 'phonics_quest_save_v5_armor';

/**
 * Safely saves the game state to LocalStorage with error handling for quota limits.
 */
export const saveGame = (state: Partial<RootState>): boolean => {
  try {
    // We only save progression, chapters (unlock status), and quests.
    const saveObject = {
      progression: state.progression,
      chapters: state.chapters,
      quests: state.quests,
      timestamp: Date.now()
    };
    
    const serialized = JSON.stringify(saveObject);
    localStorage.setItem(SAVE_KEY, serialized);
    return true;
  } catch (e) {
    console.error("Persistence Error: Failed to save state.", e);
    // If quota is exceeded, we could try to prune recentActivities as a recovery step
    return false;
  }
};

/**
 * Loads and validates the saved game state.
 */
export const loadGame = (): Partial<RootState> | null => {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return null;
    
    const parsed = JSON.parse(saved);
    // Basic structural validation
    if (parsed && typeof parsed === 'object' && parsed.progression) {
      return parsed as Partial<RootState>;
    }
    return null;
  } catch (e) {
    console.error("Persistence Error: Corrupt save data.", e);
    return null;
  }
};
