# ⚔️ Phonics Quest: Crystal Chronicles

> **An AI-powered educational RPG where phonics mastery is the ultimate combat system. Battle legendary guardians and restore the kingdom's voice through literacy.**

Phonics Quest is an immersive educational RPG designed to transform phonics learning into an epic adventure. Children become **Word Weavers**, mastering the ancient art of digraphs and blends to battle shadow guardians and restore voice to the Phonics Kingdom.

## 🌟 Key Features

### 🎮 The RPG Battle Loop
Every lesson is a high-stakes encounter.
- **Spell Casting**: Answering phonics questions correctly casts powerful spells.
- **Health Systems**: Dual health bars for both the Hero and the Guardian.
- **Combo System**: Consecutive correct answers build a damage multiplier (up to 2.5x).
- **Critical Hits**: High-streak and focus-based performance triggers massive damage animations.
- **Voice Mastery**: Integrated voice recognition for real-time pronunciation validation.

### 🐉 Legendary Guardians
Progress through themed chapters, each guarded by a unique shadow creature:
- **Consonant Cove**: Guarded by **The Mumbler**, Herald of Fog.
- **Vowel Valley**: Guarded by **Vowel Vortex**, the Sound Storm.
- **Blend Beach**: Guarded by **The Blend Beast**, the Unified Echo.
- **Digraph Den**: Guarded by **Digraph Dragon**, the Dual Flame.
- **Royal Keep**: The final challenge against **The Silent King**, Monarch of Mutes.

### 🏹 Progression & Meta-Game
- **XP & Leveling**: Earn experience from battles to grow stronger.
- **Attribute Scaling**: Improve **Reading Power**, **Focus**, **Speed**, and **Resilience**.
- **Sanctuary & NPCs**: Rescue specialists like Eldrin the Scribe and Borin the Blacksmith to unlock permanent bonuses.
- **Kingdom Restoration**: Restore the kingdom to earn "Restoration Caches" and customize the **Hero's Room**.
- **Quest Log**: Track narrative trials and daily challenges for extra rewards.

## 🛠 Technology Stack

- **Frontend**: React 19 (Hooks, useReducer, TypeScript)
- **Styling**: Tailwind CSS with custom holographic glow and battle animation effects.
- **AI Engine**: 
    - **Google Gemini 3 Flash**: Dynamic question generation and epic battle narration.
    - **Google Gemini 2.5 Flash TTS**: High-quality phoneme and word pronunciation.
    - **Google Gemini Live API**: Real-time voice interaction and validation.
- **Persistence**: LocalStorage-based save system.

## 📁 Project Structure

```text
├── index.html           # Entry point & Tailwind configuration
├── index.tsx            # React root mounting
├── App.tsx              # View orchestrator & main game state
├── battleEngine.ts      # Core RPG combat & damage logic
├── geminiService.ts     # Gemini API integration for content & TTS
├── constants.ts         # Lore, Chapter definitions, and Asset paths
├── types.ts             # Global TypeScript interfaces
├── components/          # UI Component Library
│   ├── Arena.tsx        # 3D-feel battle stage & animations
│   ├── HUD.tsx          # Real-time stats & combat indicators
│   ├── Sanctuary.tsx    # NPC hub & restoration mechanics
│   ├── HeroRoom.tsx     # Customization & decoration interface
│   ├── KingdomLedger.tsx # Analytics & roadmap viewer
│   └── ...              # Sub-view components (Quests, Activities)
└── utils/               # Utility functions
    ├── audioUtils.ts    # PCM audio decoding & TTS playback
    ├── rewardsCalculator.ts # Loot & XP logic
    └── rewardUtils.ts   # Smart ID generation
```

## 🚀 Getting Started

1. Ensure you have an API key for the **Google Gemini API**.
2. The application expects the API key to be available via `process.env.API_KEY`.
3. Launch the `index.html` to start your journey.
4. **Note**: Audio requires a user interaction (button click) to initialize the Web Audio Context.

## 📜 Educational Pedagogy
Phonics Quest follows a **Game-First Learning** approach. By hiding learning metrics behind "Reading Power" and "Spell Mastery," children develop intrinsic motivation. The AI dynamically adjusts question difficulty based on the player's level, ensuring a "Flow State" that balances challenge and success.

---
*Created by the Word Weavers Guild - March 2025*