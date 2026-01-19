
import React, { useState } from 'react';
import { RootState, Artifact, Pet } from '../types';
import { DECORATIONS } from '../constants';

interface HeroRoomProps {
  progression: RootState['progression'];
  onEquipDecoration: (slot: string, decorationId: string) => void;
  onSetActivePet: (petId: string | null) => void;
}

const HeroRoom: React.FC<HeroRoomProps> = ({ progression, onEquipDecoration, onSetActivePet }) => {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const unlockedDecos = DECORATIONS.filter(d => d.unlockedAtRestorationLevel <= progression.restorationLevel);

  return (
    <div className="absolute inset-0 z-40 bg-background-dark flex flex-col pb-24 overflow-y-auto custom-scrollbar">
      <div className="h-[300px] relative shrink-0 bg-gradient-to-b from-indigo-950/20 to-background-dark border-b border-white/5 overflow-hidden flex items-center justify-center">
         {/* Room Visualization... */}
         <div className="text-center">
            <h3 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Active Companion</h3>
            {progression.activePetId ? (
              <div className="animate-bounce">
                <span className="text-7xl drop-shadow-[0_0_20px_#0ddff2]">
                  {progression.pets.find(p => p.id === progression.activePetId)?.icon}
                </span>
                <p className="mt-2 text-white font-black italic">{progression.pets.find(p => p.id === progression.activePetId)?.name}</p>
              </div>
            ) : <p className="text-white/20 italic text-xs">No active pet.</p>}
         </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Pets Collection */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-black uppercase text-xs tracking-[0.3em]">Resonance Companions</h3>
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{progression.pets.length} Rescued</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {progression.pets.map((pet) => (
              <button 
                key={pet.id}
                onClick={() => onSetActivePet(progression.activePetId === pet.id ? null : pet.id)}
                className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all ${progression.activePetId === pet.id ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
              >
                <span className="text-2xl">{pet.icon}</span>
                <span className="text-[7px] font-black uppercase text-white/60 tracking-tighter mt-1">{pet.rarity}</span>
              </button>
            ))}
            {progression.pets.length === 0 && <div className="col-span-4 py-8 text-center text-white/20 italic text-[10px]">Hatch eggs in the Sanctuary to collect pets.</div>}
          </div>
        </section>

        {/* Artifacts... */}
        <section>
          <h3 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-4">Artifact Gallery</h3>
          <div className="grid grid-cols-2 gap-4">
            {progression.artifacts.map((art) => (
              <button key={art.id} onClick={() => setSelectedArtifact(art)} className="relative aspect-square rounded-2xl border border-white/10 overflow-hidden">
                <img src={art.imageUrl} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>
      </div>

      {selectedArtifact && (
        <div className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-xl p-8 flex flex-col items-center justify-center">
          <button onClick={() => setSelectedArtifact(null)} className="absolute top-6 right-6 text-white/40"><span className="material-symbols-outlined">close</span></button>
          <img src={selectedArtifact.imageUrl} className="w-64 h-64 rounded-2xl border border-primary/40 shadow-2xl" />
          <h2 className="mt-6 text-3xl font-black text-white uppercase italic">{selectedArtifact.name}</h2>
          <p className="mt-2 text-white/60 text-center italic">{selectedArtifact.description}</p>
        </div>
      )}
    </div>
  );
};

export default HeroRoom;
