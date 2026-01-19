
import React, { useState } from 'react';
import { RootState, Artifact, LootItem } from '../types';
import { DECORATIONS } from '../constants';

interface HeroRoomProps {
  progression: RootState['progression'];
  onEquipDecoration: (slot: string, decorationId: string) => void;
  onSetActivePet: (petId: string | null) => void;
  onEquipItem: (itemId: string, slot: 'weapon' | 'armor' | 'charm') => void;
}

const HeroRoom: React.FC<HeroRoomProps> = ({ progression, onEquipDecoration, onSetActivePet, onEquipItem }) => {
  const [view, setView] = useState<'pets' | 'armory' | 'artifacts'>('pets');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

  const equipment = progression.inventory.filter(i => i.type === 'equipment');
  const activePet = progression.pets.find(p => p.id === progression.activePetId);

  return (
    <div className="absolute inset-0 z-40 bg-background-dark flex flex-col pb-24 overflow-y-auto custom-scrollbar animate-fadeIn">
      <div className="h-[260px] relative shrink-0 bg-gradient-to-b from-indigo-950/20 to-background-dark border-b border-white/5 flex flex-col items-center justify-center p-6 text-center">
         <div className="flex gap-4 mb-6">
            <button onClick={() => setView('pets')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${view === 'pets' ? 'bg-primary text-background-dark' : 'bg-white/5 text-white/40'}`}>Pets</button>
            <button onClick={() => setView('armory')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${view === 'armory' ? 'bg-primary text-background-dark' : 'bg-white/5 text-white/40'}`}>Armory</button>
            <button onClick={() => setView('artifacts')} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${view === 'artifacts' ? 'bg-primary text-background-dark' : 'bg-white/5 text-white/40'}`}>Relics</button>
         </div>
         {view === 'pets' && (
           <div className="animate-bounce">
              <span className="text-7xl drop-shadow-[0_0_20px_#0ddff2]">{activePet ? activePet.icon : '❔'}</span>
              <p className="mt-2 text-white font-black italic uppercase tracking-tighter">{activePet ? activePet.name : 'No active pet'}</p>
           </div>
         )}
         {view === 'armory' && (
           <div className="flex gap-6">
              {['weapon', 'armor', 'charm'].map(slot => {
                const itemId = progression.equippedGear[slot as keyof typeof progression.equippedGear];
                const item = progression.inventory.find(i => i.id === itemId);
                return (
                  <div key={slot} className="flex flex-col items-center gap-2">
                    <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl ${item ? 'border-primary/50 bg-primary/10' : 'border-dashed border-white/10'}`}>
                       {item ? item.icon : '◌'}
                    </div>
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">{slot}</span>
                  </div>
                );
              })}
           </div>
         )}
      </div>

      <div className="p-6">
        {view === 'pets' && (
          <section>
            <h3 className="text-white/40 font-black uppercase text-[10px] tracking-[0.5em] mb-4">Companions</h3>
            <div className="grid grid-cols-4 gap-3">
              {progression.pets.map(pet => (
                <button key={pet.id} onClick={() => onSetActivePet(progression.activePetId === pet.id ? null : pet.id)} className={`aspect-square rounded-xl border flex items-center justify-center transition-all ${progression.activePetId === pet.id ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/10'}`}>
                  <span className="text-2xl">{pet.icon}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {view === 'armory' && (
          <section>
            <h3 className="text-white/40 font-black uppercase text-[10px] tracking-[0.5em] mb-4">Equippable Gear</h3>
            <div className="space-y-3">
              {equipment.map(item => {
                const slot = item.icon === '🪄' ? 'weapon' : item.icon === '🛡️' ? 'armor' : 'charm';
                const isEquipped = progression.equippedGear[slot] === item.id;
                return (
                  <div key={item.id} className={`bg-white/5 border rounded-xl p-4 flex items-center justify-between ${isEquipped ? 'border-primary/40' : 'border-white/10'}`}>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{item.icon}</div>
                      <div>
                        <p className="font-black text-white uppercase italic text-sm">{item.name}</p>
                        <p className="text-[9px] text-white/40 uppercase font-black">{Object.entries(item.stats || {}).map(([k,v]) => `+${v} ${k}`).join(', ')}</p>
                      </div>
                    </div>
                    <button onClick={() => onEquipItem(item.id, slot)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${isEquipped ? 'bg-damage-red text-white' : 'bg-primary text-background-dark'}`}>
                      {isEquipped ? 'Unequip' : 'Equip'}
                    </button>
                  </div>
                );
              })}
              {equipment.length === 0 && <p className="text-center py-10 text-[10px] text-white/20 italic">Forge gear at Borin's Forge in the Sanctuary.</p>}
            </div>
          </section>
        )}

        {view === 'artifacts' && (
          <section>
            <h3 className="text-white/40 font-black uppercase text-[10px] tracking-[0.5em] mb-4">Relic Collection</h3>
            <div className="grid grid-cols-2 gap-4">
              {progression.artifacts.map(art => (
                <button key={art.id} onClick={() => setSelectedArtifact(art)} className="aspect-square rounded-2xl border border-white/10 overflow-hidden bg-white/5">
                  <img src={art.imageUrl} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
              {progression.artifacts.length === 0 && <div className="col-span-2 py-10 text-center text-white/20 italic text-[10px]">Defeat guardians to earn artifacts.</div>}
            </div>
          </section>
        )}
      </div>

      {selectedArtifact && (
        <div className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-xl p-8 flex flex-col items-center justify-center animate-fadeIn">
          <button onClick={() => setSelectedArtifact(null)} className="absolute top-6 right-6 text-white/40"><span className="material-symbols-outlined">close</span></button>
          <img src={selectedArtifact.imageUrl} className="w-64 h-64 rounded-2xl border-4 border-primary/40 shadow-[0_0_40px_rgba(13,223,242,0.3)]" alt="" />
          <h2 className="mt-6 text-2xl font-black text-white uppercase italic">{selectedArtifact.name}</h2>
          <p className="mt-2 text-white/60 text-center italic text-sm leading-relaxed px-4">"{selectedArtifact.description}"</p>
        </div>
      )}
    </div>
  );
};

export default HeroRoom;
