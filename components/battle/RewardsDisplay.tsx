
import React, { useState, useEffect } from 'react';
import { BattleRewards, LootItem } from '../../types';

interface RewardsDisplayProps {
  rewards: BattleRewards;
  playerLevel: number;
  currentXP: number;
  maxXP: number;
  onContinue: () => void;
  onCollect?: () => void;
}

const RARITY_COLORS = {
  common: 'text-white',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400'
};

const RARITY_BORDERS = {
  common: 'border-white/20',
  rare: 'border-blue-500/40',
  epic: 'border-purple-500/40',
  legendary: 'border-yellow-500/40'
};

const RewardsDisplay: React.FC<RewardsDisplayProps> = ({
  rewards,
  playerLevel,
  currentXP,
  maxXP,
  onContinue,
  onCollect
}) => {
  const [animatedXP, setAnimatedXP] = useState(0);
  const [animatedCrystals, setAnimatedCrystals] = useState(0);
  const [showLoot, setShowLoot] = useState(false);
  const [collected, setCollected] = useState(false);

  // Calculate new level after XP
  const newXPTotal = currentXP + rewards.xp;
  const didLevelUp = newXPTotal >= maxXP;
  const newLevel = didLevelUp ? playerLevel + 1 : playerLevel;
  const newMaxXP = didLevelUp ? Math.floor(maxXP * 1.5) : maxXP;
  const displayXP = didLevelUp ? newXPTotal - maxXP : newXPTotal;

  useEffect(() => {
    // Animate counters
    const duration = 1200;
    const steps = 40;
    const stepTime = duration / steps;
    const xpStep = rewards.xp / steps;
    const crystalsStep = rewards.crystals / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setAnimatedXP(Math.min(Math.floor(xpStep * currentStep), rewards.xp));
      setAnimatedCrystals(Math.min(Math.floor(crystalsStep * currentStep), rewards.crystals));
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => setShowLoot(true), 300);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [rewards.xp, rewards.crystals]);

  const handleCollect = () => {
    setCollected(true);
    if (onCollect) onCollect();
  };

  const renderLootItem = (item: LootItem, index: number) => (
    <div
      key={`${item.id}-${index}`}
      className={`relative bg-black/40 backdrop-blur-sm rounded-xl p-3 border-2 ${RARITY_BORDERS[item.rarity]} animate-[fadeIn_0.5s_ease-out]`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{item.icon}</div>
        <div className="flex-1">
          <div className={`font-bold text-xs ${RARITY_COLORS[item.rarity]}`}>{item.name}</div>
          <div className="text-[10px] text-white/50">{item.description}</div>
        </div>
        <div className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${RARITY_COLORS[item.rarity]} bg-white/5`}>
          {item.rarity.toUpperCase()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-sm animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full bg-black/60 rounded-3xl border border-white/10 p-6 shadow-2xl">
        {/* XP Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-black text-white/40 uppercase tracking-widest">Progress</div>
            {didLevelUp && (
              <div className="text-[10px] font-black text-yellow-400 animate-pulse tracking-widest">LEVEL UP!</div>
            )}
            <div className="text-xs font-black text-white uppercase tracking-widest">LV {newLevel}</div>
          </div>
          
          <div className="relative h-2 bg-black/60 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-primary/20 transition-all duration-300"
              style={{ width: `${(currentXP / maxXP) * 100}%` }}
            />
            <div 
              className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_#0ddff2] transition-all duration-1000"
              style={{ width: `${(Math.min(displayXP, newMaxXP) / newMaxXP) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-[9px] mt-1 font-bold">
            <div className="text-white/30 italic">Current: {currentXP}</div>
            <div className="text-primary">+{animatedXP} XP</div>
            <div className="text-white/30 italic">Next: {newMaxXP}</div>
          </div>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
             <span className="material-symbols-outlined text-amber-400 text-lg mb-1">stars</span>
             <p className="text-xl font-black text-white leading-none">{animatedXP}</p>
             <p className="text-[8px] text-white/40 uppercase font-black mt-1">Exp</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
             <span className="material-symbols-outlined text-primary text-lg mb-1">diamond</span>
             <p className="text-xl font-black text-white leading-none">{animatedCrystals}</p>
             <p className="text-[8px] text-white/40 uppercase font-black mt-1">Crystals</p>
          </div>
        </div>

        {/* Loot Drops */}
        {showLoot && rewards.loot && rewards.loot.length > 0 && (
          <div className="space-y-2 mb-6">
            <div className="text-center text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Loot Acquired</div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {rewards.loot.map((item, index) => renderLootItem(item, index))}
            </div>
          </div>
        )}

        {/* Actions */}
        <button
          onClick={collected ? onContinue : handleCollect}
          className={`w-full font-black py-4 rounded-xl transition-all active:scale-95 shadow-lg ${
            collected 
            ? 'bg-white/10 text-white border border-white/20' 
            : 'bg-primary text-background-dark shadow-primary/20'
          }`}
        >
          {collected ? 'RETURN TO WORLD' : 'CLAIM ALL SPOILS'}
        </button>
      </div>
    </div>
  );
};

export default RewardsDisplay;
