
import React from 'react';

interface COPPALiveDisclaimerProps {
  onDismiss: () => void;
}

const COPPALiveDisclaimer: React.FC<COPPALiveDisclaimerProps> = ({ onDismiss }) => {
  return (
    <div className="fixed bottom-20 left-6 right-6 z-[60] bg-background-dark/90 border border-white/10 rounded-2xl p-4 backdrop-blur-xl shadow-2xl animate-fadeIn">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-xl">security</span>
        <div className="flex-1">
          <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Privacy of the Echo</h5>
          <p className="text-[9px] text-white/50 italic leading-snug mt-1">
            Voice magic is processed live and never stored. We protect your resonance. No recording, purely real-time.
          </p>
        </div>
        <button onClick={onDismiss} className="text-white/20 hover:text-white">
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
};

export default COPPALiveDisclaimer;
