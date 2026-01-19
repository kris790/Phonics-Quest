
import React from 'react';
import { ProgressionState } from '../types';

interface ParentDashboardProps {
  progression: ProgressionState;
  onClose: () => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ progression, onClose }) => {
  const accuracyArray = Object.values(progression.accuracyData);
  const totalAttempts = accuracyArray.reduce((sum, d) => sum + d.attempts, 0);
  const totalCorrect = accuracyArray.reduce((sum, d) => sum + d.correct, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <div className="absolute inset-0 z-[100] bg-background-dark p-6 flex flex-col animate-fadeIn overflow-y-auto pb-24 custom-scrollbar">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Parent Portal</h1>
          <p className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">Educational Progress Ledger</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/40">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Overall Accuracy</p>
          <p className="text-3xl font-black text-primary italic">{overallAccuracy}%</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Total Words Solved</p>
          <p className="text-3xl font-black text-white italic">{totalCorrect}</p>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-white font-black uppercase text-xs tracking-[0.4em]">Digraph Mastery</h2>
          <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>

        <div className="space-y-4">
          {accuracyArray.length > 0 ? accuracyArray.sort((a,b) => (b.correct/b.attempts) - (a.correct/a.attempts)).map((data) => {
            const accuracy = Math.round((data.correct / data.attempts) * 100);
            return (
              <div key={data.digraph} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-white italic tracking-widest">{data.digraph.toUpperCase()}</span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{data.correct}/{data.attempts} Correct</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <div className="w-24 h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${accuracy}%` }}></div>
                   </div>
                   <span className="text-[10px] font-black text-primary">{accuracy}%</span>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-white/20 text-xs italic">No battle data recorded yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-10 space-y-4">
         <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
            <h3 className="text-primary font-black uppercase text-[10px] tracking-widest mb-2">Learning Insights</h3>
            <p className="text-xs text-white/70 italic leading-relaxed">
              Caelum is currently focusing on <span className="text-white font-bold">"{accuracyArray[0]?.digraph || 'Sh'}"</span> sounds. 
              Combat performance suggests they respond best to visual digraph hints. 
              The most challenging sound recently was <span className="text-white font-bold">"{accuracyArray[accuracyArray.length-1]?.digraph || 'Ph'}"</span>.
            </p>
         </div>
      </section>

      <button onClick={onClose} className="mt-12 w-full py-5 border border-white/10 text-white/60 font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/5 transition-all">
        Back to Sanctuary
      </button>
    </div>
  );
};

export default ParentDashboard;
