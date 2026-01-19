
import React, { useState } from 'react';
import { RootState, NPC, ActivityEntry, Egg, Pet, PetRarity } from '../types';
import { NPCS } from '../constants';
import ActivityLog from './ActivityLog';

interface SanctuaryProps {
  progression: RootState['progression'];
  onClaimReward: () => void;
  onViewLedger: () => void;
  onOpenParentDashboard: () => void;
  onSpin: (type: 'crystals' | 'egg', rarity?: PetRarity, amount?: number) => void;
  onHatch: (eggId: string, pet: Pet) => void;
}

const Sanctuary: React.FC<SanctuaryProps> = ({ progression, onClaimReward, onViewLedger, onOpenParentDashboard, onSpin, onHatch }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  const canSpin = !progression.lastSpinTimestamp || (Date.now() - progression.lastSpinTimestamp > 86400000);

  const handleSpin = () => {
    if (!canSpin || isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);
    
    setTimeout(() => {
      const rand = Math.random();
      if (rand > 0.3) {
        const crystals = Math.floor(Math.random() * 20) + 10;
        onSpin('crystals', undefined, crystals);
        setSpinResult(`+${crystals} Crystals`);
      } else {
        const rarity: PetRarity = rand > 0.05 ? 'common' : rand > 0.01 ? 'rare' : 'epic';
        onSpin('egg', rarity);
        setSpinResult(`${rarity.toUpperCase()} Egg!`);
      }
      setIsSpinning(false);
    }, 2000);
  };

  const hatchEgg = (egg: Egg) => {
    const petLibrary: Record<PetRarity, Pet[]> = {
      common: [{ id: `pet-${Date.now()}`, name: 'Nautilus', rarity: 'common', icon: '🐌', buffDescription: '-5% Guardian DMG', buffType: 'damage_reduction' }],
      rare: [{ id: `pet-${Date.now()}`, name: 'Sparky', rarity: 'rare', icon: '🧚', buffDescription: '+2s Voice Time', buffType: 'timeout_extension' }],
      epic: [{ id: `pet-${Date.now()}`, name: 'Phoenix', rarity: 'epic', icon: '🔥', buffDescription: '+10% Crit Luck', buffType: 'crit_boost' }]
    };
    const options = petLibrary[egg.rarity];
    onHatch(egg.id, options[Math.floor(Math.random() * options.length)]);
  };

  return (
    <div className="absolute inset-0 z-40 bg-background-dark p-6 overflow-y-auto pb-32 custom-scrollbar">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">The Sanctuary</h1>
        <p className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">Kingdom Restoration Hub</p>
      </header>

      {/* Daily Wheel */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col items-center gap-4">
           <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Daily Resonance Wheel</h3>
           <div className={`w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center relative transition-transform duration-[2000ms] ${isSpinning ? 'rotate-[1080deg]' : ''}`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-primary font-black">▼</div>
              <span className="material-symbols-outlined text-4xl text-primary animate-pulse">{isSpinning ? 'refresh' : 'star'}</span>
           </div>
           {spinResult && <p className="text-primary font-black animate-bounce">{spinResult}</p>}
           <button 
             onClick={handleSpin}
             disabled={!canSpin || isSpinning}
             className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${canSpin ? 'bg-primary text-background-dark shadow-[0_0_30px_#0ddff2]' : 'bg-white/5 text-white/20 border border-white/5'}`}
           >
             {canSpin ? 'Spin the Wheel' : 'Spinning in ' + Math.ceil((86400000 - (Date.now() - (progression.lastSpinTimestamp || 0))) / 3600000) + 'h'}
           </button>
        </div>
      </section>

      {/* The Hatchery */}
      <section className="mb-8">
        <h3 className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em] mb-4">The Hatchery</h3>
        <div className="grid grid-cols-2 gap-4">
           {progression.activeEggs.map(egg => (
             <div key={egg.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-3">
                <div className="text-4xl animate-pulse">🥚</div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: `${(egg.incubationProgress / egg.incubationTarget) * 100}%` }}></div>
                </div>
                <button 
                  onClick={() => hatchEgg(egg)}
                  disabled={!egg.isReady}
                  className={`w-full py-2 rounded-lg font-black uppercase text-[8px] tracking-widest transition-all ${egg.isReady ? 'bg-amber-400 text-background-dark shadow-[0_0_15px_#fbbf24]' : 'bg-white/10 text-white/20'}`}
                >
                  {egg.isReady ? 'Hatch Pet!' : 'Incubating...'}
                </button>
             </div>
           ))}
           {progression.activeEggs.length === 0 && <div className="col-span-2 py-8 text-center border-2 border-dashed border-white/5 rounded-2xl text-[10px] text-white/20 italic">No eggs incubating. Spin the wheel to find one!</div>}
        </div>
      </section>

      <ActivityLog activities={progression.recentActivities} />
    </div>
  );
};

export default Sanctuary;
