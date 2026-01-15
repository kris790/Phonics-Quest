
import React from 'react';
import { RootState, NPC } from '../types';
import { NPCS } from '../constants';

interface SanctuaryProps {
  progression: RootState['progression'];
  onClaimReward: () => void;
}

const Sanctuary: React.FC<SanctuaryProps> = ({ progression, onClaimReward }) => {
  const restorationProgress = (progression.restorationPoints % 100);
  const isRewardReady = progression.restorationPoints >= 100;

  return (
    <div className="absolute inset-0 z-40 bg-background-dark p-6 overflow-y-auto pb-32">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">The Sanctuary</h1>
        <p className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">Kingdom Restoration Hub</p>
      </header>

      {/* Restoration Meter */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-white font-black uppercase text-xs tracking-widest mb-1">Restoration Level</h2>
              <p className="text-4xl font-black italic text-primary drop-shadow-[0_0_15px_#0ddff2]">LV {progression.restorationLevel}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Next Reward</span>
              <p className="text-white font-bold">{restorationProgress}/100 Points</p>
            </div>
          </div>
          
          <div className="h-4 bg-black/40 rounded-full border border-white/10 p-1 relative">
            <div 
              className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-1000 shadow-[0_0_15px_#0ddff2]"
              style={{ width: `${restorationProgress}%` }}
            ></div>
          </div>

          {isRewardReady && (
            <button 
              onClick={onClaimReward}
              className="mt-6 w-full py-4 bg-amber-400 text-background-dark font-black rounded-xl animate-bounce shadow-[0_0_30px_rgba(251,191,36,0.5)] uppercase tracking-widest text-xs"
            >
              Claim Restoration Cache!
            </button>
          )}
        </div>
      </section>

      {/* Rescued NPCs */}
      <section className="space-y-4">
        <h3 className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em] mb-4">Sanctuary Specialists</h3>
        {NPCS.map((npc) => {
          const isUnlocked = progression.unlockedNPCs.includes(npc.id);
          return (
            <div 
              key={npc.id} 
              className={`bg-white/5 border rounded-2xl p-5 flex items-center gap-5 transition-all ${isUnlocked ? 'border-white/10 opacity-100' : 'border-white/5 opacity-30 grayscale'}`}
            >
              <div className="w-14 h-14 rounded-full bg-background-dark border border-white/10 flex items-center justify-center text-3xl shadow-lg">
                {isUnlocked ? npc.icon : '❓'}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-white uppercase italic tracking-tight">{npc.name}</h4>
                  {isUnlocked && (
                    <span className="text-[9px] font-black bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary/20">
                      {npc.bonus}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-1">{npc.title}</p>
                <p className="text-xs text-white/60 italic leading-snug">
                  {isUnlocked ? npc.description : `Rescue from ${npc.unlockedAfter === 'ch1' ? 'Consonant Cove' : npc.unlockedAfter === 'ch2' ? 'Vowel Valley' : npc.unlockedAfter === 'ch3' ? 'Blend Beach' : 'Digraph Den'} to unlock.`}
                </p>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Sanctuary;
