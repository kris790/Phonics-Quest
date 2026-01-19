# ⚔️ Phonics Quest – Ship-It Checklist (PRD v1.0 Alignment)
Senior-dev distilled from 20+ yrs of kids’ ed-tech, MMOs, and voice-first games.  
Tick ✅ when merged + deployed; keep file in repo root for living history.

---

## 0. P0: Beta Blockers & PRD Compliance
| Task | Owner | Status | Notes |
|---|---|---|---|
| **Keyboard full loop** (Tab ▸ Space ▸ Enter) | UX | ✅ | Integrated in App.tsx / focus management |
| **iOS Safari AudioContext** resume hook | Audio | ✅ | Added to all main click/keydown events |
| **Mic permission denial** toast + retry CTA | UI | ✅ | App.tsx + Toast.tsx integration |
| **Voice Timeout Slider** (3–10s) | UI | ✅ | SettingsPanel.tsx (PRD 5.1 AC-3) |
| **Fallback Tap Mode** (Mic denied flow) | UI | ✅ | Button interaction always active (PRD 5.1 AC-2) |
| **Error Boundary** (Root-level protection) | Ops | ✅ | ErrorBoundary component wrapped around root |
| **Performance Audit** (FID < 2s) | Perf | ✅ | Lazy-load optimizations and hydration fixes |

---

## 1. P0: Retention Layer (Sticky Mechanics)
| Task | Owner | Status | Notes |
|---|---|---|---|
| **Daily Spin** (free crystals/eggs 24h) | Econ | ✅ | Sanctuary.tsx Daily Wheel active |
| **Daily Streak** (36h grace, HUD flame) | Econ | ✅ | Logic in App.tsx; Visual flame in HUD.tsx |
| **Pet Egg Hatchery** (3 wins requirement) | Game | ✅ | ProgressionState + Hatchery system |
| **Character Meta** (Restoration RP & Decos) | Game | ✅ | Sanctuary & HeroRoom meta-progression |

---

## 2. P0: Teacher & Parent Insights
| Task | Owner | Status | Notes |
|---|---|---|---|
| **Parent Portal** (Educational Ledger) | UI | ✅ | ParentDashboard.tsx implemented |
| **CSV Export** (Digraph Mastery) | Data | ✅ | Mastery-to-CSV logic (PRD 5.3 AC-2) |
| **Voice clips zero-persistence** | Legal | ✅ | Gemini Live streaming only (Privacy First) |
| **COPPA Compliance Audit** | Legal | ⬜ | Pending legal final review |

---

## 3. P1: Content & AI Orchestration
| Task | Owner | Status | Notes |
|---|---|---|---|
| **Gemini 3 Flash** (Content Gen) | AI | ✅ | Dynamic question pipeline in geminiService |
| **Gemini 2.5 Flash Image** (Relics) | AI | ✅ | Artifact generation system implemented |
| **Veo 3.1 Visions** (Restoration Video) | AI | ✅ | Sanctuary "Watch Vision" flow (PRD 5.2) |
| **Guardian AI Patterns** (JSON Schema) | Game | ✅ | BattleEngine logic uses weighted patterns |

---

## 4. P2: Monetization & Growth
| Tier | Price | Status | Tech |
|---|---|---|---|
| Free chapters 1–3 | $0 | ✅ | Standard game flow |
| Home pass (all ch, 3 pets) | $4.99/mo | ⬜ | Stripe + Apple Pay integration pending |
| Classroom seat | $2.50/mo | ⬜ | B2B Portal pending |

---

## 5. Upcoming Sprints (4-Week Roadmap)
| Week | Goal | Status |
|---|---|---|
| **W1 Harden** | Beta blockers & Audio fixes | ✅ |
| **W2 Stick** | Daily spin, streak, pet system | ✅ |
| **W3 Data** | Teacher/Parent insights & CSVs | ✅ |
| **W4 Launch** | Private beta for 100 families | ⬜ |

---

**Rule of thumb:**  
*“Works in my Chrome” ≠ shipped.  
If a 3rd-grade class can’t deploy it in 5 clicks, we’re dead.*
