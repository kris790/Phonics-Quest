import React, { useState, useEffect, useRef } from 'react';
import { BattleRewards, ProgressionState, LootItem } from '../../types';

interface VictoryScreenProps {
  guardianName: string;
  rewards: BattleRewards;
  progression: ProgressionState;
  onComplete: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  common: 'text-white border-white/20 shadow-white/5',
  rare: 'text-primary border-primary/40 shadow-primary/10',
  epic: 'text-purple-400 border-purple-500/40 shadow-purple-500/10',
  legendary: 'text-yellow-400 border-yellow-500/40 shadow-yellow-500/20'
};

const VictoryScreen: React.FC<VictoryScreenProps> = ({ 
  guardianName, 
  rewards, 
  progression,
  onComplete 
}) => {
  const [phase, setPhase] = useState<'intro' | 'rewards'>('intro');
  const [displayXP, setDisplayXP] = useState(0);
  const [displayCrystals, setDisplayCrystals] = useState(0);
  const [visibleLootCount, setVisibleLootCount] = useState(0);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [barProgress, setBarProgress] = useState((progression.xp / progression.maxXp) * 100);
  
  const xpRef = useRef(progression.xp);
  const maxXpRef = useRef(progression.maxXp);
  const levelRef = useRef(progression.level);

  useEffect(() => {
    if (phase === 'rewards') {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      let step = 0;
      const totalXpToAdd = rewards.xp;
      const totalCrystalsToAdd = rewards.crystals;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        // Linear counts
        const currentAddedXp = Math.floor(totalXpToAdd * progress);
        setDisplayXP(currentAddedXp);
        setDisplayCrystals(Math.floor(totalCrystalsToAdd * progress));

        // XP Bar Logic (Simulate filling)
        let simulatedXp = progression.xp + currentAddedXp;
        let simulatedLevel = progression.level;
        let simulatedMaxXp = progression.maxXp;
        
        if (simulatedXp >= simulatedMaxXp) {
          setIsLevelingUp(true);
          // For simplicity in UI animation, we just show it reaching 100% 
          // but we could make it wrap around if we wanted to be very fancy
          setBarProgress(100);
        } else {
          setBarProgress((simulatedXp / simulatedMaxXp) * 100);
        }

        if (step >= steps) {
          clearInterval(timer);
          // Trigger Loot
          if (rewards.loot?.length) {
            let lootIdx = 0;
            const lootTimer = setInterval(() => {
              lootIdx++;
              setVisibleLootCount(lootIdx);
              if (lootIdx >= rewards.loot!.length) clearInterval(lootTimer);
            }, 400);
          }
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [phase, rewards, progression]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background-dark/95 backdrop-blur-2xl p-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">
        
        {phase === 'intro' ? (
          <div className="animate-fadeIn flex flex-col items-center gap-8">
            <div className="relative">
              <span className="material-symbols-outlined text-[160px] text-primary drop-shadow-[0_0_50px_rgba(13,223,242,0.8)] animate-bounce">
                trophy
              </span>
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-ping"></div>
            </div>
            
            <div className="space-y-3 text-center">
              <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_0_25px_#0ddff2]">
                Victory
              </h2>
              <p className="text-primary font-black uppercase tracking-[0.5em] text-[12px] opacity-80">
                {guardianName} Restored
              </p>
            </div>

            <button 
              onClick={() => setPhase('rewards')}
              className="mt-4 px-12 py-5 bg-primary text-background-dark rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(13,223,242,0.5)] active:scale-95 transition-all hover:brightness-110"
            >
              Examine Echoes
            </button>
          </div>
        ) : (
          <div className="w-full space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="text-center space-y-1">
              <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">Battle Rewards</h3>
              <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">{guardianName}'s Gift</h2>
            </div>

            {/* XP Section */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-md">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Combat Experience</span>
                  <div className="text-3xl font-black text-white italic flex items-baseline gap-2">
                    Level {isLevelingUp ? progression.level + 1 : progression.level}
                    {isLevelingUp && (
                       <span className="text-[10px] bg-primary text-background-dark px-2 py-0.5 rounded-full animate-pulse tracking-widest uppercase font-black ml-2 shadow-[0_0_10px_#0ddff2]">
                         Rank Up
                       </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-primary font-black text-2xl tracking-tighter">+{displayXP} XP</span>
                </div>
              </div>
              
              <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-1">
                <div 
                  className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-300 shadow-[0_0_15px_#0ddff2]" 
                  style={{ width: `${barProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Crystal Counter */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                    <span className="material-symbols-outlined text-primary text-3xl animate-pulse">diamond</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Resonance Crystals</p>
                    <p className="text-2xl font-black text-white leading-none">+{displayCrystals}</p>
                  </div>
                </div>
                {rewards.perfectBonus && (
                  <div className="bg-yellow-400/10 border border-yellow-400/30 px-3 py-1.5 rounded-xl text-[10px] font-black text-yellow-400 uppercase tracking-widest animate-bounce shadow-xl">
                    Perfect
                  </div>
                )}
            </div>

            {/* Loot List */}
            {rewards.loot && rewards.loot.length > 0 && (
              <div className="space-y-3">
                <p className="text-center text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Treasures Unearthed</p>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {rewards.loot.slice(0, visibleLootCount).map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`bg-black/40 border-2 rounded-2xl p-4 flex items-center justify-between transition-all duration-500 scale-100 opacity-100 animate-[fadeIn_0.5s_ease-out] ${RARITY_COLORS[item.rarity] || 'border-white/10 shadow-lg'}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl drop-shadow-md">{item.icon}</span>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight">{item.name}</p>
                          <p className="text-[10px] opacity-60 italic font-medium">{item.description}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-50">{item.rarity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={onComplete}
              className="w-full py-5 bg-white text-background-dark rounded-2xl font-black uppercase tracking-[0.3em] text-sm shadow-2xl hover:bg-primary transition-all active:scale-95 active:brightness-90"
            >
              Continue Journey
            </button>
          </div>
        )}
      </div>

      {/* Celebration Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              backgroundColor: ['#0DFFF2', '#FFD166', '#8AC926', '#FF5C38', '#FFFFFF'][Math.floor(Math.random() * 5)],
              animationDuration: `${2.5 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.7
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VictoryScreen;