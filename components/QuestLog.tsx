
import React from 'react';
import { RootState, Quest } from '../types';

interface QuestLogProps {
  quests: RootState['quests'];
  onClaimQuestReward: (questId: string) => void;
}

const QuestLog: React.FC<QuestLogProps> = ({ quests, onClaimQuestReward }) => {
  return (
    <div className="absolute inset-0 z-40 bg-background-dark p-6 overflow-y-auto pb-32">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">Quest Log</h1>
        <p className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">Guardian's Trials</p>
      </header>

      <section className="space-y-4">
        {quests.activeQuests.map((quest) => {
          const progress = Math.min(100, (quest.progress / quest.target) * 100);
          const isClaimable = quest.progress >= quest.target && !quest.isComplete;

          return (
            <div 
              key={quest.id} 
              className={`bg-white/5 border rounded-2xl p-5 transition-all ${quest.isComplete ? 'border-white/5 opacity-50 grayscale' : 'border-white/10 opacity-100'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-black text-white uppercase italic tracking-tight">{quest.title}</h3>
                  <p className="text-xs text-white/60 italic leading-snug">{quest.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{quest.rewardXp} XP</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase">
                  <span>Progress</span>
                  <span>{quest.progress} / {quest.target}</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-primary shadow-[0_0_8px_#0ddff2] transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {isClaimable && (
                <button 
                  onClick={() => onClaimQuestReward(quest.id)}
                  className="mt-4 w-full py-2 bg-primary text-background-dark font-black rounded-lg text-[10px] uppercase tracking-widest shadow-[0_0_15px_#0ddff2]"
                >
                  Claim Reward
                </button>
              )}
              {quest.isComplete && (
                <div className="mt-3 text-center">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Completed</span>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {quests.activeQuests.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
          <p className="text-white/20 italic font-bold">The archives are quiet. No current trials.</p>
        </div>
      )}
    </div>
  );
};

export default QuestLog;
