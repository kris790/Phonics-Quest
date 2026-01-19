
import React, { useState } from 'react';

interface TutorialStep {
  title: string;
  content: string;
  icon: string;
}

interface TutorialOverlayProps {
  onComplete: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps: TutorialStep[] = [
    {
      title: "Welcome, Weaver!",
      content: "The Phonics Kingdom has fallen silent. You are the only one who can restore the music of our words.",
      icon: "auto_awesome"
    },
    {
      title: "Spell Casting",
      content: "Complete words by choosing the correct digraph. Each correct spell strikes the Shadow Guardian!",
      icon: "bolt"
    },
    {
      title: "Resonance Combo",
      content: "Answering correctly builds your Resonance Streak. High streaks deal massive damage and unlock epic bonuses.",
      icon: "temp_high"
    },
    {
      title: "Voice Power",
      content: "Tap the microphone icon to cast spells with your own voice. The Kingdom resonates with your true sound.",
      icon: "mic"
    },
    {
      title: "Crystal Restoration",
      content: "Defeat guardians to restore the islands. Collect unique AI Artifacts to decorate your Hero's Room.",
      icon: "diamond"
    }
  ];

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[200] bg-background-dark/95 backdrop-blur-md flex items-center justify-center p-8 animate-fadeIn">
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-8">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/40 animate-pulse">
           <span className="material-symbols-outlined text-primary text-5xl">{current.icon}</span>
        </div>
        <div className="space-y-4">
           <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{current.title}</h2>
           <p className="text-white/70 text-sm leading-relaxed italic px-4">"{current.content}"</p>
        </div>
        
        <div className="flex gap-2 mb-4">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 transition-all rounded-full ${i === step ? 'w-8 bg-primary shadow-[0_0_10px_#0ddff2]' : 'w-2 bg-white/10'}`}></div>
          ))}
        </div>

        <button 
          onClick={next}
          className="w-full py-5 bg-primary text-background-dark rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_30px_#0ddff2] active:scale-95 transition-all"
        >
          {step === steps.length - 1 ? "Begin the Quest" : "Continue Calibration"}
        </button>
      </div>
    </div>
  );
};

export default TutorialOverlay;
