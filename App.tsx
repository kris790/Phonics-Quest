
import React, { useState, useEffect, useReducer, useRef, useMemo } from 'react';
import HUD from './components/HUD';
import Arena from './components/Arena';
import Overlay from './components/Overlay';
import CharacterSheet from './components/CharacterSheet';
import Sanctuary from './components/Sanctuary';
import HeroRoom from './components/HeroRoom';
import QuestLog from './components/QuestLog';
import KingdomLedger from './components/KingdomLedger';
import VictoryScreen from './components/battle/VictoryScreen';
import DefeatScreen from './components/battle/DefeatScreen';
import AudioEngine from './components/AudioEngine';
import SettingsPanel from './components/SettingsPanel';
import ParentDashboard from './components/ParentDashboard';
import TutorialOverlay from './components/TutorialOverlay';
import Toast, { ToastType } from './components/Toast';
import { RootState, BattleState, AnimationState, PhonicsTask, AppState, Chapter, Attributes, Quest, ActivityEntry, Artifact, GameSettings, Pet, Egg, BattleRewards } from './types';
import { BattleEngine } from './battleEngine';
import { fetchQuestions, getNarrativeFeedback, generateSpeech } from './geminiService';
import { playTTS, resumeAudioContext } from './utils/audioUtils';
import { CHAPTERS, NPCS, ASSETS } from './constants';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { calculateBattleRewards } from './utils/rewardsCalculator';
import { generateSmartId } from './utils/rewardUtils';

const SAVE_KEY = 'phonics_quest_save_v4_pets';

type Action = 
  | { type: 'INIT_BATTLE'; tasks: PhonicsTask[]; chapter: Chapter }
  | { type: 'UPDATE_BATTLE'; state: Partial<BattleState> }
  | { type: 'SET_PHASE'; phase: BattleState['phase'] }
  | { type: 'SET_FEEDBACK'; text: string }
  | { type: 'SET_VIEW'; view: AppState }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'ADD_CRYSTALS'; amount: number }
  | { type: 'COMPLETE_CHAPTER'; chapterId: string; artifact?: Artifact }
  | { type: 'UPGRADE_ATTRIBUTE'; attribute: keyof Attributes; cost: number }
  | { type: 'ADD_RESTORATION_POINTS'; amount: number }
  | { type: 'CLAIM_RESTORATION_REWARD' }
  | { type: 'EQUIP_DECORATION'; slot: string; decorationId: string }
  | { type: 'UPDATE_QUEST_PROGRESS'; questId: string; amount: number }
  | { type: 'CLAIM_QUEST_REWARD'; questId: string }
  | { type: 'USE_POWERUP'; powerupType: keyof BattleState['availablePowerups'] }
  | { type: 'LOG_ACTIVITY'; log: Omit<ActivityEntry, 'id' | 'timestamp'> }
  | { type: 'UPDATE_SETTINGS'; updates: Partial<GameSettings> }
  | { type: 'RECORD_ATTEMPT'; digraph: string; isCorrect: boolean }
  | { type: 'SET_TUTORIAL_SEEN' }
  | { type: 'INSTANT_VICTORY' }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_SAVE'; savedState: Partial<RootState> }
  | { type: 'SELECT_CHAPTER'; chapterId: string }
  | { type: 'DAILY_SPIN'; rewardType: 'crystals' | 'egg'; amount?: number; rarity?: 'common' | 'rare' | 'epic' }
  | { type: 'HATCH_EGG'; eggId: string; pet: Pet }
  | { type: 'SET_ACTIVE_PET'; petId: string | null }
  | { type: 'CHECK_STREAK' };

const initialSettings: GameSettings = {
  ttsVoice: 'Kore',
  voiceTimeout: 6000,
  isMuted: false,
  debugMode: false
};

const initialState: RootState = {
  view: 'world-map',
  battle: BattleEngine.startBattle([], CHAPTERS[0].guardian, 1),
  progression: { 
    level: 1, 
    xp: 0, 
    maxXp: 100, 
    crystalsFound: 50,
    unlockedChapters: ['ch1'],
    attributes: { readingPower: 5, focus: 5, speed: 5, resilience: 5 },
    unlockedNPCs: [],
    restorationPoints: 0,
    restorationLevel: 0,
    decorations: {},
    artifacts: [],
    recentActivities: [],
    hasSeenTutorial: false,
    accuracyData: {},
    settings: initialSettings,
    pets: [],
    activePetId: null,
    activeEggs: [],
    lastSpinTimestamp: null,
    dailyStreak: 0,
    lastLoginDate: null
  },
  quests: { 
    activeQuests: [
      { id: 'q1', title: 'The First Awakening', description: 'Defeat the Mumbler', progress: 0, target: 1, isComplete: false, rewardXp: 100 },
      { id: 'q2', title: 'Focused Echoes', description: 'Achieve a 5x Combo Streak', progress: 0, target: 1, isComplete: false, rewardXp: 50 },
      { id: 'q3', title: 'Crystal Hoarder', description: 'Collect 50 Resonance Crystals', progress: 0, target: 50, isComplete: false, rewardXp: 75 }
    ] 
  },
  chapters: CHAPTERS,
  currentChapterId: 'ch1'
};

function rootReducer(state: RootState, action: Action): RootState {
  switch (action.type) {
    case 'INIT_BATTLE':
      return { 
        ...state, 
        view: 'battle',
        currentChapterId: action.chapter.id,
        battle: BattleEngine.startBattle(action.tasks, action.chapter.guardian, state.progression.level, state.progression.unlockedNPCs) 
      };
    case 'UPDATE_BATTLE':
      return { ...state, battle: { ...state.battle, ...action.state } };
    case 'INSTANT_VICTORY':
      return { ...state, battle: { ...state.battle, guardianHealth: 0, phase: 'victory' } };
    case 'USE_POWERUP':
      return { ...state, battle: BattleEngine.usePowerup(state.battle, action.powerupType) };
    case 'SET_PHASE':
      return { ...state, battle: { ...state.battle, phase: action.phase } };
    case 'SET_FEEDBACK':
      return { ...state, battle: { ...state.battle, feedback: action.text } };
    case 'SET_VIEW':
      return { ...state, view: action.view };
    case 'SELECT_CHAPTER':
      return { ...state, currentChapterId: action.chapterId };
    case 'UPDATE_SETTINGS':
      return { ...state, progression: { ...state.progression, settings: { ...state.progression.settings, ...action.updates } } };
    case 'RECORD_ATTEMPT': {
      const data = state.progression.accuracyData[action.digraph] || { digraph: action.digraph, attempts: 0, correct: 0 };
      const updatedData = { ...data, attempts: data.attempts + 1, correct: action.isCorrect ? data.correct + 1 : data.correct };
      return { ...state, progression: { ...state.progression, accuracyData: { ...state.progression.accuracyData, [action.digraph]: updatedData } } };
    }
    case 'DAILY_SPIN': {
      const logs = [...state.progression.recentActivities];
      let newCrystals = state.progression.crystalsFound;
      let newEggs = [...state.progression.activeEggs];
      
      if (action.rewardType === 'crystals') {
        newCrystals += action.amount || 0;
        logs.push({ id: generateSmartId('spin'), type: 'reward_claimed', description: `Won ${action.amount} Crystals from the Daily Wheel!`, timestamp: Date.now() });
      } else if (action.rewardType === 'egg') {
        newEggs.push({ id: `egg-${Date.now()}`, rarity: action.rarity || 'common', incubationProgress: 0, incubationTarget: action.rarity === 'epic' ? 5 : action.rarity === 'rare' ? 3 : 1, isReady: false });
        logs.push({ id: generateSmartId('spin'), type: 'reward_claimed', description: `Won a ${action.rarity} Resonance Egg from the Daily Wheel!`, timestamp: Date.now() });
      }
      return { ...state, progression: { ...state.progression, crystalsFound: newCrystals, activeEggs: newEggs, lastSpinTimestamp: Date.now(), recentActivities: logs.slice(-20) } };
    }
    case 'HATCH_EGG': {
        const logs = [...state.progression.recentActivities];
        logs.push({ id: generateSmartId('hatch'), type: 'pet_hatched', description: `Hatched ${action.pet.name}, your new companion!`, timestamp: Date.now() });
        return {
            ...state,
            progression: {
                ...state.progression,
                activeEggs: state.progression.activeEggs.filter(e => e.id !== action.eggId),
                pets: [...state.progression.pets, action.pet],
                recentActivities: logs.slice(-20)
            }
        };
    }
    case 'SET_ACTIVE_PET':
        return { ...state, progression: { ...state.progression, activePetId: action.petId } };
    case 'SET_TUTORIAL_SEEN':
      return { ...state, progression: { ...state.progression, hasSeenTutorial: true } };
    case 'ADD_XP': {
      let newXp = state.progression.xp + action.amount;
      let newLevel = state.progression.level;
      let newMaxXp = state.progression.maxXp;
      const logs = [...state.progression.recentActivities];
      
      while (newXp >= newMaxXp) {
        newLevel++;
        newXp -= newMaxXp;
        newMaxXp = Math.floor(newMaxXp * 1.5);
        logs.push({
          id: generateSmartId('level-up'),
          type: 'level_up',
          description: `Ascended to Power Level ${newLevel}!`,
          timestamp: Date.now()
        });
      }
      return {
        ...state,
        progression: { ...state.progression, xp: newXp, level: newLevel, maxXp: newMaxXp, recentActivities: logs.slice(-20) }
      };
    }
    case 'ADD_CRYSTALS':
      return { ...state, progression: { ...state.progression, crystalsFound: state.progression.crystalsFound + action.amount } };
    case 'COMPLETE_CHAPTER': {
      const chapterIdx = state.chapters.findIndex(c => c.id === action.chapterId);
      const nextChapterIdx = chapterIdx + 1;
      const newChapters = [...state.chapters];
      const ch = newChapters[chapterIdx];
      newChapters[chapterIdx] = { ...newChapters[chapterIdx], isCompleted: true };
      if (nextChapterIdx < newChapters.length) {
        newChapters[nextChapterIdx] = { ...newChapters[nextChapterIdx], isUnlocked: true };
      }
      
      const newNPC = NPCS.find(n => n.unlockedAfter === action.chapterId);
      const newUnlockedNPCs = newNPC && !state.progression.unlockedNPCs.includes(newNPC.id)
        ? [...state.progression.unlockedNPCs, newNPC.id]
        : state.progression.unlockedNPCs;

      const logs = [...state.progression.recentActivities];
      logs.push({ id: generateSmartId('chapter-victory'), type: 'battle_victory', description: `Echo of ${ch.name} restored.`, timestamp: Date.now() });
      if (action.artifact) logs.push({ id: generateSmartId('artifact'), type: 'artifact_forged', description: `Forged relic: ${action.artifact.name}.`, timestamp: Date.now() });

      // Progress eggs
      const newEggs = state.progression.activeEggs.map(egg => {
          const newProgress = Math.min(egg.incubationTarget, egg.incubationProgress + 1);
          return { ...egg, incubationProgress: newProgress, isReady: newProgress >= egg.incubationTarget };
      });

      return { 
        ...state, 
        chapters: newChapters,
        progression: { 
          ...state.progression, 
          unlockedNPCs: newUnlockedNPCs,
          restorationPoints: state.progression.restorationPoints + 100,
          artifacts: action.artifact ? [...state.progression.artifacts, action.artifact] : state.progression.artifacts,
          activeEggs: newEggs,
          recentActivities: logs.slice(-20)
        }
      };
    }
    case 'UPGRADE_ATTRIBUTE':
      return {
        ...state,
        progression: {
          ...state.progression,
          crystalsFound: state.progression.crystalsFound - action.cost,
          attributes: { ...state.progression.attributes, [action.attribute]: state.progression.attributes[action.attribute] + 1 }
        }
      };
    case 'CHECK_STREAK': {
      const now = Date.now();
      const last = state.progression.lastLoginDate;
      if (!last) {
        return { ...state, progression: { ...state.progression, lastLoginDate: now, dailyStreak: 1 } };
      }
      
      const diff = now - last;
      const oneDay = 86400000;
      const thirtySixHours = 129600000;

      if (diff > thirtySixHours) {
        // Streak lost
        return { ...state, progression: { ...state.progression, lastLoginDate: now, dailyStreak: 1 } };
      } else if (diff >= oneDay) {
        // Increment streak
        return { ...state, progression: { ...state.progression, lastLoginDate: now, dailyStreak: state.progression.dailyStreak + 1 } };
      }
      // Same day login, do nothing to streak count
      return { ...state, progression: { ...state.progression, lastLoginDate: now } };
    }
    case 'RESET_GAME':
      localStorage.removeItem(SAVE_KEY);
      return { ...initialState };
    case 'LOAD_SAVE':
      return { 
        ...state, 
        progression: { ...initialState.progression, ...action.savedState.progression }, 
        chapters: action.savedState.chapters || initialState.chapters,
        quests: action.savedState.quests || initialState.quests
      };
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const liveSessionRef = useRef<any>(null);
  
  const isMuted = state.progression.settings.isMuted;
  const activePet = state.progression.pets.find(p => p.id === state.progression.activePetId);

  // Persistence Loading
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_SAVE', savedState: parsed }); 
      } catch (e) { console.error(e); }
    }
  }, []);

  // Check Daily Streak on startup
  useEffect(() => {
    if (isStarted) {
      dispatch({ type: 'CHECK_STREAK' });
    }
  }, [isStarted]);

  // Persistence Saving
  useEffect(() => {
    const saveState = { progression: state.progression, chapters: state.chapters, quests: state.quests };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveState));
  }, [state.progression, state.chapters, state.quests]);

  // Accessibility: Global Keyboard Loop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Logic for battle options shortcuts (1-4)
      if (state.view === 'battle' && state.battle.phase === 'player-turn' && mappedGameState.currentQuestion) {
        const options = mappedGameState.currentQuestion.options;
        const keyMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3 };
        if (keyMap[e.key] !== undefined) {
          const idx = keyMap[e.key];
          if (options[idx]) handleSelect(options[idx]);
        }
      }
      
      // Escape to return to map from subviews
      if (e.key === 'Escape' && state.view !== 'world-map' && state.view !== 'battle') {
        dispatch({ type: 'SET_VIEW', view: 'world-map' });
      }

      // Resume Audio on every gesture for iOS
      resumeAudioContext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.view, state.battle.phase, state.currentChapterId]);

  const mappedGameState = useMemo(() => ({
    playerHP: state.battle.playerHealth,
    enemyHP: state.battle.guardianHealth,
    maxHP: state.battle.playerMaxHealth,
    streak: state.battle.comboStreak,
    level: state.progression.level,
    status: (state.battle.phase === 'victory' || state.battle.phase === 'defeat') ? state.battle.phase : (state.battle.phase === 'player-turn' ? 'playing' : 'animating') as any,
    currentQuestion: state.battle.tasks[state.battle.currentTaskIndex] || null,
    feedback: state.battle.feedback,
    lastDamage: state.battle.taskResults[state.battle.taskResults.length - 1]?.damageDealt || null,
    isCritical: state.battle.taskResults[state.battle.taskResults.length - 1]?.criticalHit || false,
  }), [state.battle, state.progression.level]);

  const currentChapter = useMemo(() => 
    state.chapters.find(c => c.id === state.currentChapterId) || state.chapters[0]
  , [state.chapters, state.currentChapterId]);

  const startGame = async () => {
    await resumeAudioContext();
    setIsStarted(true);
  };

  const startChapter = async (chapter: Chapter) => {
    setLoading(true);
    try {
      const questions = await fetchQuestions(state.progression.level);
      const tasks: PhonicsTask[] = questions.map((q, i) => ({ 
        ...q, 
        taskId: `task-${i}-${Date.now()}` 
      }));
      dispatch({ type: 'INIT_BATTLE', tasks, chapter });
    } catch (e) {
      showToast("The echoes are unstable. Try again in a moment.", 'error');
      console.error("Failed to start chapter", e);
    } finally {
      setLoading(false);
    }
  };

  const handleBattleEnd = (victory: boolean, rewards?: BattleRewards | null, artifact?: Artifact) => {
    if (victory) {
      const actualRewards = rewards || calculateBattleRewards(state.battle, state.progression.unlockedNPCs);
      dispatch({ type: 'ADD_XP', amount: actualRewards.xp });
      dispatch({ type: 'ADD_CRYSTALS', amount: actualRewards.crystals });
      dispatch({ type: 'COMPLETE_CHAPTER', chapterId: state.currentChapterId, artifact });
      showToast("Victory! The resonance is restored.", 'success');
    }
    dispatch({ type: 'SET_VIEW', view: 'world-map' });
  };

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  const speak = async (text: string) => {
    const audioData = await generateSpeech(text, state.progression.settings.ttsVoice);
    if (audioData) playTTS(audioData);
  };

  const handleSelect = async (selected: string) => {
    if (state.battle.phase !== 'player-turn') return;
    const currentTask = state.battle.tasks[state.battle.currentTaskIndex];
    const isCorrect = selected.toLowerCase() === currentTask.correctDigraph.toLowerCase();
    
    dispatch({ type: 'RECORD_ATTEMPT', digraph: currentTask.correctDigraph, isCorrect });
    if (navigator.vibrate) navigator.vibrate(isCorrect ? 50 : [50, 50, 50]);

    const modifiedAttributes = { ...state.progression.attributes };
    if (activePet?.buffType === 'damage_reduction') modifiedAttributes.resilience += 5;
    if (activePet?.buffType === 'crit_boost') modifiedAttributes.focus += 10;

    const { nextState } = BattleEngine.processTurn(state.battle, isCorrect, modifiedAttributes);
    
    getNarrativeFeedback(isCorrect, currentTask.word, nextState.comboStreak, state.progression.settings.ttsVoice).then((aiFeedback) => {
      dispatch({ type: 'UPDATE_BATTLE', state: { feedback: aiFeedback.text, audioFeedback: aiFeedback.audio } });
    });

    if (isCorrect) {
      setAnimationState('attacking');
      dispatch({ type: 'UPDATE_BATTLE', state: nextState });
      setTimeout(() => {
        setAnimationState('taking-damage');
        setTimeout(() => {
          setAnimationState('idle');
          dispatch({ type: 'UPDATE_BATTLE', state: BattleEngine.checkCompletion(nextState) });
        }, 1000);
      }, 800);
    } else {
      setAnimationState('hit-shake');
      dispatch({ type: 'SET_PHASE', phase: 'guardian-turn' });
      const guardianState = BattleEngine.processGuardianTurn(nextState, modifiedAttributes.resilience);
      setTimeout(() => {
        dispatch({ type: 'UPDATE_BATTLE', state: guardianState });
        setTimeout(() => {
          setAnimationState('idle');
          dispatch({ type: 'UPDATE_BATTLE', state: BattleEngine.checkCompletion(guardianState) });
        }, 500);
      }, 800);
    }
  };

  const startVoiceRecognition = async () => {
    if (isListening) return;
    
    const currentQuestion = mappedGameState.currentQuestion;
    if (!currentQuestion) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const timeout = activePet?.buffType === 'timeout_extension' ? state.progression.settings.voiceTimeout + 2000 : state.progression.settings.voiceTimeout;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: { 
          responseModalities: [Modality.AUDIO], 
          inputAudioTranscription: {}, 
          systemInstruction: `Validate child speech for digraph "${currentQuestion.correctDigraph}".` 
        },
        callbacks: {
          onopen: () => { console.log("Voice channel opened."); },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.inputTranscription?.text.toLowerCase().includes(currentQuestion.correctDigraph)) {
               handleSelect(currentQuestion.correctDigraph);
               stopListening();
            }
          },
          onerror: (e) => {
            showToast("The mic echo was lost. Try again.", 'error');
            setIsListening(false);
          },
          onclose: () => setIsListening(false)
        }
      });
      liveSessionRef.current = { sessionPromise, inputCtx, stream };
      setTimeout(stopListening, timeout);
    } catch (e) { 
      showToast("Access to the mic was denied. Enable it in settings.", 'error');
      setIsListening(false); 
    }
  };

  const stopListening = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.stream.getTracks().forEach((t: any) => t.stop());
      liveSessionRef.current.inputCtx.close();
      liveSessionRef.current = null;
    }
    setIsListening(false);
  };

  return (
    <div 
      className="relative mx-auto max-w-[430px] h-screen max-h-[932px] overflow-hidden flex flex-col shadow-2xl bg-background-dark"
      onClick={() => resumeAudioContext()}
    >
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {!isStarted ? (
        <div className="absolute inset-0 z-[200] bg-background-dark flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
            <div className="w-32 h-32 mb-8 bg-primary/20 rounded-full flex items-center justify-center border border-primary/40 animate-pulse">
               <span className="material-symbols-outlined text-primary text-6xl">auto_awesome</span>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2 uppercase drop-shadow-[0_0_15px_#0ddff2]">Phonics Quest</h1>
            <p className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] mb-12">Crystal Chronicles</p>
            <button 
              onClick={startGame} 
              className="px-12 py-5 bg-primary text-background-dark rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(13,223,242,0.4)] active:scale-95 transition-all"
            >
              Awaken the Kingdom
            </button>
        </div>
      ) : (
        <>
          {!state.progression.hasSeenTutorial && <TutorialOverlay onComplete={() => dispatch({ type: 'SET_TUTORIAL_SEEN' })} />}
          <AudioEngine view={state.view} battlePhase={state.battle.phase} isMuted={isMuted} currentChapterId={state.currentChapterId} chapters={state.chapters} />
          
          <HUD 
            gameState={mappedGameState} 
            battleState={state.battle} 
            progression={state.progression}
            onReset={() => dispatch({ type: 'SET_VIEW', view: 'world-map' })} 
            isMuted={isMuted} 
            onToggleMute={() => dispatch({ type: 'UPDATE_SETTINGS', updates: { isMuted: !isMuted } })} 
            onOpenSettings={() => dispatch({ type: 'SET_VIEW', view: 'settings' })} 
          />
          
          <div className="flex-1 relative overflow-hidden">
            {state.view === 'world-map' && (
              <div className="absolute inset-0 z-40 bg-background-dark p-6 overflow-y-auto custom-scrollbar animate-fadeIn">
                <header className="mb-6">
                   <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Kingdom Map</h1>
                </header>
                {state.chapters.map(ch => (
                  <div 
                    key={ch.id} 
                    tabIndex={ch.isUnlocked ? 0 : -1}
                    onKeyDown={(e) => e.key === 'Enter' && ch.isUnlocked && startChapter(ch)}
                    onClick={() => ch.isUnlocked && startChapter(ch)} 
                    className={`relative overflow-hidden rounded-2xl border mb-4 transition-all focus:ring-2 focus:ring-primary focus:outline-none ${ch.isUnlocked ? 'border-primary/20 hover:border-primary cursor-pointer' : 'opacity-50 grayscale border-white/5'}`}
                  >
                    <img src={ch.background} className="w-full h-32 object-cover opacity-30" alt="" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-center">
                      <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">{ch.name}</h3>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{ch.guardian.island}</p>
                    </div>
                    {!ch.isUnlocked && <span className="absolute top-4 right-4 material-symbols-outlined text-white/20">lock</span>}
                  </div>
                ))}
              </div>
            )}
            {state.view === 'battle' && (
              <>
                <Arena gameState={mappedGameState} animationState={animationState} activePet={activePet} />
                {state.battle.phase === 'victory' && <VictoryScreen chapterName={currentChapter.name} guardianName={currentChapter.guardian.name} rewards={calculateBattleRewards(state.battle, state.progression.unlockedNPCs)} progression={state.progression} onComplete={(artifact) => handleBattleEnd(true, null, artifact)} />}
                {state.battle.phase === 'defeat' && <DefeatScreen guardianName={currentChapter.guardian.name} tasksCompleted={state.battle.currentTaskIndex} totalTasks={state.battle.tasks.length} comboStreak={state.battle.maxComboStreak} onRetry={() => startChapter(currentChapter)} onReturnToMap={() => dispatch({ type: 'SET_VIEW', view: 'world-map' })} />}
                {state.battle.phase !== 'victory' && state.battle.phase !== 'defeat' && <Overlay gameState={mappedGameState} rootState={state} onSelect={handleSelect} onPronounce={() => speak(mappedGameState.currentQuestion?.word || "")} onVoiceStart={startVoiceRecognition} isListening={isListening} onDebugVictory={() => dispatch({ type: 'INSTANT_VICTORY' })} />}
              </>
            )}
            {state.view === 'sanctuary' && <Sanctuary progression={state.progression} onClaimReward={() => dispatch({ type: 'CLAIM_RESTORATION_REWARD' })} onViewLedger={() => dispatch({ type: 'SET_VIEW', view: 'ledger' })} onOpenParentDashboard={() => dispatch({ type: 'SET_VIEW', view: 'parent-dashboard' })} onSpin={(type, r, a) => dispatch({ type: 'DAILY_SPIN', rewardType: type, rarity: r, amount: a })} onHatch={(id, pet) => dispatch({ type: 'HATCH_EGG', eggId: id, pet })} />}
            {state.view === 'hero-room' && <HeroRoom progression={state.progression} onEquipDecoration={(slot, id) => dispatch({ type: 'EQUIP_DECORATION', slot, decorationId: id })} onSetActivePet={(id) => dispatch({ type: 'SET_ACTIVE_PET', petId: id })} />}
            {state.view === 'settings' && <SettingsPanel settings={state.progression.settings} onUpdate={(u) => dispatch({ type: 'UPDATE_SETTINGS', updates: u })} onClose={() => dispatch({ type: 'SET_VIEW', view: 'world-map' })} />}
            {state.view === 'character-sheet' && <CharacterSheet progression={state.progression} onUpgrade={(attr, cost) => dispatch({ type: 'UPGRADE_ATTRIBUTE', attribute: attr, cost })} onResetProgress={() => dispatch({ type: 'RESET_GAME' })} />}
            {state.view === 'quest-log' && <QuestLog quests={state.quests} onClaimQuestReward={(id) => dispatch({ type: 'CLAIM_QUEST_REWARD', questId: id })} />}
            {state.view === 'parent-dashboard' && <ParentDashboard progression={state.progression} onClose={() => dispatch({ type: 'SET_VIEW', view: 'sanctuary' })} />}
            {state.view === 'ledger' && <KingdomLedger progression={state.progression} onClose={() => dispatch({ type: 'SET_VIEW', view: 'sanctuary' })} />}
          </div>

          <nav className="relative z-50 h-16 bg-background-dark/95 border-t border-white/5 flex items-center justify-around px-4">
            {[
              { id: 'world-map', icon: 'map' },
              { id: 'sanctuary', icon: 'castle' },
              { id: 'hero-room', icon: 'home' },
              { id: 'quest-log', icon: 'assignment' },
              { id: 'character-sheet', icon: 'person' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => { resumeAudioContext(); dispatch({ type: 'SET_VIEW', view: tab.id as any }); }} 
                className={`material-symbols-outlined transition-colors p-2 rounded-lg focus:ring-1 focus:ring-primary ${state.view === tab.id ? 'text-primary' : 'text-white/40 hover:text-white/60'}`}
              >
                {tab.icon}
              </button>
            ))}
          </nav>
        </>
      )}

      {loading && (
        <div className="absolute inset-0 z-[100] bg-background-dark/90 backdrop-blur-md flex flex-col items-center justify-center gap-4 animate-fadeIn">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-black animate-pulse uppercase tracking-[0.3em] text-[10px]">Harmonizing Echoes...</p>
        </div>
      )}
    </div>
  );
};

export default App;
