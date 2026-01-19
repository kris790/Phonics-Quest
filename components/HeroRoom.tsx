
import React, { useState } from 'react';
import { RootState, Artifact } from '../types';
import { DECORATIONS } from '../constants';

interface HeroRoomProps {
  progression: RootState['progression'];
  onEquipDecoration: (slot: string, decorationId: string) => void;
}

const HeroRoom: React.FC<HeroRoomProps> = ({ progression, onEquipDecoration }) => {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const unlockedDecos = DECORATIONS.filter(d => d.unlockedAtRestorationLevel <= progression.restorationLevel);

  return (
    <div className="absolute inset-0 z-40 bg-background-dark flex flex-col pb-24 overflow-y-auto custom-scrollbar">
      {/* 3D Room Mockup */}
      <div className="h-[400px] relative shrink-0 bg-gradient-to-b from-indigo-950/20 to-background-dark border-b border-white/5 overflow-hidden">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-48 h-32 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center">
          {progression.decorations.wall ? (
            <div className="text-6xl animate-pulse">
              {DECORATIONS.find(d => d.id === progression.decorations.wall)?.icon}
            </div>
          ) : (
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Wall Trophy Slot</span>
          )}
        </div>
        <div className="absolute bottom-[30%] right-[15%] w-32 h-20 bg-background-dark/80 border border-white/10 rounded-lg skew-x-[-20deg] flex items-center justify-center">
          <div className="skew-x-[20deg]">
            {progression.decorations.desk ? (
              <div className="text-4xl">
                {DECORATIONS.find(d => d.id === progression.decorations.desk)?.icon}
              </div>
            ) : (
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Desk Slot</span>
            )}
          </div>
        </div>
        <div className="absolute bottom-[10%] left-[20%] w-48 h-24 bg-background-dark/40 border border-white/5 rounded-[100%] flex items-center justify-center">
          {progression.decorations.floor ? (
            <div className="text-5xl">
              {DECORATIONS.find(d => d.id === progression.decorations.floor)?.icon}
            </div>
          ) : (
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Rug Slot</span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Artifact Gallery */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-black uppercase text-xs tracking-[0.3em]">Restoration Artifacts</h3>
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{progression.artifacts.length} Discovered</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {progression.artifacts.map((art) => (
              <button 
                key={art.id}
                onClick={() => setSelectedArtifact(art)}
                className="relative aspect-square rounded-2xl border border-white/10 overflow-hidden group hover:border-primary/50 transition-all"
              >
                <img src={art.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={art.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2 text-left">
                   <p className="text-[9px] font-black text-white uppercase tracking-tight truncate">{art.name}</p>
                </div>
              </button>
            ))}
            {progression.artifacts.length === 0 && (
              <div className="col-span-2 py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-white/20 text-xs italic">Restore the Great Islands to discover artifacts.</p>
              </div>
            )}
          </div>
        </section>

        {/* Decoration Inventory */}
        <section>
          <h3 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-4">Room Customization</h3>
          <div className="grid grid-cols-4 gap-3">
            {unlockedDecos.map(deco => (
              <button 
                key={deco.id}
                onClick={() => onEquipDecoration(deco.slot, deco.id)}
                className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${progression.decorations[deco.slot] === deco.id ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
              >
                <span className="text-2xl">{deco.icon}</span>
                <span className="text-[8px] font-black uppercase text-white/60 tracking-tighter">{deco.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Artifact Modal */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-xl p-8 flex flex-col items-center justify-center animate-fadeIn">
          <button onClick={() => setSelectedArtifact(null)} className="absolute top-6 right-6 text-white/40"><span className="material-symbols-outlined">close</span></button>
          <div className="w-full max-w-sm flex flex-col items-center gap-6">
             <div className="w-full aspect-square rounded-3xl border-2 border-primary/40 p-2 bg-black/40 shadow-[0_0_40px_rgba(13,223,242,0.2)]">
                <img src={selectedArtifact.imageUrl} className="w-full h-full object-cover rounded-2xl" alt={selectedArtifact.name} />
             </div>
             <div className="text-center space-y-3">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{selectedArtifact.name}</h2>
                <p className="text-white/60 text-sm italic leading-relaxed">"{selectedArtifact.description}"</p>
                <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest pt-4">Restored: {new Date(selectedArtifact.timestamp).toLocaleDateString()}</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroRoom;
