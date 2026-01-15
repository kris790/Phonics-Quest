
import React from 'react';

interface DefeatScreenProps {
  guardianName: string;
  tasksCompleted: number;
  totalTasks: number;
  comboStreak: number;
  onRetry: () => void;
  onReturnToMap: () => void;
  onUseRevive?: () => void;
}

const DefeatScreen: React.FC<DefeatScreenProps> = ({
  guardianName,
  tasksCompleted,
  totalTasks,
  comboStreak,
  onRetry,
  onReturnToMap
}) => {
  const progressPercentage = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;

  return (
    <div className="absolute inset-0 z-[100] bg-gradient-to-b from-red-950/60 via-background-dark/95 to-background-dark flex flex-col items-center justify-center p-8 animate-fadeIn">
      <div className="relative mb-10">
        <span className="material-symbols-outlined text-8xl text-damage-red animate-pulse drop-shadow-[0_0_20px_#fa5c38]">skull</span>
        <div className="absolute inset-0 bg-damage-red/20 blur-2xl rounded-full"></div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-5xl font-black text-white mb-2 uppercase tracking-tighter italic drop-shadow-lg">FALTERED</h1>
        <div className="text-white/60 text-sm font-medium italic tracking-wide">
          The resonance of {guardianName} overwhelmed you...
        </div>
      </div>

      <div className="w-full max-w-md bg-white/5 rounded-3xl p-8 mb-10 border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="text-center font-black text-white/40 text-[10px] uppercase tracking-[0.5em] mb-6">BATTLE SUMMARY</div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-2">
              <span className="text-white/40 italic">Expedition Progress</span>
              <span className="text-white">{tasksCompleted} / {totalTasks} Words</span>
            </div>
            <div className="h-3 bg-black/60 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-damage-red to-orange-600 transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 rounded-2xl p-4 text-center border border-white/5">
              <span className="material-symbols-outlined text-primary text-xl mb-1">bolt</span>
              <div className="text-2xl font-black text-white leading-none">{comboStreak}</div>
              <div className="text-[9px] text-white/40 uppercase font-black mt-1">Best Streak</div>
            </div>
            
            <div className="bg-black/40 rounded-2xl p-4 text-center border border-white/5">
              <span className="material-symbols-outlined text-damage-red text-xl mb-1">track_changes</span>
              <div className="text-2xl font-black text-white leading-none">
                {totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0}%
              </div>
              <div className="text-[9px] text-white/40 uppercase font-black mt-1">Completion</div>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-white/10">
            <p className="text-white/50 text-xs italic leading-relaxed px-4">
              {progressPercentage >= 80 
                ? "So close to the awakening! Just a breath away from victory."
                : progressPercentage >= 50
                ? "The echoes are growing clearer. Refocus your energy and try again."
                : "Every silence is followed by a stronger voice. Keep weaving."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={onRetry}
          className="bg-damage-red text-white font-black py-5 px-8 rounded-2xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-sm shadow-[0_10px_20px_-5px_rgba(250,92,56,0.4)]"
        >
          RESTORE ESSENCE
        </button>

        <button
          onClick={onReturnToMap}
          className="bg-white/5 text-white/60 font-black py-4 px-8 rounded-2xl hover:bg-white/10 active:scale-95 transition-all uppercase tracking-widest text-[11px] border border-white/10"
        >
          RETREAT TO WORLD MAP
        </button>
      </div>
    </div>
  );
};

export default DefeatScreen;
