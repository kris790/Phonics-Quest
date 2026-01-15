
import React from 'react';
import { ProgressionState, Attributes } from '../types';
import { HERO_LORE, ASSETS, WORLD_LORE, APP_VERSION } from '../constants';

interface CharacterSheetProps {
  progression: ProgressionState;
  onUpgrade: (attribute: keyof Attributes, cost: number) => void;
  onResetProgress?: () => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ progression, onUpgrade, onResetProgress }) => {
  const isBorinUnlocked = progression.unlockedNPCs.includes('borin');
  
  const calculateCost = (currentVal: number) => {
    const base = currentVal * 10;
    return isBorinUnlocked ? Math.floor(base * 0.85) : base;
  };

  return (
    <div className="absolute inset-0 z-40 bg-background-dark p-6 overflow-y-auto pb-32">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 p-1 overflow-hidden">
              <img src={ASSETS.hero} className="w-full h-full object-contain" alt="Hero Portrait" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-background-dark text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-background-dark">
              {progression.level}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">{HERO_LORE.name}</h1>
            <p className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">{HERO_LORE.title}</p>
            <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary shadow-[0_0_8px_#0ddff2]" style={{ width: `${(progression.xp / progression.maxXp) * 100}%` }}></div>
                </div>
                <span className="text-[9px] text-white/30 font-bold tabular-nums">{progression.xp}/{progression.maxXp} XP</span>
            </div>
          </div>
        </div>

        {/* Crystals Display */}
        <div className="mb-4 bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Available Crystals</span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">diamond</span>
            <span className="text-lg font-bold text-white">{progression.crystalsFound}</span>
          </div>
        </div>

        {/* Attribute Cards with Upgrade Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {(Object.entries(progression.attributes) as [keyof Attributes, number][]).map(([key, val]) => {
            const cost = calculateCost(val);
            const canAfford = progression.crystalsFound >= cost;
            return (
              <div key={key} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
                <span className="text-[9px] text-white/40 uppercase font-black tracking-tighter mb-1">{key}</span>
                <span className="text-2xl font-bold text-white leading-none mb-3">{val}</span>
                <button 
                  disabled={!canAfford}
                  onClick={() => onUpgrade(key, cost)}
                  className={`w-full py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${canAfford ? 'bg-primary/20 border-primary text-primary hover:bg-primary/30' : 'bg-white/5 border-white/5 text-white/20 opacity-50'}`}
                >
                  Upgrade ({cost})
                </button>
              </div>
            );
          })}
        </div>
      </header>

      {/* Main Narrative Sections */}
      <section className="space-y-8">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative">
          <h2 className="text-primary font-black text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-2">The Realm</h2>
          <p className="text-sm text-white/80 leading-relaxed italic">
            Welcome to <span className="text-primary font-bold">{WORLD_LORE.kingdomName}</span>. 
            Once a symphony of spoken word, it has been choked by <span className="text-white font-bold italic">The Great Silence</span>.
          </p>
        </div>

        <div className="pt-4 pb-8 flex flex-col gap-4">
          <button 
            onClick={onResetProgress}
            className="w-full py-3 bg-red-950/20 border border-red-500/20 text-red-500/60 hover:text-red-500 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            Shatter Progress (Reset Save)
          </button>
          <div className="text-[9px] text-white/10 flex flex-col items-center gap-1">
            <p>Persistence active via LocalStorage.</p>
            <p className="font-bold opacity-50 tracking-widest uppercase">Version {APP_VERSION}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CharacterSheet;
