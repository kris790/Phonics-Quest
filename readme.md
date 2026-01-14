
# ⚔️ Phonics Quest: Crystal Chronicles

> **An AI-powered educational RPG where phonics mastery is the ultimate combat system. Battle legendary guardians and restore the kingdom's voice through literacy.**

Phonics Quest is an immersive educational RPG designed to transform phonics learning into an epic adventure. Children become **Word Weavers**, mastering the ancient art of digraphs and blends to battle shadow guardians and restore voice to the Phonics Kingdom.

## 🌟 Key Features

### 🎮 The RPG Battle Loop
Every lesson is a high-stakes encounter.
- **Spell Casting**: Answering phonics questions correctly casts powerful spells.
- **Health Systems**: Dual health bars for both the Hero and the Guardian.
- **Combo System**: Consecutive correct answers build a damage multiplier (up to 5x).
- **Critical Hits**: High-streak performance triggers massive damage animations.

### 🐉 Legendary Guardians
Progress through themed chapters, each guarded by a unique shadow creature:
- **The Mumbler (Consonant Cove)**: Defeat the fog-voice with clear sounds.
- **Vowel Vortex (Vowel Valley)**: Calm the storms of melody.
- **Blend Beast (Blend Beach)**: Re-unify the shattered sounds.
- **Digraph Dragon (Digraph Den)**: Protect the power of letter pairs.
- **The Silent King (Royal Keep)**: The final challenge to restore the Kingdom.

### 🏹 Progression & Quests
- **XP & Leveling**: Earn experience from battles to grow stronger.
- **Attribute Scaling**: Improve stats like **Reading Power** (Damage) and **Resilience** (Defense).
- **Quest Log**: Track main story objectives and daily challenges.
- **World Map**: Navigate through the islands of the Phonics Kingdom.

## 🛠 Technology Stack

- **Frontend**: React (Hooks, useReducer for State Management)
- **Styling**: Tailwind CSS (with custom holographic and battle animations)
- **AI Engine**: Google Gemini API (Dynamic content generation for questions and battle narration)
- **Icons**: Google Material Symbols

## 📁 Project Structure

```text
├── App.tsx             # Main Game Loop & View Orchestrator
├── battleEngine.ts      # Core RPG Battle Logic & Mechanics
├── constants.ts        # Game Data, Chapter Definitions & Assets
├── types.ts            # Comprehensive TypeScript Interfaces
├── services/
│   └── geminiService.ts # AI Content & Narration Integration
└── components/
    ├── HUD.tsx         # Player Stats, HP, and Streak UI
    ├── Arena.tsx       # 3D-feel Battle Visuals & Animations
    └── Overlay.tsx     # Combat Interaction & Narrative Feedback
```

## 🚀 Getting Started

1. Ensure you have an API key for the **Google Gemini API**.
2. The application expects the API key to be available via `process.env.API_KEY`.
3. Launch the `index.html` to start your journey.

## 📜 Educational Pedagogy
Phonics Quest follows a **Game-First Learning** approach. By hiding learning metrics behind "Reading Power" and "Spell Mastery," children develop intrinsic motivation. The AI dynamically adjusts question difficulty based on the player's level, ensuring a "Flow State" that is neither too easy nor too frustrating.

---
*Created by the Word Weavers Guild - March 2025*
