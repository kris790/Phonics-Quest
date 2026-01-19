
import React from 'react';
import { RootState } from '../types';
import { KINGDOM_ROADMAP } from '../constants';

interface KingdomLedgerProps {
  progression: RootState['progression'];
  onClose: () => void;
}

const KingdomLedger: React.FC<KingdomLedgerProps> = ({ progression, onClose }) => {
  // Adapted Metrics calculation (Simulated for visualization)
  const resonanceVelocity = (progression.level / 2).toFixed(1);
  const phoneticPrecision = 85 + Math.floor(Math.random() * 10); // Simulated mastery %
  const weaversFocus = (progression.restorationPoints * 12); // Simulated "minutes" on task
  const cantorApproval = "94%"; // Simulated NPS

  return (
    <div className="absolute inset-0 z-50 bg-background-dark/95 backdrop-blur-xl p-6 overflow-y-auto pb-32 custom-scrollbar animate-fadeIn">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Kingdom Ledger</h1>
          <p className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] mt-1">Strategic Restoration Insights</p>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
        >
          <span className="material-symbols-outlined text-white/40">close</span>
        </button>
      </header>

      {/* Metrics Grid */}
      <section className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Resonance Velocity</span>
          <p className="text-2xl font-black text-white italic">{resonanceVelocity} <span className="text-xs opacity-40 not-italic">Islands/Moon</span></p>
          <p className="text-[9px] text-white/30 leading-tight">Rate of successful syllable reclamation adjusted for current power level.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Phonetic Precision</span>
          <p className="text-2xl font-black text-white italic">{phoneticPrecision}% <span className="text-xs opacity-40 not-italic">Mastery</span></p>
          <p className="text-[9px] text-white/30 leading-tight">Percentage of Weavers demonstrating proficiency in end-of-level trials.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Weaver's Focus</span>
          <p className="text-2xl font-black text-white italic">{weaversFocus} <span className="text-xs opacity-40 not-italic">Minutes</span></p>
          <p className="text-[9px] text-white/30 leading-tight">Average session duration and total active time indicating engagement.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Cantor Approval</span>
          <p className="text-2xl font-black text-white italic">{cantorApproval} <span className="text-xs opacity-40 not-italic">Score</span></p>
          <p className="text-[9px] text-white/30 leading-tight">Approval ratings from High Cantors and Kingdom Scribes (NPS).</p>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-[2px] flex-1 bg-white/10"></div>
          <h2 className="text-white font-black uppercase text-xs tracking-[0.5em] opacity-40">Future Restoration Roadmap</h2>
          <div className="h-[2px] flex-1 bg-white/10"></div>
        </div>

        <div className="space-y-4">
          {KINGDOM_ROADMAP.map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 group hover:border-primary/40 transition-all">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full">{item.quarter}</span>
                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">{item.focus}</h3>
              </div>
              <p className="text-xs text-white/60 leading-relaxed italic">{item.deliverables}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-8 border-t border-white/5">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Kingdom Restoration Initiative © 2026 Age of Resonance</p>
      </footer>
    </div>
  );
};

export default KingdomLedger;
