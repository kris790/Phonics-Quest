
import React from 'react';
import { VoiceStatus } from '../hooks/useVoiceSession';

interface VoiceGateProps {
  status: VoiceStatus;
  onRetry: () => void;
  onTapMode: () => void;
}

const VoiceGate: React.FC<VoiceGateProps> = ({ status, onRetry, onTapMode }) => {
  if (status === 'idle' || status === 'listening') return null;

  const messages = {
    denied: {
      title: "Microphone Silent",
      desc: "Access was denied. Tap the spell letters instead!",
      icon: "mic_off",
      btn: "Switch to Tap Mode",
      color: "border-orange-500 text-orange-500 bg-orange-500/10"
    },
    timeout: {
      title: "Echo Faded",
      desc: "Didn't hear that clearly. Try again or tap to continue.",
      icon: "timer_off",
      btn: "Try Speaking Again",
      color: "border-primary text-primary bg-primary/10"
    },
    error: {
      title: "Resonance Break",
      desc: "Voice magic is unstable right now. Use your fingers!",
      icon: "heart_broken",
      btn: "Tap Mode",
      color: "border-damage-red text-damage-red bg-damage-red/10"
    }
  };

  const config = messages[status as keyof typeof messages] || messages.error;

  return (
    <div className={`mt-4 p-4 rounded-xl border-2 backdrop-blur-md animate-fadeIn ${config.color}`}>
      <div className="flex items-start gap-4">
        <span className="material-symbols-outlined text-3xl">{config.icon}</span>
        <div className="flex-1">
          <h4 className="font-black uppercase tracking-tighter">{config.title}</h4>
          <p className="text-[10px] font-medium leading-relaxed opacity-80">{config.desc}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button 
          onClick={onRetry} 
          className="flex-1 py-2 rounded-lg bg-white/10 font-black uppercase text-[10px] tracking-widest hover:bg-white/20"
        >
          Retry Voice
        </button>
        <button 
          onClick={onTapMode} 
          className="flex-1 py-2 rounded-lg bg-current text-background-dark font-black uppercase text-[10px] tracking-widest brightness-110"
        >
          {config.btn}
        </button>
      </div>
    </div>
  );
};

export default VoiceGate;
