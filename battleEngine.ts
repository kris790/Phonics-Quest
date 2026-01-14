
import { BattleState, PhonicsTask, TaskResult, Difficulty, Guardian } from './types';
import { DAMAGE_PER_HIT, STREAK_BONUS_THRESHOLD } from './constants';

export class BattleEngine {
  /**
   * Initialize a new battle state with a specific Guardian
   */
  static startBattle(tasks: PhonicsTask[], guardian: Guardian, difficulty: Difficulty = 'normal'): BattleState {
    return {
      battleId: `battle-${Date.now()}`,
      guardian,
      difficulty,
      phase: 'intro',
      currentRound: 1,
      maxRounds: tasks.length,
      playerHealth: 100,
      playerMaxHealth: 100,
      guardianHealth: guardian.baseHealth,
      guardianMaxHealth: guardian.baseHealth,
      comboStreak: 0,
      maxComboStreak: 0,
      damageMultiplier: 1.0,
      criticalHits: 0,
      tasks,
      currentTaskIndex: 0,
      taskResults: [],
      availablePowerups: {
        hint: 3,
        shield: 2,
        timeFreeze: 2,
        heal: 1,
      },
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      perfectRounds: 0,
      isComplete: false,
      victory: null,
      feedback: `${guardian.name} emerges from the silence!`,
    };
  }

  /**
   * Process a player's answer
   */
  static processTurn(
    state: BattleState,
    isCorrect: boolean,
    readingPower: number = 5,
    speed: number = 5,
    timeTaken: number = 2000
  ): { nextState: BattleState; result: TaskResult } {
    const task = state.tasks[state.currentTaskIndex];
    const newStreak = isCorrect ? state.comboStreak + 1 : 0;
    
    // Critical hit chance scales with the Speed attribute
    const critChance = (speed * 2) + (newStreak * 5); // Base speed bonus + streak bonus
    const rolledCrit = isCorrect && (Math.random() * 100 < critChance);
    const isCrit = rolledCrit || (isCorrect && newStreak >= STREAK_BONUS_THRESHOLD);
    
    // Calculate damage scaling: (Base + ReadingPower * 2) * Multiplier
    let damage = 0;
    if (isCorrect) {
      const multiplier = isCrit ? 2.5 : 1.0;
      damage = Math.floor((DAMAGE_PER_HIT + (readingPower * 1.5)) * multiplier);
    }

    const result: TaskResult = {
      taskId: task.taskId,
      isCorrect,
      timeToAnswer: timeTaken,
      usedHint: false,
      damageDealt: damage,
      criticalHit: isCrit,
    };

    const nextState: BattleState = {
      ...state,
      phase: 'spell-cast',
      guardianHealth: Math.max(0, state.guardianHealth - damage),
      comboStreak: newStreak,
      maxComboStreak: Math.max(state.maxComboStreak, newStreak),
      criticalHits: isCrit ? state.criticalHits + 1 : state.criticalHits,
      totalDamageDealt: state.totalDamageDealt + damage,
      perfectRounds: isCorrect ? state.perfectRounds + 1 : state.perfectRounds,
      taskResults: [...state.taskResults, result],
    };

    return { nextState, result };
  }

  /**
   * Guardian counter-attack logic factored by Resilience
   */
  static processGuardianTurn(state: BattleState, resilience: number = 5): BattleState {
    const lastResult = state.taskResults[state.taskResults.length - 1];
    let damageTaken = 0;
    
    if (!lastResult.isCorrect) {
      const baseGuardianDmg = 15 + Math.floor(state.guardianMaxHealth / 40);
      // Resilience stat reduces incoming damage by a percentage (cap at 60%)
      const mitigation = Math.min(60, resilience * 2); 
      damageTaken = Math.floor(baseGuardianDmg * (1 - mitigation / 100));
    }

    return {
      ...state,
      playerHealth: Math.max(0, state.playerHealth - damageTaken),
      totalDamageTaken: state.totalDamageTaken + damageTaken,
      phase: 'round-end',
    };
  }

  /**
   * Check for end-of-battle conditions
   */
  static checkCompletion(state: BattleState): BattleState {
    const playerDefeated = state.playerHealth <= 0;
    const guardianDefeated = state.guardianHealth <= 0;
    const allTasksDone = state.currentTaskIndex >= state.tasks.length - 1;

    if (playerDefeated) {
      return { ...state, isComplete: true, victory: false, phase: 'defeat' };
    }

    if (guardianDefeated) {
      return { ...state, isComplete: true, victory: true, phase: 'victory' };
    }

    if (allTasksDone) {
      const victory = state.guardianHealth < (state.guardianMaxHealth * 0.4); 
      return { ...state, isComplete: true, victory, phase: victory ? 'victory' : 'defeat' };
    }

    return {
      ...state,
      currentTaskIndex: state.currentTaskIndex + 1,
      currentRound: state.currentRound + 1,
      phase: 'player-turn',
    };
  }
}
