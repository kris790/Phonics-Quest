
import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import HUD from './components/HUD';
import Arena from './components/Arena';
import Overlay from './components/Overlay';
import CharacterSheet from './components/CharacterSheet';
import { RootState, BattleState, AnimationState, PhonicsTask, AppState, Chapter } from './types';
import { BattleEngine } from './battleEngine';
import { fetchQuestions, getNarrativeFeedback } from './services/geminiService';
import { INITIAL_HP, CHAPTERS } from './constants';

type Action = 
  | { type: 'INIT_BATTLE'; tasks: PhonicsTask[]; chapter: Chapter }
  | { type: 'UPDATE_BATTLE'; state: Partial<BattleState> }
  | { type: 'SET_PHASE'; phase: BattleState['phase'] }
  | { type: 'SET_FEEDBACK'; text: string }
  | { type: 'SET_VIEW'; view: AppState }
  | { type: 'ADD_XP'; amount: number }
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
      if (newXp >= newMaxXp) {
        newLevel++;
        newXp -= newMaxXp;
        newMaxXp = Math.floor(newMaxXp * 1.5);
      }
      return {
        ...state,
        progression: { ...state.progression, xp: newXp, level: newLevel, maxXp: newMaxXp }
      };
    }
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

  // Mapped state for compatibility with existing components
  const mappedGameState = {
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

  const handleSelect = async (selected: string) => {
    if (state.battle.phase !== 'player-turn') return;

    const currentTask = state.battle.tasks[state.battle.currentTaskIndex];
    const isCorrect = selected === currentTask.correctDigraph;
    
    // Process Turn logic with RPG scaling
    const { nextState, result } = BattleEngine.processTurn(
      state.battle, 
      isCorrect, 
      state.progression.attributes.readingPower
    );
    
    if (isCorrect) {
      setAnimationState('attacking');
      dispatch({ type: 'UPDATE_BATTLE', state: nextState });
      
      const narrative = await getNarrativeFeedback(true, currentTask.word, nextState.comboStreak);
      dispatch({ type: 'SET_FEEDBACK', text: narrative });

      setTimeout(() => {
        setAnimationState('taking-damage');
        setTimeout(() => {
          setAnimationState('idle');
          const finalState = BattleEngine.checkCompletion(nextState);
          dispatch({ type: 'UPDATE_BATTLE', state: finalState });

          if (finalState.phase === 'victory') {
            dispatch({ type: 'ADD_XP', amount: 100 });
            dispatch({ type: 'COMPLETE_CHAPTER', chapterId: state.currentChapterId });
          }
        }, 1000);
      }, 800);
    } else {
      setAnimationState('hit-shake');
      dispatch({ type: 'SET_PHASE', phase: 'guardian-turn' });
      
      const narrative = await getNarrativeFeedback(false, currentTask.word, 0);
      dispatch({ type: 'SET_FEEDBACK', text: narrative });

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

  return (
    <div className="relative mx-auto max-w-[430px] h-screen max-h-[932px] overflow-hidden flex flex-col shadow-2xl border-x border-white/5 bg-background-dark">
      {/* HUD Always Present */}
      <HUD gameState={mappedGameState} onReset={() => dispatch({ type: 'SET_VIEW', view: 'world-map' })} />
      
      <div className="flex-1 relative overflow-hidden">
        {state.view === 'world-map' && (
          <div className="absolute inset-0 z-40 bg-background-dark p-6 overflow-y-auto pb-24">
            <div className="flex flex-col gap-6">
              <header className="mb-4">
                <h1 className="text-3xl font-bold text-white tracking-tight">World Map</h1>
                <p className="text-white/40 text-sm">Select an island to begin your quest.</p>
              </header>

              <div className="space-y-4">
                {state.chapters.map((ch) => (
                  <div 
                    key={ch.id}
                    onClick={() => ch.isUnlocked && startChapter(ch)}
                    className={`relative overflow-hidden rounded-2xl border transition-all ${ch.isUnlocked ? 'border-white/10 hover:border-primary cursor-pointer' : 'border-white/5 opacity-50 grayscale'}`}
                  >
                    <div className="absolute inset-0 z-0">
                      <img src={ch.background} className="w-full h-full object-cover opacity-30" alt={ch.name} />
                      <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent"></div>
                    </div>
                    <div className="relative z-10 p-6 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">{ch.guardian.island}</span>
                        <h3 className="text-xl font-bold">{ch.name}</h3>
                        <p className="text-xs text-white/60">{ch.guardian.name} • {ch.guardian.title}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {ch.isCompleted && <span className="material-symbols-outlined text-emerald-400">check_circle</span>}
                        <span className="material-symbols-outlined text-white/40">
                          {ch.isUnlocked ? 'arrow_forward_ios' : 'lock'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {state.view === 'battle' && (
          <>
            <Arena gameState={mappedGameState} animationState={animationState} />
            <div className="absolute top-48 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-40">
               <span className="text-[10px] font-bold tracking-[0.5em] text-primary uppercase bg-black/40 px-3 py-1 rounded-full border border-primary/20">
                  {state.battle.phase.replace('-', ' ')}
               </span>
            </div>
            <Overlay gameState={mappedGameState} onSelect={handleSelect} />
          </>
        )}

        {state.view === 'quest-log' && (
           <div className="absolute inset-0 z-40 bg-background-dark p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Active Quests</h2>
              <div className="space-y-4">
                {state.quests.activeQuests.map(q => (
                  <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{q.title}</h3>
                      <span className="text-primary text-xs font-bold">{q.rewardXp} XP</span>
                    </div>
                    <p className="text-sm text-white/60 mb-3">{q.description}</p>
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(q.progress / q.target) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {state.view === 'character-sheet' && (
           <CharacterSheet progression={state.progression} />
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 z-[100] bg-background-dark/90 backdrop-blur-md flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-bold animate-pulse uppercase tracking-[0.3em] text-xs">Summoning Spell...</p>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="relative z-50 h-16 bg-background-dark/95 border-t border-white/5 flex items-center justify-around px-8">
        <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'world-map' })} className={`material-symbols-outlined ${state.view === 'world-map' ? 'text-primary' : 'text-white/40'}`}>map</button>
        <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'quest-log' })} className={`material-symbols-outlined ${state.view === 'quest-log' ? 'text-primary' : 'text-white/40'}`}>auto_stories</button>
        <div 
          onClick={() => state.view !== 'battle' && state.chapters.find(c => c.isUnlocked) && startChapter(state.chapters.find(c => c.isUnlocked)!)}
          className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center -translate-y-4 border border-primary/40 shadow-[0_0_15px_rgba(13,223,242,0.3)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-primary">swords</span>
        </div>
        <button className="material-symbols-outlined text-white/40">inventory_2</button>
        <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'character-sheet' })} className={`material-symbols-outlined ${state.view === 'character-sheet' ? 'text-primary' : 'text-white/40'}`}>person</button>
      </div>
    </div>
  );
};

export default App;
