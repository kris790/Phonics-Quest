
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

  const exportCSV = () => {
    const headers = ['Digraph', 'Attempts', 'Correct', 'Accuracy'];
    const rows = accuracyArray.map(d => [
      d.digraph,
      d.attempts,
      d.correct,
      `${Math.round((d.correct / d.attempts) * 100)}%`
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `phonics_quest_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-white font-black uppercase text-xs tracking-[0.4em]">Digraph Mastery</h2>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/20 transition-all"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
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
              {accuracyArray.length > 0 ? (
                <>
                  Your child is showing strong proficiency with <span className="text-white font-bold">"{accuracyArray[0]?.digraph.toUpperCase()}"</span> sounds. 
                  Recent sessions indicate a focus on rhythmic patterns. Consider practicing 
                  <span className="text-white font-bold"> "{accuracyArray[accuracyArray.length-1]?.digraph.toUpperCase()}"</span> words together to bridge current gaps.
                </>
              ) : (
                "Complete more battles to unlock detailed learning insights and patterns."
              )}
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
