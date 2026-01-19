# ⚔️ Phonics Quest – Ship-It Checklist
Senior-dev distilled from 20+ yrs of kids’ ed-tech, MMOs, and voice-first games.  
Tick ✅ when merged + deployed; keep file in repo root for living history.

---

## 0. Beta Blockers (MUST)
| Task | Owner | Status | Notes |
|---|---|---|---|
| Keyboard full loop (Tab ▸ Space ▸ Enter) | UX | ✅ | Integrated in App.tsx / focus management |
| iOS Safari AudioContext resume on *every* gesture | Audio | ✅ | Added to all main click/keydown events |
| Mic permission denial toast + retry CTA | UI | ✅ | Added toast notification for denial |
| Settings panel: timeout slider (3–10 s), mute, voice gender | UI | ✅ | SettingsPanel.tsx active |
| Error Boundary per route + Sentry report | Ops | ✅ | ErrorBoundary component wrapped around root |
| Lighthouse ≥ 90 accessibility & < 2 s FID | Perf | ⬜ | FID tuning needed |

---

## 1. Retention Layer (Sticky)
| Task | Owner | Status | Notes |
|---|---|---|---|
| Daily spin (free crystals 24 h cooldown) | Econ | ✅ | Sanctuary.tsx Daily Wheel active |
| Streak calendar (flame HUD, 36 h grace) | Econ | ✅ | Logic implemented in App.tsx; Visual flame in HUD.tsx |
| Pet egg → hatch after 3 wins | Game | ✅ | Hatchery system implemented |
| OneSignal push re-engage (48 h idle) | Mar | ⬜ | Opt-in only |

---

## 2. Safety & Legal
| Task | Owner | Status | Notes |
|---|---|---|---|
| COPPA audit: zero PII, deviceUUID only | Legal | ⬜ | School gatekeeper |
| Voice clips **never persisted** – real-time only | Legal | ✅ | Real-time streaming only via Live API |
| Privacy policy (iubenda COPPA clause) | Legal | ⬜ | $29 / yr |
| Teacher deployment guide (5-click PDF) | Mar | ⬜ | District requirement |

---

## 3. Content Pipeline (Scalable)
| Task | Owner | Status | Notes |
|---|---|---|---|
| Google-Sheet → Firestore CMS for questions | Tools | ⬜ | Designers deploy in 60 s |
| Narrative YAML + Mustache hot-load | Tools | ⬜ | Writer drop |
| Guardian AI pattern JSON schema | Game | ✅ | BattleEngine logic uses pattern sets |

---

## 4. Monetisation (Ethical)
| Tier | Price | Status | Tech |
|---|---|---|---|
| Free chapters 1–3 | $0 | ✅ | Standard game flow |
| Home pass (all ch, 3 pets) | $4.99/mo | ⬜ | Stripe + Apple Pay |
| Classroom seat | $2.50/mo | ⬜ | Stripe invoice + LTI 1.3 |

---

## 5. Ops & Observability
| Task | Owner | Status | Notes |
|---|---|---|---|
| Sentry React crash alerts | Ops | ⬜ | Slack `#phonics-alerts` |
| Custom metric: `voice_timeout_rate` > 5 % page | Ops | ⬜ | Prometheus |
| Save SHA-256 corruption check | Ops | ⬜ | Auto-recover backup |
| p95 Gemini latency < 800 ms | Ops | ⬜ | Cloud Run autoscale |

---

## 6. Device & Edge Cases
| Device | Test | Status | Notes |
|---|---|---|---|
| iPad 6th gen (iOS 15) | Mic + WebGL | ⬜ | School staple |
| Crappy Android (2 GB RAM) | 30-tab memory | ⬜ | Slow chromebook equiv. |
| School Chromebook | Offline audio fail | ⬜ | Cache `.mp3` fallbacks |

---

## 7. 4-Week Sprint Roadmap
| Week | Goal | Status |
|---|---|---|
| W1 Harden | Beta blockers closed | ✅ |
| W2 Stick | Daily spin, streak, pet | ✅ |
| W3 Legal | COPPA, privacy, teacher FAQ | ⬜ |
| W4 Soft | Private beta 100 kids | ⬜ |

---

## 8. Ship Check (Release Tag)
- [ ] Version bump `package.json` → `1.0.0-beta.0`  
- [ ] Tag & changelog `git tag -a v1.0.0-beta.0 -m "Beta soft-launch"`  
- [ ] Upload to TestFlight + Google Closed Testing  
- [ ] Send teacher beta invite link (Google Form)  
- [ ] Schedule retrospective 2 weeks post-launch

---

**Rule of thumb:**  
*“Works in my Chrome” ≠ shipped.  
If a 3rd-grade class can’t deploy it in 5 clicks, we’re dead.*
