
import React, { useState } from 'react';
import { RootState, NPC, ActivityEntry, Egg, Pet, PetRarity } from '../types';
import { NPCS, FORGE_RECIPES } from '../constants';
import ActivityLog from './ActivityLog';

interface SanctuaryProps {
  progression: RootState['progression'];
  onClaimReward: () => void;
  onViewLedger: () => void;
  onOpenParentDashboard: () => void;
  onSpin: (type: 'crystals' | 'egg', rarity?: PetRarity, amount?: number) => void;
  onHatch: (eggId: string, pet: Pet) => void;
  onForge: (recipeId: string) => void;
}

const Sanctuary: React.FC<SanctuaryProps> = ({ progression, onClaimReward, onViewLedger, onOpenParentDashboard, onSpin, onHatch, onForge }) => {
  const [tab, setTab] = useState<'hub' | 'forge'>('hub');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  const canSpin = !progression.lastSpinTimestamp || (Date.now() - progression.lastSpinTimestamp > 86400000);
  const isBorinUnlocked = progression.unlockedNPCs.includes('borin');

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
    <div className="absolute inset-0 z-40 bg-background-dark p-6 overflow-y-auto pb-32 custom-scrollbar animate-fadeIn">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">The Sanctuary</h1>
          <p className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">Kingdom Hub</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('hub')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${tab === 'hub' ? 'bg-primary text-background-dark' : 'bg-white/5 text-white/40 border border-white/10'}`}>Hub</button>
          {isBorinUnlocked && <button onClick={() => setTab('forge')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${tab === 'forge' ? 'bg-amber-400 text-background-dark' : 'bg-white/5 text-white/40 border border-white/10'}`}>Forge</button>}
        </div>
      </header>

      {tab === 'hub' ? (
        <>
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-col items-center gap-4">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Daily Resonance Wheel</h3>
            <div className={`w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center relative transition-transform duration-[2000ms] ${isSpinning ? 'rotate-[1080deg]' : ''}`}>
              <span className="material-symbols-outlined text-4xl text-primary animate-pulse">{isSpinning ? 'refresh' : 'star'}</span>
            </div>
            {spinResult && <p className="text-primary font-black animate-bounce">{spinResult}</p>}
            <button onClick={handleSpin} disabled={!canSpin || isSpinning} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs ${canSpin ? 'bg-primary text-background-dark shadow-[0_0_30px_#0ddff2]' : 'bg-white/5 text-white/20 border border-white/5'}`}>
              {canSpin ? 'Spin the Wheel' : 'Wait for Reset'}
            </button>
          </section>

          <section className="mb-8">
            <h3 className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em] mb-4">The Hatchery</h3>
            <div className="grid grid-cols-2 gap-4">
              {progression.activeEggs.map(egg => (
                <div key={egg.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-3">
                  <div className="text-4xl animate-pulse">🥚</div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(egg.incubationProgress / egg.incubationTarget) * 100}%` }}></div>
                  </div>
                  <button onClick={() => hatchEgg(egg)} disabled={!egg.isReady} className={`w-full py-2 rounded-lg font-black uppercase text-[8px] ${egg.isReady ? 'bg-amber-400 text-background-dark' : 'bg-white/10 text-white/20'}`}>Hatch</button>
                </div>
              ))}
              {progression.activeEggs.length === 0 && <div className="col-span-2 py-8 text-center border-2 border-dashed border-white/5 rounded-2xl text-[10px] text-white/20 italic">No eggs. Spin the wheel!</div>}
            </div>
          </section>
          <ActivityLog activities={progression.recentActivities} />
        </>
      ) : (
        <section className="space-y-6">
          <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl p-6 flex flex-col items-center text-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-4xl">hardware</span>
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Borin's Forge</h2>
            <p className="text-xs text-white/60 italic leading-relaxed">"Gimme shards and crystals, weaver. I'll make you something the Silence can't touch."</p>
          </div>

          <div className="space-y-4">
            {FORGE_RECIPES.map(recipe => {
              const canAfford = progression.crystalsFound >= recipe.costs.crystals;
              return (
                <div key={recipe.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 group hover:border-amber-400/40 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-black/40 rounded-xl border border-white/10 flex items-center justify-center text-3xl">{recipe.result.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-black text-white italic uppercase tracking-tighter text-lg leading-none">{recipe.result.name}</h3>
                      <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mt-1">Armor Upgrade</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 italic mb-4">"{recipe.result.description}"</p>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-[10px]">diamond</span>
                        <span className="text-[10px] font-black text-white">{recipe.costs.crystals}</span>
                      </div>
                      {recipe.costs.materials.map(m => (
                         <div key={m.id} className="flex items-center gap-1">
                            <span className="text-[10px]">{m.id === 'whisper-dust' ? '✨' : '💎'}</span>
                            <span className="text-[10px] font-black text-white">x{m.amount}</span>
                         </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => onForge(recipe.id)}
                      disabled={!canAfford}
                      className={`px-6 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest ${canAfford ? 'bg-amber-400 text-background-dark shadow-[0_0_15px_#fbbf24]' : 'bg-white/5 text-white/20'}`}
                    >
                      Forge Gear
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default Sanctuary;
