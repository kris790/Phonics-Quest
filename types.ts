
export type Difficulty = 'easy' | 'normal' | 'hard' | 'heroic';
export type BattlePhase = 'intro' | 'player-turn' | 'spell-cast' | 'guardian-turn' | 'round-end' | 'victory' | 'defeat';
export type AppState = 'world-map' | 'battle' | 'character-sheet' | 'quest-log';

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
  xp: number;
  crystals: number;
  perfectBonus: boolean;
  streakBonus: number;
  loot?: LootItem[];
}

// Redefined to represent the raw data structure from the Gemini API
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
}

export interface TaskResult {
  taskId: string;
  isCorrect: boolean;
  timeToAnswer: number;
  usedHint: boolean;
  damageDealt: number;
  criticalHit: boolean;
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
  difficulty: Difficulty;
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
}

export interface ProgressionState {
  level: number;
  xp: number;
  maxXp: number;
  crystalsFound: number;
  unlockedChapters: string[];
  attributes: {
    readingPower: number;
    focus: number;
    speed: number;
    resilience: number;
  };
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
