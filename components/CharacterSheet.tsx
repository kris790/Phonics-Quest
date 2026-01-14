
import React from 'react';
import { ProgressionState } from '../types';
import { HERO_LORE, ASSETS } from '../constants';

interface CharacterSheetProps {
  progression: ProgressionState;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ progression }) => {
  return (
    <div className="absolute inset-0 z-40 bg-background-dark p-6 overflow-y-auto pb-24">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 p-1">
            <img src={ASSETS.hero} className="w-full h-full object-contain" alt="Hero Portrait" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{HERO_LORE.name}</h1>
            <p className="text-primary font-bold text-xs uppercase tracking-widest">{HERO_LORE.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/60">Level {progression.level}</span>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(progression.xp / progression.maxXp) * 100}%` }}></div>
            </div>
            <span className="text-[10px] text-white/40 font-bold">{progression.xp}/{progression.maxXp} XP</span>
        </div>
      </header>

      <section className="space-y-6">
        {/* Backstory Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl">history_edu</span>
            </div>
            <h3 className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">Hero's Journal</h3>
            <p className="text-sm text-white/70 leading-relaxed italic mb-4">
                "{HERO_LORE.backstory}"
            </p>
            <div className="flex gap-4 border-t border-white/5 pt-4">
                <div>
                    <p className="text-[10px] text-white/30 uppercase font-bold">Origin</p>
                    <p className="text-xs text-white/80">{HERO_LORE.origin}</p>
                </div>
                <div>
                    <p className="text-[10px] text-white/30 uppercase font-bold">Quest</p>
                    <p className="text-xs text-white/80">{HERO_LORE.motivation}</p>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div>
            <h3 className="text-white/40 font-bold text-xs uppercase tracking-[0.2em] mb-3 ml-1">Combat Attributes</h3>
            <div className="grid grid-cols-2 gap-3">
                {Object.entries(progression.attributes).map(([key, val]) => (
                    <div key={key} className="bg-background-dark border border-white/10 rounded-xl p-4 flex flex-col items-center gap-1 group hover:border-primary/50 transition-colors">
                        <span className="text-[10px] text-white/40 uppercase font-bold group-hover:text-primary transition-colors">{key}</span>
                        <span className="text-2xl font-bold text-white">{val}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default CharacterSheet;
