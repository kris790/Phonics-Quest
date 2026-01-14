
import React from 'react';
import { ProgressionState } from '../types';
import { HERO_LORE, ASSETS, WORLD_LORE } from '../constants';

interface CharacterSheetProps {
  progression: ProgressionState;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ progression }) => {
  return (
    <div className="absolute inset-0 z-40 bg-background-dark p-6 overflow-y-auto pb-32">
      {/* Header with Stats Summary */}
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

        {/* Attribute Cards */}
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(progression.attributes).map(([key, val]) => (
            <div key={key} className="bg-white/5 border border-white/10 rounded-lg p-2 flex flex-col items-center">
              <span className="text-[8px] text-white/40 uppercase font-black tracking-tighter mb-1">{key}</span>
              <span className="text-lg font-bold text-white leading-none">{val}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Main Narrative Sections */}
      <section className="space-y-8">
        {/* World Overview */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative">
          <div className="absolute top-4 right-4 text-primary opacity-20">
            <span className="material-symbols-outlined text-4xl">travel_explore</span>
          </div>
          <h2 className="text-primary font-black text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-primary/40"></span>
            The Realm
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Welcome to <span className="text-primary font-bold">{WORLD_LORE.kingdomName}</span>. 
            Once a symphony of spoken word, it has been choked by <span className="text-white font-bold italic">The Great Silence</span>.
          </p>
          <div className="mt-4 flex gap-4 text-[10px] text-white/40 font-bold italic border-t border-white/10 pt-4">
             <div className="flex flex-col">
                <span className="text-white/60">Origin</span>
                <span>{HERO_LORE.origin}</span>
             </div>
             <div className="flex flex-col">
                <span className="text-white/60">Quest Objective</span>
                <span>{HERO_LORE.motivation}</span>
             </div>
          </div>
        </div>

        {/* Hero's Chronicles (The Big Story) */}
        <div className="space-y-6">
          <h2 className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em] mb-4 text-center">Hero's Chronicles</h2>
          
          {HERO_LORE.chronicles.map((chapter, idx) => (
            <div key={idx} className="relative group">
                {/* Vertical Timeline Line */}
                {idx !== HERO_LORE.chronicles.length - 1 && (
                    <div className="absolute top-8 left-4 w-[1px] h-full bg-gradient-to-b from-primary/40 to-transparent"></div>
                )}
                
                <div className="flex gap-4">
                    <div className="relative z-10 w-8 h-8 rounded-full bg-background-dark border border-primary/30 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-primary italic">0{idx + 1}</span>
                    </div>
                    <div className="flex-1 pb-4">
                        <h3 className="text-white font-black italic tracking-tight mb-2 group-hover:text-primary transition-colors">
                            {chapter.title}
                        </h3>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                            <p className="text-xs text-white/60 leading-relaxed italic">
                                "{chapter.content}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>

        {/* Currency/Asset Summary */}
        <div className="bg-background-dark border border-white/10 rounded-2xl p-5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
                <span className="material-symbols-outlined text-amber-400">diamond</span>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase font-black">Crystals Found</p>
                <p className="text-xl font-bold text-white">{progression.crystalsFound}</p>
              </div>
           </div>
           <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-[10px] font-black text-white/60 transition-colors uppercase tracking-widest border border-white/5">
              Inventory
           </button>
        </div>
      </section>
    </div>
  );
};

export default CharacterSheet;
