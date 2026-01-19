import React, { useMemo } from 'react';
import { GameState, AnimationState, Pet } from '../types';
import { ASSETS, CHAPTERS } from '../constants';

interface ArenaProps {
  gameState: GameState;
  animationState: AnimationState;
  activePet?: Pet;
}

const Arena: React.FC<ArenaProps> = ({ gameState, animationState, activePet }) => {
  const isShaking = animationState === 'hit-shake' || animationState === 'taking-damage';
  
  // Try to determine current chapter from feedback or default
  const currentChapter = CHAPTERS.find(c => gameState.feedback.includes(c.name)) || CHAPTERS[0];
  const guardianColor = currentChapter.guardian.accentColor;
  const isConsonantCove = currentChapter.id === 'ch1';

  // Generate some static particles for the fog effect
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      bottom: `-${Math.random() * 20}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${15 + Math.random() * 15}s`,
      size: `${2 + Math.random() * 4}px`,
    }));
  }, []);

  return (
    <div className={`absolute inset-0 z-0 transition-transform duration-100 ${isShaking ? 'shake-active' : ''}`}>
      {/* Background Image Layer */}
      <div className="absolute inset-0 bg-center bg-cover transition-all duration-1000" style={{ backgroundImage: `url(${currentChapter.background})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
      </div>

      {/* Atmospheric Fog Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000">
        {/* Deep Distant Mist */}
        <div 
          className="absolute top-1/2 -left-1/2 w-[200%] h-full bg-white/5 blur-[120px] rounded-[100%] animate-[drift_40s_infinite_ease-in-out] opacity-40"
        ></div>
        
        {/* Rolling Low Fog */}
        <div className="absolute bottom-0 left-0 w-[200%] h-[30%] opacity-20 filter blur-[20px] mix-blend-screen animate-[rolling-fog_60s_linear_infinite]">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        </div>

        {/* Dense localized patches for Consonant Cove */}
        {isConsonantCove && (
          <>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/10 to-transparent blur-[60px] opacity-60"></div>
            <div className="absolute top-1/4 -right-1/4 w-[160%] h-[120%] bg-white/10 blur-[150px] rounded-[100%] animate-[drift_35s_infinite_ease-in-out_reverse] opacity-30"></div>
          </>
        )}

        {/* Crystal Shard Particles */}
        <div className="absolute inset-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute bg-primary/40 rounded-full blur-[1px] animate-[float-particle_infinite_linear]"
              style={{
                left: p.left,
                bottom: p.bottom,
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
                boxShadow: '0 0 10px #0ddff2',
              }}
            />
          ))}
        </div>
      </div>

      {/* Guardian */}
      <div className={`absolute top-1/4 right-[-10%] w-3/4 aspect-square flex flex-col items-center justify-center transition-all duration-500 ${animationState === 'taking-damage' ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="relative w-full h-full bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url(${currentChapter.guardian.image})`, filter: `drop-shadow(0 0 40px ${guardianColor}66)` }}>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 flex flex-col gap-1 items-center">
            <div className="w-full h-3 bg-black/60 rounded-full border border-white/20 p-0.5 overflow-hidden">
              <div className="h-full bg-damage-red rounded-full transition-all duration-500" style={{ width: `${(gameState.enemyHP / currentChapter.guardian.baseHealth) * 100}%` }}></div>
            </div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{currentChapter.guardian.name}</p>
          </div>
        </div>
      </div>

      {/* Front Layer Fog (Parallax feeling) */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[120%] h-1/3 bg-white/5 blur-[60px] rounded-[100%] pointer-events-none mix-blend-overlay animate-[drift_20s_infinite_ease-in-out]"></div>

      {/* Player Avatar */}
      <div className={`absolute bottom-[15%] left-[-5%] w-1/2 aspect-square z-10 transition-transform duration-300 ${animationState === 'attacking' ? 'translate-x-12 -translate-y-4' : ''}`}>
        <div className="w-full h-full bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url(${ASSETS.hero})`, filter: 'drop-shadow(0 0 20px rgba(13, 223, 242, 0.3))' }}></div>
      </div>

      {/* Active Pet Companion */}
      {activePet && (
        <div className="absolute bottom-[25%] left-[30%] z-20 animate-[bounce_2s_infinite]">
          <div className="relative">
            <div className="absolute -inset-2 bg-primary/20 blur-lg rounded-full animate-pulse"></div>
            <div className="relative text-4xl filter drop-shadow-[0_0_10px_#0ddff2]">
              {activePet.icon}
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-primary uppercase tracking-widest whitespace-nowrap bg-background-dark/80 px-2 py-0.5 rounded border border-primary/20">
              {activePet.name}
            </div>
          </div>
        </div>
      )}

      {/* Damage Feedback */}
      {gameState.lastDamage !== null && (
        <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
            <div className={`bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 animate-bounce shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>
                <p className={`text-2xl font-bold tracking-widest leading-normal ${gameState.isCritical ? 'text-primary' : 'text-white'}`}>
                    {gameState.isCritical && 'CRITICAL! '}-{gameState.lastDamage} DMG
                </p>
            </div>
        </div>
      )}
    </div>
  );
};

export default Arena;