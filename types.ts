
export type Difficulty = 'easy' | 'normal' | 'hard' | 'heroic';
export type BattlePhase = 'intro' | 'player-turn' | 'spell-cast' | 'guardian-turn' | 'round-end' | 'victory' | 'defeat';
export type AppState = 'world-map' | 'battle' | 'character-sheet' | 'quest-log' | 'sanctuary' | 'hero-room' | 'ledger' | 'settings' | 'parent-dashboard';

export interface Artifact {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  timestamp: number;
}

export interface GameSettings {
  ttsVoice: string;
  voiceTimeout: number;
  isMuted: boolean;
  debugMode: boolean;
}

export interface DigraphAccuracy {
  digraph: string;
  attempts: number;
  correct: number;
}

export type PetRarity = 'common' | 'rare' | 'epic';

export interface Pet {
  id: string;
  name: string;
  rarity: PetRarity;
  icon: string;
  buffDescription: string;
  buffType: 'damage_reduction' | 'timeout_extension' | 'crit_boost';
}

export interface Egg {
  id: string;
  rarity: PetRarity;
  incubationProgress: number;
  incubationTarget: number;
  isReady: boolean;
}

export interface ProgressionState {
  level: number;
  xp: number;
  maxXp: number;
  crystalsFound: number;
  unlockedChapters: string[];
  attributes: Attributes;
  unlockedNPCs: string[];
  restorationPoints: number;
  restorationLevel: number;
  decorations: Record<string, string>;
  artifacts: Artifact[];
  recentActivities: ActivityEntry[];
  hasSeenTutorial: boolean;
  accuracyData: Record<string, DigraphAccuracy>;
  settings: GameSettings;
  pets: Pet[];
  activePetId: string | null;
  activeEggs: Egg[];
  lastSpinTimestamp: number | null;
  dailyStreak: number;
  lastLoginDate: number | null;
}

export type StatusEffectType = 
  | 'confusion' 
  | 'slow' 
  | 'focused' 
  | 'shielded' 
  | 'bleed' 
  | 'burn' 
  | 'silenced' 
  | 'stunned';

export interface LootItem {
  id: string;
  name: string;
  type: 'consumable' | 'equipment' | 'material' | 'gold';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  description: string;
  amount?: number;
}

export interface BattleRewards {
  id: string;
  xp: number;
  crystals: number;
  perfectBonus: boolean;
  streakBonus: number;
  loot?: LootItem[];
  timestamp: number;
}

export interface DigraphQuestion {
  word: string;
  displayWord: string;
  correctDigraph: string;
  options: string[];
  meaning: string;
}

export interface PhonicsTask extends DigraphQuestion {
  taskId: string;
}

export interface StatusEffect {
  type: StatusEffectType;
  duration: number;
  target: 'player' | 'guardian';
}

export interface GuardianAttack {
  name: string;
  baseDamage: number;
  message: string;
  condition?: () => boolean;
  statusEffect?: Omit<StatusEffect, 'target'>;
}

export interface Guardian {
  id: string;
  name: string;
  title: string;
  island: string;
  description: string;
  baseHealth: number;
  image: string;
  weakness: string;
  accentColor: string;
}

export interface Chapter {
  id: string;
  name: string;
  guardian: Guardian;
  isUnlocked: boolean;
  isCompleted: boolean;
  background: string;
  ambientAudio: string;
}

export interface TaskResult {
  taskId: string;
  isCorrect: boolean;
  timeToAnswer: number;
  usedHint: boolean;
  damageDealt: number;
  criticalHit: boolean;
  comboStreak: number;
  comboMultiplier?: number;
  appliedStatusEffects: StatusEffect[];
}

export interface Powerups {
  hint: number;
  shield: number;
  timeFreeze: number;
  heal: number;
}

export interface BattleState {
  battleId: string;
  guardian: Guardian;
  phase: BattlePhase;
  currentRound: number;
  maxRounds: number;
  playerHealth: number;
  playerMaxHealth: number;
  guardianHealth: number;
  guardianMaxHealth: number;
  comboStreak: number;
  maxComboStreak: number;
  damageMultiplier: number;
  criticalHits: number;
  tasks: PhonicsTask[];
  currentTaskIndex: number;
  taskResults: TaskResult[];
  availablePowerups: Powerups;
  totalDamageDealt: number;
  totalDamageTaken: number;
  perfectRounds: number;
  isComplete: boolean;
  victory: boolean | null;
  feedback: string;
  audioFeedback?: string;
  guardianStatusEffects: StatusEffect[];
  playerStatusEffects: StatusEffect[];
  activeHint: boolean;
  bonuses?: {
    startingStreak: number;
    weakPointActive: boolean;
  };
}

export interface Attributes {
  readingPower: number;
  focus: number;
  speed: number;
  resilience: number;
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  bonus: string;
  description: string;
  icon: string;
  unlockedAfter: string;
}

export interface Decoration {
  id: string;
  name: string;
  slot: 'wall' | 'desk' | 'floor';
  icon: string;
  unlockedAtRestorationLevel: number;
}

export interface ActivityEntry {
  id: string;
  type: 'npc_rescued' | 'reward_claimed' | 'decoration_placed' | 'battle_victory' | 'quest_complete' | 'level_up' | 'artifact_forged' | 'pet_hatched';
  description: string;
  timestamp: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  isComplete: boolean;
  rewardXp: number;
}

export interface QuestState {
  activeQuests: Quest[];
}

export interface RootState {
  view: AppState;
  battle: BattleState;
  progression: ProgressionState;
  quests: QuestState;
  chapters: Chapter[];
  currentChapterId: string;
}

export interface GameState {
  playerHP: number;
  enemyHP: number;
  maxHP: number;
  streak: number;
  level: number;
  status: 'victory' | 'defeat' | 'playing' | 'animating';
  currentQuestion: PhonicsTask | null;
  feedback: string;
  lastDamage: number | null;
  isCritical: boolean;
}

export type AnimationState = 'idle' | 'attacking' | 'taking-damage' | 'hit-shake';
