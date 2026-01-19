
import { NPC, Decoration, LootItem } from './types';

export const APP_VERSION = '2.2.0';
export const INITIAL_HP = 100;
export const DAMAGE_PER_HIT = 20;
export const STREAK_BONUS_THRESHOLD = 3;

export const WORLD_LORE = {
  kingdomName: "The Phonics Kingdom",
  theGreatSilence: "A mysterious celestial event caused by 'The Muted One'—a shadow that fed on the Kingdom's resonance. When the First Syllable was stolen, language physically crumbled into dust.",
  theGuardians: "Once the 'Five High Cantors' of the Academy, they were corrupted when they tried to hold onto the echoes of the stolen Syllable."
};

export const KINGDOM_ROADMAP = [
  {
    quarter: "Q1 2026",
    focus: "The Living Echo",
    deliverables: "Adaptive AI resonance, real-time difficulty tuning, enhanced assessment spells."
  },
  {
    quarter: "Q2 2026",
    focus: "The Weaver's Mirror",
    deliverables: "Ledger 2.0 analytics, milestone celebrations, multi-child save profiles."
  },
  {
    quarter: "Q3 2026",
    focus: "Guild Alliances",
    deliverables: "Teacher-Cantor tools, classroom rosters, regional leaderboard echoes."
  },
  {
    quarter: "Q4 2026",
    focus: "Astral Phonetics",
    deliverables: "AR visualizers, collaborative raid battles, world language translations."
  }
];

export const HERO_LORE = {
  name: "Caelum",
  title: "The Word Weaver",
  origin: "The Whispering Grove, Vowel Valley",
  motivation: "To retrieve the 'Echo of the First Syllable' and 'Unspeak' the curse bound to their mentors.",
  chronicles: [
    {
      title: "The Child of Resonance",
      content: "Caelum was born with 'The Sight'—the ability to see words as physical vibrations of light."
    },
    {
      title: "The Stolen Syllable",
      content: "During the Festival of Clarity, 'The Muted One' descended. Voice vanished instantly."
    },
    {
      title: "The Weaver's Vow",
      content: "Every Guardian Caelum faces is a piece of their past. Caelum battles to remind them of the music they once shared."
    }
  ]
};

export const AUDIO_TRACKS = {
  map: 'https://assets.mixkit.co/music/preview/mixkit-mystical-dream-578.mp3',
  battle: 'https://assets.mixkit.co/music/preview/mixkit-epic-hero-battle-627.mp3',
  victory: 'https://assets.mixkit.co/music/preview/mixkit-winning-elevation-1113.mp3',
  defeat: 'https://assets.mixkit.co/music/preview/mixkit-sad-and-melancholy-311.mp3',
  ambiance: {
    cove: 'https://assets.mixkit.co/sfx/preview/mixkit-crashing-ocean-waves-loop-1510.mp3',
    valley: 'https://assets.mixkit.co/sfx/preview/mixkit-soft-wind-blowing-through-trees-loop-1144.mp3',
    beach: 'https://assets.mixkit.co/sfx/preview/mixkit-tropical-island-beach-loop-1512.mp3',
    den: 'https://assets.mixkit.co/sfx/preview/mixkit-horror-cavern-wind-loop-1153.mp3',
    keep: 'https://assets.mixkit.co/music/preview/mixkit-ethereal-fairy-tale-story-603.mp3'
  }
};

export const NPCS: NPC[] = [
  {
    id: 'eldrin',
    name: 'Eldrin the Scribe',
    title: 'Archive Keeper',
    bonus: '+10% XP Boost',
    description: 'Documents every syllable restored. His archives help you learn faster from every battle.',
    icon: '✒️',
    unlockedAfter: 'ch1'
  },
  {
    id: 'borin',
    name: 'Borin the Blacksmith',
    title: 'Essence Smith',
    bonus: 'Unlock Forging',
    description: 'Forges resonance into raw power. He creates powerful gear from shards and dust.',
    icon: '⚒️',
    unlockedAfter: 'ch2'
  },
  {
    id: 'lyra',
    name: 'Lyra the Minstrel',
    title: 'Voice of Harmony',
    bonus: '+1 Starting Streak',
    description: 'Her songs prime your soul for battle. You start every encounter with a streak already built.',
    icon: '🪕',
    unlockedAfter: 'ch3'
  },
  {
    id: 'finn',
    name: 'Finn the Scout',
    title: 'Shadow Tracker',
    bonus: 'First-Hit Critical',
    description: 'He finds the cracks in the shadows. Your first correct spell will always strike a weak point.',
    icon: '🏹',
    unlockedAfter: 'ch4'
  }
];

export interface ForgeRecipe {
  id: string;
  result: LootItem;
  costs: {
    crystals: number;
    materials: { id: string, amount: number }[];
  };
}

export const FORGE_RECIPES: ForgeRecipe[] = [
  {
    id: 'recipe-staff',
    result: { 
      id: 'crystal-staff', 
      name: 'Resonance Staff', 
      type: 'equipment', 
      rarity: 'rare', 
      icon: '🪄', 
      description: 'Increases Reading Power by 8.',
      stats: { readingPower: 8 }
    },
    costs: { crystals: 100, materials: [{ id: 'whisper-dust', amount: 3 }] }
  },
  {
    id: 'recipe-armor',
    result: { 
      id: 'echo-plate', 
      name: 'Echo Plate', 
      type: 'equipment', 
      rarity: 'rare', 
      icon: '🛡️', 
      description: 'Increases Resilience by 10.',
      stats: { resilience: 10 }
    },
    costs: { crystals: 120, materials: [{ id: 'phonics-shard', amount: 5 }] }
  }
];

export const DECORATIONS: Decoration[] = [
  { id: 'trophy_ch1', name: 'Muffler of Silence', slot: 'wall', icon: '🧣', unlockedAtRestorationLevel: 1 },
  { id: 'desk_crystal', name: 'Resonance Geode', slot: 'desk', icon: '🔮', unlockedAtRestorationLevel: 2 },
  { id: 'rug_sh', name: "Weaver's Rug", slot: 'floor', icon: '🧶', unlockedAtRestorationLevel: 3 },
  { id: 'trophy_ch2', name: 'Vortex Vial', slot: 'wall', icon: '🧪', unlockedAtRestorationLevel: 4 },
  { id: 'desk_quill', name: 'Quill of Truth', slot: 'desk', icon: '🖋️', unlockedAtRestorationLevel: 5 },
];

export const CHAPTERS = [
  {
    id: 'ch1',
    name: 'Consonant Cove',
    isUnlocked: true,
    isCompleted: false,
    background: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=1200',
    ambientAudio: AUDIO_TRACKS.ambiance.cove,
    guardian: {
      id: 'mumbler',
      name: 'The Mumbler',
      title: 'Herald of Fog',
      island: 'Consonant Cove',
      description: 'A fuzzy creature that was once the Guardian of Clarity, now lost in a haze of static.',
      baseHealth: 300,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
      weakness: 'Clear Sounds',
      accentColor: '#8b5cf6'
    }
  },
  {
    id: 'ch2',
    name: 'Vowel Valley',
    isUnlocked: false,
    isCompleted: false,
    background: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1200',
    ambientAudio: AUDIO_TRACKS.ambiance.valley,
    guardian: {
      id: 'vortex',
      name: 'Vowel Vortex',
      title: 'The Sound Storm',
      island: 'Vowel Valley',
      description: 'A chaotic spirit that sucks the melody out of words.',
      baseHealth: 500,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
      weakness: 'Vowel Mastery',
      accentColor: '#f59e0b'
    }
  },
  {
    id: 'ch3',
    name: 'Blend Beach',
    isUnlocked: false,
    isCompleted: false,
    background: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    ambientAudio: AUDIO_TRACKS.ambiance.beach,
    guardian: {
      id: 'beast',
      name: 'The Blend Beast',
      title: 'The Unified Echo',
      island: 'Blend Beach',
      description: 'A multi-limbed creature that thrives on merged sounds. Master blends to tame it.',
      baseHealth: 750,
      image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400',
      weakness: 'Perfect Blends',
      accentColor: '#10b981'
    }
  },
  {
    id: 'ch4',
    name: 'Digraph Den',
    isUnlocked: false,
    isCompleted: false,
    background: 'https://images.unsplash.com/photo-1519302959554-a75be0afc82a?auto=format&fit=crop&q=80&w=1200',
    ambientAudio: AUDIO_TRACKS.ambiance.den,
    guardian: {
      id: 'dragon',
      name: 'Digraph Dragon',
      title: 'The Dual Flame',
      island: 'Digraph Den',
      description: 'A dragon with two heads, representing the power of paired letters.',
      baseHealth: 1000,
      image: 'https://images.unsplash.com/photo-1577493322601-3ae1fbd27098?auto=format&fit=crop&q=80&w=400',
      weakness: 'Paired Prowess',
      accentColor: '#ef4444'
    }
  },
  {
    id: 'ch5',
    name: 'Royal Keep',
    isUnlocked: false,
    isCompleted: false,
    background: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=1200',
    ambientAudio: AUDIO_TRACKS.ambiance.keep,
    guardian: {
      id: 'king',
      name: 'The Silent King',
      title: 'Monarch of Mutes',
      island: 'Royal Keep',
      description: 'The final barrier to restoring the kingdom\'s voice.',
      baseHealth: 1500,
      image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&q=80&w=400',
      weakness: 'Absolute Clarity',
      accentColor: '#fcd34d'
    }
  }
];

export const FALLBACK_QUESTIONS = [
  {
    word: 'ship',
    displayWord: '__ip',
    correctDigraph: 'sh',
    options: ['sh', 'ch', 'th', 'wh'],
    meaning: 'A large boat that sails on the ocean.'
  },
  {
    word: 'chair',
    displayWord: '__air',
    correctDigraph: 'ch',
    options: ['ch', 'sh', 'ph', 'th'],
    meaning: 'Something you sit on.'
  }
];

export const ASSETS = {
  hero: 'https://images.unsplash.com/photo-1635339001026-611295b29091?auto=format&fit=crop&q=80&w=400'
};
