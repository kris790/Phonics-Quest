
import { BattleState, PhonicsTask, TaskResult, Difficulty, Guardian, GuardianAttack, StatusEffect, RootState, Attributes } from './types';
import { DAMAGE_PER_HIT, STREAK_BONUS_THRESHOLD } from './constants';

export class BattleEngine {
  private static readonly BASE_PLAYER_HEALTH = 100;
  private static readonly CRITICAL_CHANCE_BASE = 0.04;
  private static readonly CRITICAL_CHANCE_PER_FOCUS = 0.01;
  private static readonly CRITICAL_MULTIPLIER = 1.8;
  private static readonly COMBO_MULTIPLIER_PER_STREAK = 0.25;
  private static readonly MAX_COMBO_MULTIPLIER = 2.5;
  private static readonly RESILIENCE_DAMAGE_REDUCTION = 0.03;
  private static readonly RESILIENCE_REDUCTION_CAP = 0.75;

  static startBattle(tasks: PhonicsTask[], guardian: Guardian, playerLevel: number = 1, unlockedNPCs: string[] = []): BattleState {
    const scaledGuardianHealth = this.calculateGuardianHealth(guardian, playerLevel);
    const startingStreak = unlockedNPCs.includes('lyra') ? 1 : 0;
    const weakPointActive = unlockedNPCs.includes('finn');

    return {
      battleId: `battle-${Date.now()}`,
      guardian,
      phase: 'intro',
      currentRound: 1,
      maxRounds: tasks.length,
      playerHealth: this.BASE_PLAYER_HEALTH,
      playerMaxHealth: this.BASE_PLAYER_HEALTH,
      guardianHealth: scaledGuardianHealth,
      guardianMaxHealth: scaledGuardianHealth,
      comboStreak: startingStreak,
      maxComboStreak: startingStreak,
      damageMultiplier: 1.0,
      criticalHits: 0,
      tasks,
      currentTaskIndex: 0,
      taskResults: [],
      availablePowerups: {
        hint: 2 + Math.floor(playerLevel / 3),
        shield: 1 + Math.floor(playerLevel / 5),
        timeFreeze: 1 + Math.floor(playerLevel / 4),
        heal: 2 + Math.floor(playerLevel / 6),
      },
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      perfectRounds: 0,
      isComplete: false,
      victory: null,
      feedback: `${guardian.name} emerges from ${guardian.island}!`,
      guardianStatusEffects: [],
      playerStatusEffects: [],
      activeHint: false,
      bonuses: { startingStreak, weakPointActive }
    };
  }

  private static calculateGuardianHealth(guardian: Guardian, playerLevel: number): number {
    const baseHealthMap: Record<string, number> = { mumbler: 300, vortex: 500, beast: 750, dragon: 1000, king: 1500 };
    const health = baseHealthMap[guardian.id] || 400;
    return Math.floor(health * (1 + (playerLevel - 1) * 0.1));
  }

  static processTurn(
    state: BattleState,
    isCorrect: boolean,
    attributes: Attributes,
    timeTaken: number = 2000
  ): { nextState: BattleState; result: TaskResult } {
    const task = state.tasks[state.currentTaskIndex];
    const newStreak = isCorrect ? state.comboStreak + 1 : 0;
    const forceCritical = isCorrect && state.taskResults.length === 0 && (state.bonuses?.weakPointActive ?? false);

    const damageResult = this.calculateDamage(isCorrect, newStreak, attributes, forceCritical);
    
    const result: TaskResult = {
      taskId: task.taskId,
      isCorrect,
      timeToAnswer: timeTaken,
      usedHint: state.activeHint,
      damageDealt: damageResult.damage,
      criticalHit: damageResult.isCritical,
      comboStreak: newStreak,
      comboMultiplier: damageResult.comboMultiplier,
      appliedStatusEffects: damageResult.statusEffects,
    };

    return {
      nextState: {
        ...state,
        phase: 'spell-cast',
        guardianHealth: Math.max(0, state.guardianHealth - damageResult.damage),
        comboStreak: newStreak,
        maxComboStreak: Math.max(state.maxComboStreak, newStreak),
        damageMultiplier: damageResult.comboMultiplier,
        criticalHits: damageResult.isCritical ? state.criticalHits + 1 : state.criticalHits,
        totalDamageDealt: state.totalDamageDealt + damageResult.damage,
        perfectRounds: isCorrect ? state.perfectRounds + 1 : state.perfectRounds,
        taskResults: [...state.taskResults, result],
        guardianStatusEffects: [...state.guardianStatusEffects, ...damageResult.statusEffects.filter(e => e.target === 'guardian')],
        feedback: damageResult.feedback,
        activeHint: false
      },
      result
    };
  }

  private static calculateDamage(isCorrect: boolean, currentStreak: number, attributes: Attributes, forceCritical: boolean): any {
    if (!isCorrect) return { damage: 0, isCritical: false, comboMultiplier: 1.0, statusEffects: [], feedback: "The shadow thickens..." };
    let damage = DAMAGE_PER_HIT + attributes.readingPower;
    const criticalChance = this.CRITICAL_CHANCE_BASE + (attributes.focus * this.CRITICAL_CHANCE_PER_FOCUS);
    const isCritical = forceCritical || Math.random() < criticalChance;
    if (isCritical) damage *= this.CRITICAL_MULTIPLIER;
    const comboMultiplier = Math.min(1.0 + (currentStreak * this.COMBO_MULTIPLIER_PER_STREAK), this.MAX_COMBO_MULTIPLIER);
    damage *= comboMultiplier;
    const finalDamage = Math.floor(damage * (0.9 + Math.random() * 0.2));
    const statusEffects: Array<StatusEffect> = [];
    if (isCritical && Math.random() < 0.3) statusEffects.push({ type: 'confusion', duration: 2, target: 'guardian' });
    return { damage: finalDamage, isCritical, comboMultiplier, statusEffects, feedback: isCritical ? `CRITICAL! ${finalDamage} DMG!` : `${finalDamage} DMG!` };
  }

  static processGuardianTurn(state: BattleState, resilience: number): BattleState {
    const damageTaken = Math.max(5, Math.floor(20 * (1 - Math.min(resilience * this.RESILIENCE_DAMAGE_REDUCTION, this.RESILIENCE_REDUCTION_CAP))));
    return {
      ...state,
      playerHealth: Math.max(0, state.playerHealth - damageTaken),
      totalDamageTaken: state.totalDamageTaken + damageTaken,
      phase: 'round-end',
      feedback: `${state.guardian.name} counters for ${damageTaken} damage!`,
    };
  }

  static checkCompletion(state: BattleState): BattleState {
    if (state.playerHealth <= 0) return { ...state, isComplete: true, victory: false, phase: 'defeat' };
    if (state.guardianHealth <= 0) return { ...state, isComplete: true, victory: true, phase: 'victory' };
    if (state.currentTaskIndex >= state.tasks.length - 1) return { ...state, isComplete: true, victory: state.guardianHealth < (state.guardianMaxHealth * 0.3), phase: 'victory' };
    return { ...state, currentTaskIndex: state.currentTaskIndex + 1, currentRound: state.currentRound + 1, phase: 'player-turn', feedback: '', activeHint: false };
  }

  static usePowerup(state: BattleState, powerupType: keyof BattleState['availablePowerups']): BattleState {
    if (state.availablePowerups[powerupType] <= 0) return state;
    const newPowerups = { ...state.availablePowerups, [powerupType]: state.availablePowerups[powerupType] - 1 };
    let ns = { ...state, availablePowerups: newPowerups };
    if (powerupType === 'hint') ns.activeHint = true;
    if (powerupType === 'heal') ns.playerHealth = Math.min(state.playerMaxHealth, state.playerHealth + 40);
    return ns;
  }
}
