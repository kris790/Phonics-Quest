
import React from 'react';
import { GameState, AnimationState } from '../types';
import { ASSETS, CHAPTERS } from '../constants';

interface ArenaProps {
  gameState: GameState;
  animationState: AnimationState;
}

const Arena: React.FC<ArenaProps> = ({ gameState, animationState }) => {
  const isShaking = animationState === 'hit-shake' || animationState === 'taking-damage';
  
  // Find the current guardian data for visual flair
  const currentChapter = CHAPTERS.find(c => c.guardian.name === gameState.feedback.split(' ')[0]) || CHAPTERS[0];
  const guardianColor = currentChapter.guardian.accentColor;

  return (
    <div className={`absolute inset-0 z-0 transition-transform duration-100 ${isShaking ? 'shake-active' : ''}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-center bg-cover transition-all duration-1000" 
        style={{ backgroundImage: `url(${currentChapter.background})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/60 via-transparent to-transparent"></div>
      </div>

      {/* The Guardian (Enemy) */}
      <div className={`absolute top-1/4 right-[-10%] w-3/4 aspect-square flex flex-col items-center justify-center transition-all duration-500 ${animationState === 'taking-damage' ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <div 
          className="relative w-full h-full bg-center bg-contain bg-no-repeat transition-all duration-500" 
          style={{ 
            backgroundImage: `url(${currentChapter.guardian.image})`,
            filter: `drop-shadow(0 0 30px ${guardianColor}44)` 
          }}
        >
          {/* Enemy Health Bar */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 flex flex-col gap-1 items-center">
            <div className="w-full h-3 bg-black/60 rounded-full border border-white/20 p-0.5 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ 
                  width: `${(gameState.enemyHP / currentChapter.guardian.baseHealth) * 100}%`,
                  backgroundColor: gameState.enemyHP < (currentChapter.guardian.baseHealth * 0.3) ? '#ef4444' : '#fa5c38'
                }}
              ></div>
            </div>
            <span className="text-[10px] font-bold text-white tracking-[0.2em] uppercase bg-black/40 px-2 py-0.5 rounded shadow-sm">
                {currentChapter.guardian.name} • Lv {10 + gameState.level}
            </span>
          </div>
        </div>
      </div>

      {/* Player Avatar */}
      <div className={`absolute bottom-[15%] left-[-5%] w-1/2 aspect-square z-10 transition-transform duration-300 ${animationState === 'attacking' ? 'translate-x-12 -translate-y-4' : ''}`}>
        <div 
          className="w-full h-full bg-center bg-contain bg-no-repeat drop-shadow-[0_0_20px_#0ddff244]" 
          style={{ backgroundImage: `url(${ASSETS.hero})` }}
        ></div>
      </div>

      {/* Magical Projectile (Spell Casting) */}
      {animationState === 'attacking' && (
        <div className="absolute bottom-[35%] left-[25%] right-[20%] top-[30%] pointer-events-none z-10">
          <div className="absolute w-full h-20 rotate-[-15deg] flex items-center animate-[pulse_0.2s_infinite]">
            <div className="projectile-path w-full relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full blur-xl opacity-80"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_#fff]"></div>
              <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-primary/20 backdrop-blur-sm border border-primary/50 text-primary font-bold text-xl px-2 py-1 rounded-lg">
                {gameState.currentQuestion?.correctDigraph.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Damage Feedback */}
      {gameState.lastDamage !== null && (
        <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
          <div className="animate-bounce flex flex-col items-center">
            {gameState.isCritical && (
                <h1 className="text-white tracking-tighter text-[40px] font-bold leading-tight px-4 text-center italic drop-shadow-[0_0_15px_#0ddff2]">
                    CRITICAL HIT!
                </h1>
            )}
            <div className={`mt-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20`}>
                <p className={`text-2xl font-bold tracking-widest leading-normal ${gameState.isCritical ? 'text-primary' : 'text-white'}`}>
                    -{gameState.lastDamage} DMG
                </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Arena;
