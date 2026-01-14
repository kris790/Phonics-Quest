
import React from 'react';
import { Guardian } from '../../types';

interface GuardianIntroProps {
  guardian: Guardian;
  onEngage: () => void;
}

const GuardianIntro: React.FC<GuardianIntroProps> = ({ guardian, onEngage }) => {
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center p-8 bg-background-dark/80 backdrop-blur-md animate-fadeIn">
      <div className="max-w-sm w-full space-y-8 flex flex-col items-center">
        {/* Cinematic Title */}
        <div className="text-center space-y-1">
          <p className="text-primary font-black uppercase tracking-[0.5em] text-[10px]">Challenge Encounter</p>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(13,223,242,0.4)]">
            {guardian.name}
          </h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">{guardian.title}</p>
        </div>

        {/* Character Visual */}
        <div className="relative w-48 h-48">
          <div 
            className="absolute inset-0 rounded-full bg-center bg-cover border-4 border-white/10 shadow-[0_0_50px_rgba(13,223,242,0.2)]"
            style={{ backgroundImage: `url(${guardian.image})` }}
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-background-dark/80 to-transparent"></div>
        </div>

        {/* Dialogue Box */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative">
          <span className="material-symbols-outlined absolute -top-3 -left-3 text-primary bg-background-dark rounded-full">chat_bubble</span>
          <p className="text-sm text-white/80 italic leading-relaxed text-center">
            "Your voice is but a whisper in the coming silence. Let us see if you can weave a melody from this static..."
          </p>
        </div>

        {/* CTA */}
        <button 
          onClick={onEngage}
          className="group relative px-12 py-4 bg-primary text-background-dark font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(13,223,242,0.4)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            Engage Combat
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">swords</span>
          </span>
          <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
        </button>
      </div>
    </div>
  );
};

export default GuardianIntro;
