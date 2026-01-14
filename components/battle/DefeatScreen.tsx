
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
  onReturnToMap,
  onUseRevive
}) => {
  const progressPercentage = (tasksCompleted / totalTasks) * 100;

  return (
    <div className="absolute inset-0 z-[100] bg-gradient-to-b from-red-900/40 via-background-dark/90 to-background-dark flex flex-col items-center justify-center p-6">
      <div className="relative mb-8 animate-[bounce_2s_infinite]">
        <div className="text-6xl mb-2">💀</div>
        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 animate-pulse uppercase tracking-tighter italic">DEFEATED</h1>
        <div className="text-white/80 text-lg italic">
          {guardianName} was too strong...
        </div>
        <div className="text-red-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
          Find your voice again, Weaver
        </div>
      </div>

      <div className="w-full max-w-md bg-black/40 rounded-2xl p-6 mb-8 border border-white/10 backdrop-blur-md">
        <div className="text-center font-black text-white text-[10px] uppercase tracking-[0.4em] mb-4">BATTLE ANALYSIS</div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
              <div className="text-white/40">Island Progress</div>
              <div className="text-white">{tasksCompleted}/{totalTasks}</div>
            </div>
            <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/60 rounded-xl p-3 text-center border border-white/5">
              <div className="text-lg mb-1">🔥</div>
              <div className="text-xl font-bold text-white">{comboStreak}</div>
              <div className="text-[10px] text-white/40 uppercase font-black">Best Streak</div>
            </div>
            
            <div className="bg-black/60 rounded-xl p-3 text-center border border-white/5">
              <div className="text-lg mb-1">🎯</div>
              <div className="text-xl font-bold text-white">
                {totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0}%
              </div>
              <div className="text-[10px] text-white/40 uppercase font-black">Accuracy</div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-white/10">
            <div className="text-white/60 text-xs italic leading-relaxed">
              {progressPercentage >= 70 
                ? "You were so close! Just a little more resonance."
                : progressPercentage >= 50
                ? "Good effort! Review the vowel echoes and try again."
                : "Every attempt makes you stronger. Keep breathing life into words."}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-md">
        <button
          onClick={onRetry}
          className="bg-gradient-to-r from-primary to-blue-600 text-background-dark font-black py-4 px-6 rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest text-sm"
        >
          RESTORE ESSENCE
        </button>

        <button
          onClick={onReturnToMap}
          className="bg-white/10 text-white font-black py-3 px-6 rounded-xl hover:bg-white/20 active:scale-95 transition-all uppercase tracking-widest text-[10px] border border-white/10"
        >
          RETREAT TO MAP
        </button>
      </div>
    </div>
  );
};

export default DefeatScreen;
