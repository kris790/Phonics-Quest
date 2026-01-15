
import React from 'react';
import { RootState } from '../types';
import { DECORATIONS } from '../constants';

interface HeroRoomProps {
  progression: RootState['progression'];
  onEquipDecoration: (slot: string, decorationId: string) => void;
}

const HeroRoom: React.FC<HeroRoomProps> = ({ progression, onEquipDecoration }) => {
  const unlockedDecos = DECORATIONS.filter(d => d.unlockedAtRestorationLevel <= progression.restorationLevel);

  return (
    <div className="absolute inset-0 z-40 bg-background-dark flex flex-col">
      {/* 3D-ish Room View */}
      <div className="flex-1 relative bg-gradient-to-b from-indigo-950/20 to-background-dark border-b border-white/5 overflow-hidden">
        {/* Wall Slot */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-48 h-32 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center">
          {progression.decorations.wall ? (
            <div className="text-6xl animate-pulse">
              {DECORATIONS.find(d => d.id === progression.decorations.wall)?.icon}
            </div>
          ) : (
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Wall Trophy Slot</span>
          )}
        </div>

        {/* Desk Slot */}
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

        {/* Floor Slot */}
        <div className="absolute bottom-[10%] left-[20%] w-48 h-24 bg-background-dark/40 border border-white/5 rounded-[100%] flex items-center justify-center">
          {progression.decorations.floor ? (
            <div className="text-5xl">
              {DECORATIONS.find(d => d.id === progression.decorations.floor)?.icon}
            </div>
          ) : (
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Rug Slot</span>
          )}
        </div>

        {/* Hero Character Placeholder */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-48 flex flex-col items-center">
           <div className="w-20 h-20 rounded-full bg-primary/20 blur-xl"></div>
           <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mt-auto">Caelum</p>
        </div>
      </div>

      {/* Inventory Sidebar (Bottom) */}
      <div className="h-1/3 bg-background-dark/95 backdrop-blur-md p-6 overflow-y-auto">
        <h3 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-4">Inventory</h3>
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
          {unlockedDecos.length === 0 && (
            <div className="col-span-4 py-8 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-white/20 text-xs italic">Restore the kingdom to find decorations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroRoom;
