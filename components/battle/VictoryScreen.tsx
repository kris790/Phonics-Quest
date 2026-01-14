import React, { useState, useEffect } from 'react';
import RewardsDisplay from './RewardsDisplay';
import { BattleRewards, ProgressionState } from '../../types';

interface VictoryScreenProps {
  guardianName: string;
  rewards: BattleRewards;
  progression: ProgressionState;
  onComplete: () => void;
  onReplay: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ 
  guardianName, 
  rewards, 
  progression,
  onComplete,
  onReplay
}) => {
  const [showRewards, setShowRewards] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    setConfetti(true);
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-8 overflow-hidden">
      {/* Background Radiance */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] animate-pulse ${rewards.perfectBonus ? 'bg-yellow-500/15' : 'bg-primary/10'}`}></div>
      
      {/* Confetti Effect */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(rewards.perfectBonus ? 80 : 40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-[fall_3s_linear_infinite]"
              style={{
                width: rewards.perfectBonus ? '4px' : '1.5px',
                height: rewards.perfectBonus ? '4px' : '1.5px',
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                backgroundColor: rewards.perfectBonus 
                  ? ['#FFD700', '#FFA500', '#FFFACD', '#FFFFFF', '#FDE68A'][Math.floor(Math.random() * 5)]
                  : ['#0DFFF2', '#FFD166', '#8AC926', '#FF595E'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 4}s`,
                opacity: 0.8
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm">
        {/* Perfect Win Seal - Extra Prominent */}
        {rewards.perfectBonus && (
          <div className="absolute -top-20 -right-12 z-[60] animate-[sealIn_0.8s_cubic-bezier(0.175,0.885,0.32,1.275)_backwards]">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Rotating Sunburst Rays */}
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,#fbbf24_15%,transparent_30%,#fbbf24_45%,transparent_60%,#fbbf24_75%,transparent_90%,transparent_100%)] animate-[spin_12s_linear_infinite] opacity-40 blur-[2px] rounded-full scale-125"></div>
              
              {/* Secondary Glow */}
              <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full animate-pulse"></div>

              {/* The Gold Seal */}
              <div className="relative w-28 h-28 bg-gradient-to-br from-yellow-200 via-yellow-500 to-amber-700 rounded-full border-[6px] border-white shadow-[0_0_40px_rgba(251,191,36,0.6)] flex flex-col items-center justify-center rotate-12 overflow-hidden group">
                {/* Surface Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 animate-[shimmer_2.5s_infinite]"></div>
                
                <span className="material-symbols-outlined text-background-dark text-5xl font-black drop-shadow-[0_2px_0_rgba(255,255,255,0.4)]">workspace_premium</span>
                <div className="flex flex-col -mt-1">
                  <span className="text-[11px] font-black text-background-dark uppercase tracking-tighter leading-none italic">FLAWLESS</span>
                  <span className="text-[11px] font-black text-background-dark uppercase tracking-tighter leading-none italic">VICTORY</span>
                </div>
                
                {/* Seal Ribbons */}
                <div className="absolute -bottom-1 flex gap-1.5">
                   <div className="w-4 h-10 bg-amber-700 -rotate-12 rounded-b-sm shadow-md border-x border-amber-800"></div>
                   <div className="w-4 h-10 bg-amber-800 rotate-12 rounded-b-sm shadow-md border-x border-amber-900"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!showRewards ? (
          <div className="space-y-6 animate-[scaleIn_0.5s_ease-out] w-full">
            {/* Main Icon/Badge Area */}
            <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
              {rewards.perfectBonus ? (
                <>
                  <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,rgba(250,204,21,0.2)_25%,transparent_50%,rgba(250,204,21,0.2)_75%,transparent_100%)] animate-[spin_10s_linear_infinite] rounded-full blur-md"></div>
                  
                  <div className="relative z-10 animate-[float_3s_ease-in-out_infinite]">
                    <div className="relative">
                      <span className="material-symbols-outlined text-9xl text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.9)]">auto_awesome_motion</span>
                      <div className="absolute -inset-6 bg-yellow-400/30 rounded-full blur-2xl animate-ping"></div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-8xl text-primary animate-bounce">auto_awesome</span>
                  <div className="absolute -inset-8 bg-primary/20 rounded-full blur-2xl animate-ping"></div>
                </>
              )}
            </div>
            
            <div className="space-y-2">
              <h2 className={`text-6xl font-black italic tracking-tighter uppercase animate-[victoryText_2.5s_cubic-bezier(0.34,1.56,0.64,1)_infinite] ${rewards.perfectBonus ? 'text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.8)]' : 'text-white drop-shadow-[0_0_20px_rgba(13,223,242,0.8)]'}`}>
                {rewards.perfectBonus ? 'FLAWLESS!' : 'VICTORY!'}
              </h2>
              <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-[10px]">
                {guardianName}'s curse has been lifted
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={() => setShowRewards(true)}
                className={`px-10 py-4 rounded-full text-xs font-black transition-all uppercase tracking-widest active:scale-95 group relative overflow-hidden ${rewards.perfectBonus ? 'bg-yellow-400 text-background-dark shadow-[0_0_30px_rgba(250,204,21,0.5)] hover:bg-white' : 'bg-primary text-background-dark shadow-[0_0_25px_rgba(13,223,242,0.5)] hover:bg-white'}`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Examine Spoils
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </span>
              </button>
              
              <button 
                onClick={onReplay}
                className="px-10 py-3 bg-transparent border-2 border-white/10 rounded-full text-[10px] font-black text-white/40 hover:text-white hover:border-white/30 transition-all uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform duration-500">replay</span>
                Battle Again
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full animate-[scaleIn_0.5s_ease-out]">
            <RewardsDisplay 
              rewards={rewards} 
              playerLevel={progression.level}
              currentXP={progression.xp}
              maxXP={progression.maxXp}
              onContinue={onComplete} 
            />
            
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="w-12 h-[1px] bg-white/10"></div>
              <button 
                onClick={onReplay}
                className="group w-full max-w-[240px] py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/40 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all uppercase tracking-[0.4em] active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm group-hover:rotate-[-120deg] transition-transform duration-700">replay</span>
                Rematch Guardian
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes sealIn {
          0% { transform: scale(4) rotate(-45deg); opacity: 0; filter: blur(15px); }
          70% { transform: scale(0.85) rotate(15deg); opacity: 1; filter: blur(0); }
          100% { transform: scale(1) rotate(12deg); opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-25deg); }
          40%, 100% { transform: translateX(150%) skewX(-25deg); }
        }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes victoryText {
          0%, 100% { 
            transform: scale(1) translateY(0) rotate(0deg); 
            filter: brightness(1); 
          }
          50% { 
            transform: scale(1.15) translateY(-15px) rotate(1deg); 
            filter: brightness(1.4); 
          }
        }
      `}</style>
    </div>
  );
};

export default VictoryScreen;