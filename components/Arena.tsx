
import React from 'react';
import { GameState, AnimationState, Pet } from '../types';
import { ASSETS, CHAPTERS } from '../constants';

interface ArenaProps {
  gameState: GameState;
  animationState: AnimationState;
  activePet?: Pet;
}

const Arena: React.FC<ArenaProps> = ({ gameState, animationState, activePet }) => {
  const isShaking = animationState === 'hit-shake' || animationState === 'taking-damage';
  const currentChapter = CHAPTERS.find(c => c.guardian.name === gameState.feedback.split(' ')[0]) || CHAPTERS[0];
  const guardianColor = currentChapter.guardian.accentColor;

  return (
    <div className={`absolute inset-0 z-0 transition-transform duration-100 ${isShaking ? 'shake-active' : ''}`}>
      <div className="absolute inset-0 bg-center bg-cover transition-all duration-1000" style={{ backgroundImage: `url(${currentChapter.background})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
      </div>

      {/* Guardian */}
      <div className={`absolute top-1/4 right-[-10%] w-3/4 aspect-square flex flex-col items-center justify-center transition-all duration-500 ${animationState === 'taking-damage' ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="relative w-full h-full bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url(${currentChapter.guardian.image})`, filter: `drop-shadow(0 0 30px ${guardianColor}44)` }}>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 flex flex-col gap-1 items-center">
            <div className="w-full h-3 bg-black/60 rounded-full border border-white/20 p-0.5 overflow-hidden">
              <div className="h-full bg-damage-red rounded-full transition-all duration-500" style={{ width: `${(gameState.enemyHP / currentChapter.guardian.baseHealth) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Avatar */}
      <div className={`absolute bottom-[15%] left-[-5%] w-1/2 aspect-square z-10 transition-transform duration-300 ${animationState === 'attacking' ? 'translate-x-12 -translate-y-4' : ''}`}>
        <div className="w-full h-full bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url(${ASSETS.hero})` }}></div>
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
            <div className={`bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 animate-bounce`}>
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
