
import React from 'react';
import { GameState, RootState, BattleState } from '../types';

interface OverlayProps {
  gameState: GameState;
  rootState: RootState;
  onSelect: (option: string) => void;
  onBattleEnd: (victory: boolean, rewards?: any) => void;
  onPronounce: () => void;
  onVoiceStart?: () => void;
  onUsePowerup?: (type: keyof BattleState['availablePowerups']) => void;
  isListening?: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ 
  gameState, 
  rootState,
  onSelect, 
  onPronounce,
  onVoiceStart,
  onUsePowerup,
  isListening 
}) => {
  if (gameState.status === 'victory' || gameState.status === 'defeat') {
    return null;
  }

  const powerups: Array<{ id: keyof BattleState['availablePowerups'], icon: string, label: string }> = [
    { id: 'heal', icon: 'medication', label: 'Heal' },
    { id: 'shield', icon: 'shield', label: 'Shield' },
    { id: 'hint', icon: 'lightbulb', label: 'Hint' },
    { id: 'timeFreeze', icon: 'ac_unit', label: 'Stasis' },
  ];

  const activeHint = rootState.battle.activeHint;
  const correctOption = gameState.currentQuestion?.correctDigraph;

  return (
    <div className="relative z-30 mt-auto px-6 pb-12 flex flex-col gap-4">
      {/* Powerups Bar */}
      <div className="flex justify-between gap-2 px-2">
        {powerups.map((p) => (
          <button
            key={p.id}
            disabled={rootState.battle.availablePowerups[p.id] <= 0 || gameState.status !== 'playing'}
            onClick={() => onUsePowerup?.(p.id)}
            className="flex-1 flex flex-col items-center gap-1 bg-background-dark/60 backdrop-blur-md border border-white/10 rounded-xl py-2 transition-all hover:bg-white/10 disabled:opacity-30 disabled:grayscale relative group"
          >
            <span className="material-symbols-outlined text-primary text-xl">{p.icon}</span>
            <span className="text-[8px] font-black uppercase text-white/60 tracking-widest">{p.label}</span>
            <div className="absolute -top-2 -right-1 bg-primary text-background-dark text-[9px] font-black px-1.5 rounded-full border border-background-dark">
              {rootState.battle.availablePowerups[p.id]}
            </div>
          </button>
        ))}
      </div>

      {/* Current Question */}
      {gameState.currentQuestion && (
        <div className="bg-background-dark/80 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4">
          <div className="text-center relative">
            <div className="absolute right-0 top-0 flex gap-3">
              <button 
                onClick={onPronounce}
                className="text-primary/60 hover:text-primary transition-colors"
                title="Hear Word"
              >
                <span className="material-symbols-outlined">volume_up</span>
              </button>
              {onVoiceStart && (
                <button 
                  onClick={onVoiceStart}
                  className={`transition-colors ${isListening ? 'text-damage-red animate-pulse' : 'text-primary/60 hover:text-primary'}`}
                  title="Speak Answer"
                >
                  <span className="material-symbols-outlined">{isListening ? 'mic' : 'mic_none'}</span>
                </button>
              )}
            </div>
            <h3 className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] mb-1">Spell Configuration</h3>
            <p className="text-4xl font-black tracking-[0.2em] text-white mb-2 italic">
              {gameState.currentQuestion.displayWord.toUpperCase()}
            </p>
            <p className="text-white/50 text-xs italic">"{gameState.currentQuestion.meaning}"</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {gameState.currentQuestion.options.map((opt, i) => {
              const isHinted = activeHint && opt === correctOption;
              return (
                <button
                  key={i}
                  disabled={gameState.status !== 'playing'}
                  onClick={() => onSelect(opt)}
                  className={`py-4 rounded-xl font-black text-xl transition-all active:scale-95 disabled:opacity-50 italic tracking-widest border-2 ${
                    isHinted 
                      ? 'bg-primary/40 border-primary text-white animate-pulse shadow-[0_0_15px_#0ddff2]' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-primary/20 hover:border-primary/50'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Narrative Box */}
      <div className="bg-background-dark/60 backdrop-blur-md rounded-2xl p-4 border border-white/5 min-h-[64px] flex items-center justify-center">
        {isListening ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-primary animate-[bounce_0.5s_infinite_0s]"></div>
              <div className="w-1 h-6 bg-primary animate-[bounce_0.5s_infinite_0.1s]"></div>
              <div className="w-1 h-4 bg-primary animate-[bounce_0.5s_infinite_0.2s]"></div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Listening for the echo...</p>
          </div>
        ) : (
          <p className="text-white/80 text-center text-sm font-medium leading-relaxed italic min-h-[40px] flex items-center justify-center">
              {gameState.feedback}
          </p>
        )}
      </div>
    </div>
  );
};

export default Overlay;
