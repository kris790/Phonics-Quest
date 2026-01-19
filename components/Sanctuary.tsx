
import React from 'react';
import { RootState, NPC, ActivityEntry } from '../types';
import { NPCS } from '../constants';
import ActivityLog from './ActivityLog';

/**
 * LEGO COMPONENT: NPC Stall
 * Single responsibility: Render a specialist's stall in the sanctuary.
 */
const NPCStall: React.FC<{ npc: NPC; isUnlocked: boolean }> = ({ npc, isUnlocked }) => (
  <div 
    className={`bg-white/5 border rounded-2xl p-5 flex items-center gap-5 transition-all ${isUnlocked ? 'border-white/10 opacity-100 shadow-xl' : 'border-white/5 opacity-30 grayscale'}`}
  >
    <div className="w-14 h-14 rounded-full bg-background-dark border border-white/10 flex items-center justify-center text-3xl shadow-lg shrink-0">
      {isUnlocked ? npc.icon : '❓'}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-black text-white uppercase italic tracking-tight truncate">{npc.name}</h4>
        {isUnlocked && (
          <span className="text-[8px] font-black bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary/20 whitespace-nowrap">
            {npc.bonus}
          </span>
        )}
      </div>
      <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-1">{npc.title}</p>
      <p className="text-xs text-white/60 italic leading-snug line-clamp-2">
        {isUnlocked ? npc.description : `Rescue from ${npc.unlockedAfter === 'ch1' ? 'Consonant Cove' : npc.unlockedAfter === 'ch2' ? 'Vowel Valley' : npc.unlockedAfter === 'ch3' ? 'Blend Beach' : 'Digraph Den'} to unlock.`}
      </p>
    </div>
  </div>
);

/**
 * LEGO COMPONENT: Restoration Meter
 * Single responsibility: Display meta-progression towards the next reward.
 */
const RestorationMeter: React.FC<{ progress: number; level: number; onClaim: () => void; isReady: boolean; onViewLedger: () => void; onOpenParent: () => void }> = ({ progress, level, onClaim, isReady, onViewLedger, onOpenParent }) => (
  <section className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-all"></div>
    <div className="relative z-10">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-white font-black uppercase text-xs tracking-widest mb-1 opacity-60">Restoration Level</h2>
          <p className="text-4xl font-black italic text-primary drop-shadow-[0_0_15px_#0ddff2]">LV {level}</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <button 
            onClick={onViewLedger}
            className="flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-widest hover:brightness-125 transition-all"
          >
            <span className="material-symbols-outlined text-xs">assessment</span>
            Kingdom Report
          </button>
          <button 
            onClick={onOpenParent}
            className="flex items-center gap-1 text-[9px] font-black text-amber-400 uppercase tracking-widest hover:brightness-125 transition-all"
          >
            <span className="material-symbols-outlined text-xs">parental_control</span>
            Parent Portal
          </button>
        </div>
      </div>
      
      <div className="h-4 bg-black/40 rounded-full border border-white/10 p-1 relative">
        <div 
          className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-1000 shadow-[0_0_15px_#0ddff2]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {isReady && (
        <button 
          onClick={onClaim}
          className="mt-6 w-full py-4 bg-amber-400 text-background-dark font-black rounded-xl animate-bounce shadow-[0_0_30px_rgba(251,191,36,0.5)] uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all"
        >
          Claim Restoration Cache!
        </button>
      )}
    </div>
  </section>
);

interface SanctuaryProps {
  progression: RootState['progression'];
  onClaimReward: () => void;
  onViewLedger: () => void;
  onOpenParentDashboard: () => void;
}

const Sanctuary: React.FC<SanctuaryProps> = ({ progression, onClaimReward, onViewLedger, onOpenParentDashboard }) => {
  const restorationProgress = (progression.restorationPoints % 100);
  const isRewardReady = progression.restorationPoints >= 100;

  return (
    <div className="absolute inset-0 z-40 bg-background-dark p-6 overflow-y-auto pb-32 custom-scrollbar">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">The Sanctuary</h1>
        <p className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">Kingdom Restoration Hub</p>
      </header>

      <RestorationMeter 
        progress={restorationProgress} 
        level={progression.restorationLevel} 
        onClaim={onClaimReward} 
        isReady={isRewardReady}
        onViewLedger={onViewLedger}
        onOpenParent={onOpenParentDashboard}
      />

      <section className="space-y-4">
        <h3 className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em] mb-4">Sanctuary Specialists</h3>
        {NPCS.map((npc) => (
          <NPCStall 
            key={npc.id} 
            npc={npc} 
            isUnlocked={progression.unlockedNPCs.includes(npc.id)} 
          />
        ))}
      </section>

      <ActivityLog activities={progression.recentActivities} />
    </div>
  );
};

export default Sanctuary;
