
import React, { useState, useEffect } from 'react';
import RewardsDisplay from './RewardsDisplay';
import { BattleRewards, ProgressionState } from '../../types';

interface VictoryScreenProps {
  guardianName: string;
  rewards: BattleRewards;
  progression: ProgressionState;
  onComplete: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ 
  guardianName, 
  rewards, 
  progression,
  onComplete 
}) => {
  const [showRewards, setShowRewards] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    setConfetti(true);
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-8 overflow-hidden">
      {/* Background Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      
      {/* Confetti Effect */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full animate-[fall_3s_linear_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                backgroundColor: ['#0DFFF2', '#FFD166', '#8AC926', '#FFF'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm">
        {!showRewards ? (
          <div className="space-y-8 animate-[scaleIn_0.5s_ease-out] w-full">
            <div className="relative mx-auto w-32 h-32">
              <span className="material-symbols-outlined text-8xl text-primary animate-bounce">auto_awesome</span>
              <div className="absolute -inset-8 bg-primary/20 rounded-full blur-2xl animate-ping"></div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-white italic tracking-tighter drop-shadow-[0_0_20px_rgba(13,223,242,0.8)] uppercase">
                Harmony Restored!
              </h2>
              <p className="text-primary/60 font-black uppercase tracking-[0.3em] text-[10px]">
                {guardianName}'s curse has been lifted
              </p>
            </div>

            <button 
              onClick={() => setShowRewards(true)}
              className="px-10 py-4 bg-primary/10 border border-primary/30 rounded-full text-xs font-black text-primary hover:bg-primary/20 transition-all uppercase tracking-widest active:scale-95"
            >
              Examine Spoils
            </button>
          </div>
        ) : (
          <RewardsDisplay 
            rewards={rewards} 
            playerLevel={progression.level}
            currentXP={progression.xp}
            maxXP={progression.maxXp}
            onContinue={onComplete} 
          />
        )}
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default VictoryScreen;
