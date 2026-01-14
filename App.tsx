
import React, { useState, useEffect, useReducer, useRef, useMemo } from 'react';
import HUD from './components/HUD';
import Arena from './components/Arena';
import Overlay from './components/Overlay';
import CharacterSheet from './components/CharacterSheet';
import VictoryScreen from './components/battle/VictoryScreen';
import DefeatScreen from './components/battle/DefeatScreen';
import { RootState, BattleState, AnimationState, PhonicsTask, AppState, Chapter } from './types';
import { BattleEngine } from './battleEngine';
import { fetchQuestions, getNarrativeFeedback, generateSpeech } from './services/geminiService';
import { playTTS } from './utils/audioUtils';
import { CHAPTERS } from './constants';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { calculateBattleRewards } from './utils/rewardsCalculator';

type Action = 
  | { type: 'INIT_BATTLE'; tasks: PhonicsTask[]; chapter: Chapter }
  | { type: 'UPDATE_BATTLE'; state: Partial<BattleState> }
  | { type: 'SET_PHASE'; phase: BattleState['phase'] }
  | { type: 'SET_FEEDBACK'; text: string }
  | { type: 'SET_VIEW'; view: AppState }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'ADD_CRYSTALS'; amount: number }
  | { type: 'COMPLETE_CHAPTER'; chapterId: string };

const initialState: RootState = {
  view: 'world-map',
  battle: BattleEngine.startBattle([], CHAPTERS[0].guardian),
  progression: { 
    level: 1, 
    xp: 0, 
    maxXp: 100, 
    crystalsFound: 0,
    unlockedChapters: ['ch1'],
    attributes: {
      readingPower: 5,
      focus: 5,
      speed: 5,
      resilience: 5
    }
  },
  quests: { 
    activeQuests: [
      { id: 'q1', title: 'The First Awakening', description: 'Defeat the Mumbler', progress: 0, target: 1, isComplete: false, rewardXp: 50 },
      { id: 'q2', title: 'Streak Seeker', description: 'Get a 3x streak', progress: 0, target: 1, isComplete: false, rewardXp: 25 }
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
        battle: BattleEngine.startBattle(action.tasks, action.chapter.guardian) 
      };
    case 'UPDATE_BATTLE':
      return { ...state, battle: { ...state.battle, ...action.state } };
    case 'SET_PHASE':
      return { ...state, battle: { ...state.battle, phase: action.phase } };
    case 'SET_FEEDBACK':
      return { ...state, battle: { ...state.battle, feedback: action.text } };
    case 'SET_VIEW':
      return { ...state, view: action.view };
    case 'ADD_XP': {
      let newXp = state.progression.xp + action.amount;
      let newLevel = state.progression.level;
      let newMaxXp = state.progression.maxXp;
      while (newXp >= newMaxXp) {
        newLevel++;
        newXp -= newMaxXp;
        newMaxXp = Math.floor(newMaxXp * 1.5);
      }
      return {
        ...state,
        progression: { ...state.progression, xp: newXp, level: newLevel, maxXp: newMaxXp }
      };
    }
    case 'ADD_CRYSTALS':
      return {
        ...state,
        progression: { ...state.progression, crystalsFound: state.progression.crystalsFound + action.amount }
      };
    case 'COMPLETE_CHAPTER': {
      const chapterIdx = state.chapters.findIndex(c => c.id === action.chapterId);
      const nextChapterIdx = chapterIdx + 1;
      const newChapters = [...state.chapters];
      newChapters[chapterIdx] = { ...newChapters[chapterIdx], isCompleted: true };
      if (nextChapterIdx < newChapters.length) {
        newChapters[nextChapterIdx] = { ...newChapters[nextChapterIdx], isUnlocked: true };
      }
      return { ...state, chapters: newChapters };
    }
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const liveSessionRef = useRef<any>(null);

  const mappedGameState = useMemo(() => ({
    playerHP: state.battle.playerHealth,
    enemyHP: state.battle.guardianHealth,
    maxHP: state.battle.playerMaxHealth,
    streak: state.battle.comboStreak,
    level: state.progression.level,
    status: (state.battle.phase === 'victory' || state.battle.phase === 'defeat') 
      ? state.battle.phase 
      : (state.battle.phase === 'player-turn' ? 'playing' : 'animating') as any,
    currentQuestion: state.battle.tasks[state.battle.currentTaskIndex] || null,
    feedback: state.battle.feedback,
    lastDamage: state.battle.taskResults[state.battle.taskResults.length - 1]?.damageDealt || null,
    isCritical: state.battle.taskResults[state.battle.taskResults.length - 1]?.criticalHit || false,
  }), [state.battle, state.progression.level]);

  const speak = async (text: string) => {
    const audioData = await generateSpeech(text);
    if (audioData) {
      playTTS(audioData);
    }
  };

  useEffect(() => {
    if (state.battle.phase === 'player-turn' && mappedGameState.currentQuestion) {
      speak(`The word is ${mappedGameState.currentQuestion.word}. ${mappedGameState.currentQuestion.meaning}`);
    }
  }, [state.battle.currentTaskIndex, state.battle.phase === 'player-turn']);

  const handleBattleEnd = (victory: boolean, rewards?: any) => {
    if (victory && rewards) {
      dispatch({ type: 'ADD_XP', amount: rewards.xp });
      dispatch({ type: 'ADD_CRYSTALS', amount: rewards.crystals });
      dispatch({ type: 'COMPLETE_CHAPTER', chapterId: state.currentChapterId });
    }
    dispatch({ type: 'SET_VIEW', view: 'world-map' });
  };

  const handleSelect = async (selected: string) => {
    if (state.battle.phase !== 'player-turn') return;

    const currentTask = state.battle.tasks[state.battle.currentTaskIndex];
    const isCorrect = selected.toLowerCase() === currentTask.correctDigraph.toLowerCase();
    
    const { nextState } = BattleEngine.processTurn(
      state.battle, 
      isCorrect, 
      state.progression.attributes.readingPower
    );
    
    if (isCorrect) {
      setAnimationState('attacking');
      dispatch({ type: 'UPDATE_BATTLE', state: nextState });
      
      const narrative = await getNarrativeFeedback(true, currentTask.word, nextState.comboStreak);
      dispatch({ type: 'SET_FEEDBACK', text: narrative });
      speak(narrative);

      setTimeout(() => {
        setAnimationState('taking-damage');
        setTimeout(() => {
          setAnimationState('idle');
          const finalState = BattleEngine.checkCompletion(nextState);
          dispatch({ type: 'UPDATE_BATTLE', state: finalState });
        }, 1000);
      }, 800);
    } else {
      setAnimationState('hit-shake');
      dispatch({ type: 'SET_PHASE', phase: 'guardian-turn' });
      
      const narrative = await getNarrativeFeedback(false, currentTask.word, 0);
      dispatch({ type: 'SET_FEEDBACK', text: narrative });
      speak(narrative);

      setTimeout(() => {
        const afterGuardian = BattleEngine.processGuardianTurn(
          nextState, 
          state.progression.attributes.resilience
        );
        dispatch({ type: 'UPDATE_BATTLE', state: afterGuardian });
        
        setTimeout(() => {
          setAnimationState('idle');
          const finalState = BattleEngine.checkCompletion(afterGuardian);
          dispatch({ type: 'UPDATE_BATTLE', state: finalState });
        }, 500);
      }, 800);
    }
  };

  const startVoiceRecognition = async () => {
    if (isListening) return;
    setIsListening(true);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const currentQuestion = mappedGameState.currentQuestion;
    if (!currentQuestion) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: `You are a speech-to-phonics validator. The child is trying to say the digraph "${currentQuestion.correctDigraph}". Listen to them. If they say the sound correctly or say the letters "${currentQuestion.correctDigraph}", respond with only the word "CORRECT". If they are wrong, say "INCORRECT". Do not say anything else.`
        },
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const input = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(input.length);
              for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.inputTranscription) {
              const text = msg.serverContent.inputTranscription.text.toLowerCase();
              if (text.includes(currentQuestion.correctDigraph.toLowerCase()) || text.includes('correct')) {
                handleSelect(currentQuestion.correctDigraph);
                stopListening();
              }
            }
          },
          onerror: () => setIsListening(false),
          onclose: () => setIsListening(false)
        }
      });
      liveSessionRef.current = { sessionPromise, inputCtx, stream };
      
      setTimeout(stopListening, 5000);
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (liveSessionRef.current) {
      const { stream, inputCtx } = liveSessionRef.current;
      stream.getTracks().forEach((t: any) => t.stop());
      inputCtx.close();
      liveSessionRef.current = null;
    }
    setIsListening(false);
  };

  const startChapter = async (chapter: Chapter) => {
    setLoading(true);
    try {
      const questions = await fetchQuestions(state.progression.level);
      const formattedTasks: PhonicsTask[] = questions.map((q, i) => ({
        taskId: `task-${i}`,
        ...q
      }));
      dispatch({ type: 'INIT_BATTLE', tasks: formattedTasks, chapter });
      dispatch({ type: 'SET_PHASE', phase: 'player-turn' });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentChapter = CHAPTERS.find(c => c.id === state.currentChapterId) || CHAPTERS[0];

  return (
    <div className="relative mx-auto max-w-[430px] h-screen max-h-[932px] overflow-hidden flex flex-col shadow-2xl border-x border-white/5 bg-background-dark">
      <HUD gameState={mappedGameState} onReset={() => dispatch({ type: 'SET_VIEW', view: 'world-map' })} />
      
      <div className="flex-1 relative overflow-hidden">
        {state.view === 'world-map' && (
          <div className="absolute inset-0 z-40 bg-background-dark p-6 overflow-y-auto pb-24">
            <header className="mb-6">
              <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">Kingdom Map</h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Select an island to reclaim</p>
            </header>
            <div className="space-y-4">
              {state.chapters.map((ch) => (
                <div key={ch.id} onClick={() => ch.isUnlocked && startChapter(ch)} className={`relative overflow-hidden rounded-2xl border transition-all ${ch.isUnlocked ? 'border-white/10 hover:border-primary cursor-pointer' : 'border-white/5 opacity-50 grayscale'}`}>
                  <div className="absolute inset-0 z-0">
                    <img src={ch.background} className="w-full h-full object-cover opacity-30" alt={ch.name} />
                    <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent"></div>
                  </div>
                  <div className="relative z-10 p-6 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">{ch.guardian.island}</span>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">{ch.name}</h3>
                      <p className="text-[10px] text-white/50 font-bold">{ch.guardian.name} • {ch.guardian.title}</p>
                    </div>
                    <span className="material-symbols-outlined text-white/40">{ch.isUnlocked ? 'arrow_forward_ios' : 'lock'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.view === 'battle' && (
          <>
            <Arena gameState={mappedGameState} animationState={animationState} />
            
            {state.battle.phase === 'victory' && (
              <VictoryScreen 
                guardianName={currentChapter.guardian.name} 
                rewards={calculateBattleRewards(state.battle)}
                progression={state.progression}
                onComplete={() => handleBattleEnd(true, calculateBattleRewards(state.battle))}
              />
            )}

            {state.battle.phase === 'defeat' && (
              <DefeatScreen 
                guardianName={currentChapter.guardian.name}
                tasksCompleted={state.battle.currentTaskIndex}
                totalTasks={state.battle.tasks.length}
                comboStreak={state.battle.maxComboStreak}
                onRetry={() => startChapter(currentChapter)}
                onReturnToMap={() => dispatch({ type: 'SET_VIEW', view: 'world-map' })}
              />
            )}

            {state.battle.phase !== 'victory' && state.battle.phase !== 'defeat' && (
              <>
                <div className="absolute top-48 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-40">
                   <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase bg-black/40 px-3 py-1 rounded-full border border-primary/20 italic">
                      {state.battle.phase.replace('-', ' ')}
                   </span>
                </div>
                <Overlay 
                  gameState={mappedGameState} 
                  rootState={state}
                  onSelect={handleSelect} 
                  onBattleEnd={handleBattleEnd}
                  onPronounce={() => speak(mappedGameState.currentQuestion?.word || "")}
                  onVoiceStart={startVoiceRecognition}
                  isListening={isListening}
                />
              </>
            )}
          </>
        )}

        {state.view === 'character-sheet' && <CharacterSheet progression={state.progression} />}
      </div>

      <div className="relative z-50 h-16 bg-background-dark/95 border-t border-white/5 flex items-center justify-around px-8">
        <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'world-map' })} className={`material-symbols-outlined ${state.view === 'world-map' ? 'text-primary' : 'text-white/40'}`}>map</button>
        <div onClick={() => state.view !== 'battle' && startChapter(currentChapter)} className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center -translate-y-4 border border-primary/40 shadow-[0_0_15px_rgba(13,223,242,0.3)] cursor-pointer">
          <span className="material-symbols-outlined text-primary">swords</span>
        </div>
        <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'character-sheet' })} className={`material-symbols-outlined ${state.view === 'character-sheet' ? 'text-primary' : 'text-white/40'}`}>person</button>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[100] bg-background-dark/90 backdrop-blur-md flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-black animate-pulse uppercase tracking-[0.3em] text-[10px]">Tuning Echoes...</p>
        </div>
      )}
    </div>
  );
};

export default App;
