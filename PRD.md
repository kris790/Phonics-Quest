# 📜 Product Requirements Document: Phonics Quest

## 1. Executive Summary
**Phonics Quest: Crystal Chronicles** is a high-fidelity educational RPG designed for primary-age children. It gamifies phonics learning (specifically digraphs and blends) by wrapping it in a classic RPG combat loop where "spells" are cast by solving literacy puzzles.

## 2. Project Vision
To move away from "dry" educational apps and create a "vibe-first" learning experience where the player feels like a powerful hero (Word Weaver) restoring a broken kingdom.

## 3. Core User Stories
- **As a Player**, I want to battle cool monsters by correctly identifying sounds so that I feel rewarded for learning.
- **As a Player**, I want to see the world change after I win (Restoration Visions) so that my progress feels impactful.
- **As a Player**, I want to collect unique magical items (Artifacts) that are generated just for me.
- **As a Parent/Teacher**, I want to see a detailed "Kingdom Ledger" that tracks progress and shows the educational roadmap.

## 4. Functional Requirements

### 4.1 Combat System (The Battle Engine)
- **Turn-Based RPG**: Player and Guardian exchange turns.
- **Phonics Spells**: Correct answers deal damage; incorrect answers trigger Guardian counter-attacks.
- **Combo System**: Multipliers (up to 2.5x) for consecutive correct answers.
- **Critical Hits**: Based on "Focus" attribute and performance speed.
- **Power-ups**: Consumables for healing, hints, shields, and time stasis.

### 4.2 AI Orchestration (Gemini Integration)
- **Content Generation (Gemini 3 Flash)**: Dynamic generation of digraph puzzles, battle narrations, and relic descriptions.
- **Voice Synthesis (Gemini 2.5 Flash TTS)**: Real-time audio pronunciation of target words and narrations.
- **Voice Validation (Gemini Live API)**: Real-time microphone input processing to validate the player's spoken pronunciation.
- **Unique Assets (Gemini 2.5 Flash Image)**: Generation of one-of-a-kind crystalline artifacts upon boss defeat.
- **Cinematics (Veo 3.1)**: Generation of 720p 16:9 video sequences showing the restoration of an island.

### 4.3 Progression & Meta-Game
- **The Sanctuary**: A hub for rescued NPCs (Eldrin, Borin, Lyra, Finn) who provide permanent passive buffs.
- **Kingdom Restoration**: A "Restoration Meter" that fills as the player heals islands, leading to "Restoration Caches."
- **The Hero's Room**: A customizable space where players display generated artifacts and placed decorations.
- **Character Growth**: Attribute scaling for Reading Power, Focus, Speed, and Resilience using earned Resonance Crystals.

## 5. Technical Specifications
- **Stack**: React 19, Tailwind CSS, Google Gemini SDK (@google/genai).
- **Persistence**: `localStorage` based save-state management (`phonics_quest_save_v3`).
- **Audio**: Web Audio Context for PCM streaming and high-quality spatial ambiance.
- **Security**: Mandatory API Key selection flow for high-cost models (Veo).
- **Environment**: Hard requirement for `process.env.API_KEY`.

## 6. Visual Design Language
- **Theme**: "Holographic Crystal" — Dark backgrounds (`#060613`) contrasted with vibrant cyan (`#0ddff2`) and gold highlights.
- **Layout**: Mobile-first portrait orientation (optimized for 430px width).
- **Animations**: CSS-based transitions, projectile effects, and screen-shake feedback for impact.

## 7. Roadmap & Future Scope
- **Q1-Q2**: AI Artifacts and Veo Visions (The Weaver's Vision Update).
- **Q3**: Multi-profile support for classrooms.
- **Q4**: Global Leaderboards (Hall of Weavers).

---
*Version: 2.1.0 | Status: Active Development*