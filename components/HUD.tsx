
import React from 'react';
import { GameState, BattleState } from '../types';

interface HUDProps {
  gameState: GameState;
  battleState: BattleState;
  onReset: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
}

const HUD: React.FC<HUDProps> = ({ gameState, battleState, onReset, isMuted, onToggleMute, onOpenSettings }) => {
  const getEffectIcon = (type: string) => {
    switch (type) {
      case 'confusion': return 'question_mark';
      case 'slow': return 'schedule';
      case 'weakness': return 'heart_broken';
      case 'focused': return 'center_focus_strong';
      case 'shielded': return 'shield';
      default: return 'bolt';
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between p-4 pt-12">
        <div className="flex items-center gap-3">
          <div className="bg-background-dark/60 backdrop-blur-md p-2 rounded-lg border border-white/10 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">auto_stories</span>
            <span className="font-bold text-sm tracking-widest text-white uppercase italic">Echoes of Clarity</span>
          </div>
          {/* Guardian Effects */}
          <div className="flex gap-1">
            {battleState.guardianStatusEffects.map((eff, i) => (
              <div key={i} className="bg-damage-red/20 border border-damage-red/40 rounded px-1 flex items-center gap-0.5 animate-pulse">
                <span className="material-symbols-outlined text-[10px] text-damage-red">{getEffectIcon(eff.type)}</span>
                <span className="text-[8px] font-black text-damage-red uppercase">{eff.duration}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onOpenSettings}
            className="bg-background-dark/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button 
            onClick={onReset}
            className="bg-background-dark/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="relative z-20 px-4 flex justify-between items-start gap-4">
        {/* Combo Counter */}
        <div className="flex flex-col gap-1 bg-background-dark/40 backdrop-blur-md p-3 rounded-xl holographic-glow min-w-[100px]">
          <p className="text-[10px] font-bold text-primary/80 uppercase tracking-tighter leading-none">Streak</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold leading-none">{gameState.streak}x</p>
            {gameState.streak > 0 && (
              <p className="text-xs font-medium text-emerald-400 leading-none animate-bounce">+1</p>
            )}
          </div>
        </div>

        {/* Player HP & Effects */}
        <div className="flex-1 flex flex-col gap-2 bg-background-dark/40 backdrop-blur-md p-3 rounded-xl holographic-glow">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold text-primary/80 uppercase tracking-tighter">Hero HP</p>
              <div className="flex gap-1">
                {battleState.playerStatusEffects.map((eff, i) => (
                  <div key={i} className="bg-primary/20 border border-primary/40 rounded px-1 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[10px] text-primary">{getEffectIcon(eff.type)}</span>
                    <span className="text-[8px] font-black text-primary uppercase">{eff.duration}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs font-bold">{gameState.playerHP}/{gameState.maxHP}</p>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full shadow-[0_0_8px_#0ddff2] transition-all duration-500" 
              style={{ width: `${(gameState.playerHP / gameState.maxHP) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HUD;
