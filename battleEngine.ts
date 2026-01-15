
import { BattleState, PhonicsTask, TaskResult, Difficulty, Guardian, GuardianAttack, StatusEffect, RootState } from './types';
import { DAMAGE_PER_HIT, STREAK_BONUS_THRESHOLD } from './constants';

export class BattleEngine {
  private static readonly BASE_PLAYER_HEALTH = 100;
  private static readonly CRITICAL_CHANCE_BASE = 0.05;
  private static readonly CRITICAL_MULTIPLIER = 1.8;
  private static readonly COMBO_MULTIPLIER_PER_STREAK = 0.25;
  private static readonly MAX_COMBO_MULTIPLIER = 3.0;
  private static readonly RESILIENCE_DAMAGE_REDUCTION = 0.03;

  static startBattle(tasks: PhonicsTask[], guardian: Guardian, playerLevel: number = 1, unlockedNPCs: string[] = []): BattleState {
    const scaledGuardianHealth = this.calculateGuardianHealth(guardian, playerLevel);
    
    // Check for NPC bonuses
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
        timeFreeze: Math.floor(playerLevel / 4),
        heal: 2 + Math.floor(playerLevel / 6),
      },
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      perfectRounds: 0,
      isComplete: false,
      victory: null,
      feedback: `${guardian.name} emerges from ${guardian.island}! ${guardian.description}`,
      guardianStatusEffects: [],
      playerStatusEffects: [],
      activeHint: false,
      bonuses: {
        startingStreak,
        weakPointActive
      }
    };
  }

  private static calculateGuardianHealth(guardian: Guardian, playerLevel: number): number {
    const baseHealthMap: Record<string, number> = {
      mumbler: 300,
      vortex: 500,
      beast: 750,
      dragon: 1000,
      king: 1500,
    };
    const health = baseHealthMap[guardian.id] || 400;
    return Math.floor(health * (1 + (playerLevel - 1) * 0.1));
  }

  static processTurn(
    state: BattleState,
    isCorrect: boolean,
    attributes: { readingPower: number; focus: number; speed: number; resilience: number },
    timeTaken: number = 2000
  ): { nextState: BattleState; result: TaskResult } {
    const task = state.tasks[state.currentTaskIndex];
    const newStreak = isCorrect ? state.comboStreak + 1 : 0;
    
    const isFirstCorrectHit = isCorrect && state.taskResults.filter(r => r.isCorrect).length === 0;
    const forceCritical = isFirstCorrectHit && (state.bonuses?.weakPointActive ?? false);

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

    const nextState: BattleState = {
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
      guardianStatusEffects: [
        ...state.guardianStatusEffects,
        ...damageResult.statusEffects.filter(e => e.target === 'guardian')
      ],
      feedback: damageResult.feedback,
      activeHint: false
    };

    return { nextState, result };
  }

  private static calculateDamage(
    isCorrect: boolean,
    currentStreak: number,
    attributes: { readingPower: number; focus: number; speed: number; resilience: number },
    forceCritical: boolean = false
  ): {
    damage: number;
    isCritical: boolean;
    comboMultiplier: number;
    statusEffects: Array<StatusEffect>;
    feedback: string;
  } {
    if (!isCorrect) {
      return { 
        damage: 0, 
        isCritical: false, 
        comboMultiplier: 1.0, 
        statusEffects: [], 
        feedback: "The echo fades... The guardian prepares to counter!" 
      };
    }

    let damage = DAMAGE_PER_HIT + attributes.readingPower;
    const criticalChance = this.CRITICAL_CHANCE_BASE + (attributes.focus * 0.015);
    const isCritical = forceCritical || Math.random() < criticalChance;
    
    if (isCritical) {
      damage *= this.CRITICAL_MULTIPLIER;
    }
    
    const rawComboMultiplier = 1.0 + (currentStreak * this.COMBO_MULTIPLIER_PER_STREAK);
    const comboMultiplier = Math.min(rawComboMultiplier, this.MAX_COMBO_MULTIPLIER);
    damage *= comboMultiplier;
    
    const variance = 0.9 + (Math.random() * 0.2);
    const finalDamage = Math.floor(damage * variance);
    
    const statusEffects: Array<StatusEffect> = [];
    if (isCritical && Math.random() < 0.3) {
      statusEffects.push({ type: 'confusion', duration: 2, target: 'guardian' });
    }
    
    if (currentStreak >= STREAK_BONUS_THRESHOLD && Math.random() < 0.4) {
      statusEffects.push({ type: 'focused', duration: 3, target: 'player' });
    }

    let feedback = isCritical ? `CRITICAL HIT! ${finalDamage} damage!` : `${finalDamage} damage dealt!`;
    if (forceCritical) feedback = `WEAK POINT EXPOSED! ${feedback}`;
    if (currentStreak > 1) {
      feedback += ` Combo x${comboMultiplier.toFixed(1)}!`;
    }

    return { damage: finalDamage, isCritical, comboMultiplier, statusEffects, feedback };
  }

  static processGuardianTurn(state: BattleState, resilience: number): BattleState {
    const lastResult = state.taskResults[state.taskResults.length - 1];
    const playerHealthPercent = (state.playerHealth / state.playerMaxHealth) * 100;
    const guardianHealthPercent = (state.guardianHealth / state.guardianMaxHealth) * 100;
    
    const attack = this.selectGuardianAttack(
        state.guardian, 
        lastResult?.isCorrect ?? true,
        state.comboStreak,
        playerHealthPercent,
        guardianHealthPercent
    );
    
    let baseDamage = attack.baseDamage;
    if (state.guardianStatusEffects.some(e => e.type === 'confusion')) baseDamage *= 0.7;
    if (state.guardianStatusEffects.some(e => e.type === 'slow')) baseDamage *= 0.6;
    if (state.playerStatusEffects.some(e => e.type === 'focused')) resilience += 5;
    const isShielded = state.playerStatusEffects.some(e => e.type === 'shielded');
    const damageReduction = 1 - (resilience * this.RESILIENCE_DAMAGE_REDUCTION);
    let damageTaken = Math.max(5, Math.floor(baseDamage * Math.max(0.1, damageReduction)));
    if (isShielded) damageTaken = Math.floor(damageTaken * 0.15);
    
    const newStatusEffects: Array<StatusEffect> = [];
    if (attack.statusEffect) newStatusEffects.push({ ...attack.statusEffect, target: 'player' } as StatusEffect);
    
    return {
      ...state,
      playerHealth: Math.max(0, state.playerHealth - damageTaken),
      totalDamageTaken: state.totalDamageTaken + damageTaken,
      phase: 'round-end',
      playerStatusEffects: [
        ...state.playerStatusEffects.filter(e => e.duration > 1),
        ...newStatusEffects
      ].map(e => ({ ...e, duration: e.duration - 1 })),
      guardianStatusEffects: state.guardianStatusEffects
        .filter(e => e.duration > 1)
        .map(e => ({ ...e, duration: e.duration - 1 })),
      feedback: isShielded ? `CLANG! Your resonance shield absorbed the brunt of ${attack.name}!` : attack.message,
    };
  }

  private static selectGuardianAttack(guardian: Guardian, wasPlayerCorrect: boolean, playerStreak: number, playerHealthPercent: number, guardianHealthPercent: number): GuardianAttack {
    const patterns: Record<string, any> = {
      mumbler: {
        standard: [{ name: 'Sound Scramble', baseDamage: 12, message: 'The Mumbler garbles the next word!', statusEffect: { type: 'confusion', duration: 2 } }],
        punishment: [{ name: 'Total Static', baseDamage: 22, message: 'Your missed note creates a storm of static!', statusEffect: { type: 'confusion', duration: 3 } }],
        comboBreaker: [{ name: 'Droning Hum', baseDamage: 10, message: 'The Mumbler’s persistent hum disrupts your focus!' }],
        finisher: [{ name: 'Shatter Sound', baseDamage: 32, message: 'A piercing screech echoes through the cave!' }]
      },
      vortex: {
        standard: [{ name: 'Whirlwind Letters', baseDamage: 15, message: 'Letters swirl chaotically around you!' }],
        punishment: [{ name: 'Vortex Crush', baseDamage: 28, message: 'The vortex tightens, crushing your confidence!', statusEffect: { type: 'slow', duration: 2 } }],
        comboBreaker: [{ name: 'Gale Force', baseDamage: 18, message: 'A sudden gust scatters your thoughts!', statusEffect: { type: 'confusion', duration: 1 } }],
        finisher: [{ name: 'Tornado Strike', baseDamage: 40, message: 'The vortex unleashes its full fury!' }]
      },
      beast: {
        standard: [{ name: 'Primal Roar', baseDamage: 18, message: 'The beast\'s roar shakes the ground!' }],
        punishment: [{ name: 'Savage Bite', baseDamage: 35, message: 'Razor-sharp fangs punish your mistake!' }],
        comboBreaker: [{ name: 'Pounce', baseDamage: 22, message: 'The beast leaps, disrupting your rhythm!' }],
        finisher: [{ name: 'Feral Frenzy', baseDamage: 50, message: 'The wounded beast enters a berserk rage!' }]
      },
      dragon: {
        standard: [{ name: 'Flame Breath', baseDamage: 22, message: 'Scorching flames test your resolve!' }],
        punishment: [{ name: 'Inferno Blast', baseDamage: 42, message: 'Your error ignites a firestorm!' }],
        comboBreaker: [{ name: 'Wing Buffet', baseDamage: 25, message: 'Powerful wings knock you off balance!' }],
        finisher: [{ name: 'Dragon\'s Wrath', baseDamage: 60, message: 'The dragon channels ancient fury!' }]
      },
      king: {
        standard: [{ name: 'Royal Decree', baseDamage: 25, message: 'The Silence King\'s word is law!' }],
        punishment: [{ name: 'Void Sentence', baseDamage: 50, message: 'Absolute silence crushes all sound!' }],
        comboBreaker: [{ name: 'Crushing Authority', baseDamage: 30, message: 'The king\'s presence is overwhelming!', statusEffect: { type: 'slow', duration: 2 } }],
        finisher: [{ name: 'Final Judgment', baseDamage: 75, message: 'The Silence King delivers his ultimate verdict!' }]
      }
    };
    const set = patterns[guardian.id] || patterns.mumbler;
    if (playerHealthPercent < 35 && Math.random() < 0.9) return set.finisher[0];
    if (!wasPlayerCorrect && Math.random() < 0.8) return set.punishment[0];
    if (playerStreak >= 3 && Math.random() < 0.7) return set.comboBreaker[0];
    return set.standard[0];
  }

  static checkCompletion(state: BattleState): BattleState {
    const playerDefeated = state.playerHealth <= 0;
    const guardianDefeated = state.guardianHealth <= 0;
    if (playerDefeated) return { ...state, isComplete: true, victory: false, phase: 'defeat', feedback: `You were defeated by ${state.guardian.name}!` };
    if (guardianDefeated) return { ...state, isComplete: true, victory: true, phase: 'victory', feedback: `You defeated ${state.guardian.name}!` };
    if (state.currentTaskIndex >= state.tasks.length - 1) {
      const victory = state.guardianHealth <= (state.guardianMaxHealth * 0.2);
      return { ...state, isComplete: true, victory, phase: victory ? 'victory' : 'defeat', feedback: victory ? `Final blow dealt!` : `Time ran out!` };
    }
    return { ...state, currentTaskIndex: state.currentTaskIndex + 1, currentRound: state.currentRound + 1, phase: 'player-turn', feedback: '', activeHint: false };
  }

  static usePowerup(state: BattleState, powerupType: keyof BattleState['availablePowerups']): BattleState {
    if (state.availablePowerups[powerupType] <= 0) return state;
    const newPowerups = { ...state.availablePowerups, [powerupType]: state.availablePowerups[powerupType] - 1 };
    let newState = { ...state, availablePowerups: newPowerups };
    switch (powerupType) {
      case 'hint': newState.activeHint = true; newState.feedback = 'Crystal Clarity! The correct path is revealed.'; break;
      case 'shield': newState.feedback = 'Resonance Shield! Incoming damage is heavily mitigated.'; newState.playerStatusEffects.push({ type: 'shielded', duration: 2, target: 'player' }); break;
      case 'timeFreeze': newState.feedback = 'Echo Stasis! The guardian is slowed by a temporal rift.'; newState.guardianStatusEffects.push({ type: 'slow', duration: 3, target: 'guardian' }); break;
      case 'heal': newState.playerHealth = Math.min(state.playerMaxHealth, state.playerHealth + 40); newState.feedback = `Essence Restored! Healed for 40 health.`; break;
    }
    return newState;
  }
}
