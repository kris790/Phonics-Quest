
import React from 'react';
import { GameState } from '../types';

interface OverlayProps {
  gameState: GameState;
  onSelect: (option: string) => void;
}

const Overlay: React.FC<OverlayProps> = ({ gameState, onSelect }) => {
  if (gameState.status === 'victory') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-8">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-bold text-primary animate-pulse">VICTORY!</h2>
          <p className="text-white/80">The shadow has been purged! You are a Digraph Master.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-primary text-background-dark font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(13,223,242,0.5)] active:scale-95 transition-transform"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  if (gameState.status === 'defeat') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-8">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-bold text-damage-red">DEFEATED</h2>
          <p className="text-white/80">The darkness was too strong. Keep practicing!</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-damage-red text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(250,92,56,0.5)] active:scale-95 transition-transform"
          >
            RETRY JOURNEY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-30 mt-auto px-6 pb-12 flex flex-col gap-6">
      {/* Current Question */}
      {gameState.currentQuestion && (
        <div className="bg-background-dark/80 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4">
          <div className="text-center">
            <h3 className="text-sm font-bold text-primary/60 uppercase tracking-widest mb-1">Identify the Digraph</h3>
            <p className="text-4xl font-bold tracking-widest text-white mb-2">
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
                className="bg-white/5 border border-white/10 py-4 rounded-xl font-bold text-xl hover:bg-primary/20 hover:border-primary/50 transition-all active:scale-95 disabled:opacity-50"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Narrative Box */}
      <div className="bg-background-dark/60 backdrop-blur-md rounded-2xl p-4 border border-white/5">
        <p className="text-white/80 text-center text-sm font-medium leading-relaxed italic">
            {gameState.feedback}
        </p>
      </div>
    </div>
  );
};

export default Overlay;
