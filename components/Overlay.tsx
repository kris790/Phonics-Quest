
import React from 'react';
import { GameState, RootState } from '../types';

interface OverlayProps {
  gameState: GameState;
  rootState: RootState;
  onSelect: (option: string) => void;
  onBattleEnd: (victory: boolean, rewards?: any) => void;
  onPronounce: () => void;
  onVoiceStart?: () => void;
  isListening?: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ 
  gameState, 
  onSelect, 
  onPronounce,
  onVoiceStart,
  isListening 
}) => {
  if (gameState.status === 'victory' || gameState.status === 'defeat') {
    return null;
  }

  return (
    <div className="relative z-30 mt-auto px-6 pb-12 flex flex-col gap-6">
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
            {gameState.currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                disabled={gameState.status !== 'playing'}
                onClick={() => onSelect(opt)}
                className="bg-white/5 border border-white/10 py-4 rounded-xl font-black text-xl hover:bg-primary/20 hover:border-primary/50 transition-all active:scale-95 disabled:opacity-50 text-white italic tracking-widest"
              >
                {opt}
              </button>
            ))}
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
