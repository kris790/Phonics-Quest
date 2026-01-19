
import React from 'react';
import { GameSettings } from '../types';

interface SettingsPanelProps {
  settings: GameSettings;
  onUpdate: (updates: Partial<GameSettings>) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onClose }) => {
  const voices = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];

  return (
    <div className="absolute inset-0 z-[100] bg-background-dark/95 backdrop-blur-xl p-6 flex flex-col animate-fadeIn">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Weaver Settings</h1>
          <p className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">Resonance Calibration</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/40">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar flex-1">
        <section className="space-y-4">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] block">Crystal Voice (TTS)</label>
          <div className="grid grid-cols-2 gap-3">
            {voices.map(voice => (
              <button
                key={voice}
                onClick={() => onUpdate({ ttsVoice: voice })}
                className={`py-3 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${settings.ttsVoice === voice ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
              >
                {voice}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Echo Listen Timeout</label>
            <span className="text-primary font-black text-xs">{settings.voiceTimeout / 1000}s</span>
          </div>
          <input
            type="range"
            min="3000"
            max="15000"
            step="1000"
            value={settings.voiceTimeout}
            onChange={(e) => onUpdate({ voiceTimeout: parseInt(e.target.value) })}
            className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
             <div>
               <p className="text-sm font-black text-white uppercase italic tracking-tight">Audio Resonance</p>
               <p className="text-[10px] text-white/40 uppercase tracking-widest">Mute all game sounds</p>
             </div>
             <button
              onClick={() => onUpdate({ isMuted: !settings.isMuted })}
              className={`w-14 h-8 rounded-full relative transition-all ${settings.isMuted ? 'bg-red-500/20' : 'bg-primary/20'}`}
             >
               <div className={`absolute top-1 w-6 h-6 rounded-full transition-all ${settings.isMuted ? 'right-1 bg-red-500' : 'left-1 bg-primary shadow-[0_0_10px_#0ddff2]'}`}></div>
             </button>
          </div>

          <div className="h-[1px] bg-white/5"></div>

          <div className="flex justify-between items-center">
             <div>
               <p className="text-sm font-black text-white uppercase italic tracking-tight">Debug Senses</p>
               <p className="text-[10px] text-white/40 uppercase tracking-widest">Enable developer shortcuts</p>
             </div>
             <button
              onClick={() => onUpdate({ debugMode: !settings.debugMode })}
              className={`w-14 h-8 rounded-full relative transition-all ${settings.debugMode ? 'bg-amber-500/20' : 'bg-white/10'}`}
             >
               <div className={`absolute top-1 w-6 h-6 rounded-full transition-all ${settings.debugMode ? 'right-1 bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'left-1 bg-white/20'}`}></div>
             </button>
          </div>
        </section>
      </div>

      <footer className="mt-8">
        <button onClick={onClose} className="w-full py-5 bg-primary text-background-dark font-black uppercase tracking-widest text-sm rounded-2xl shadow-[0_0_30px_#0ddff2]">
          Seal Configuration
        </button>
      </footer>
    </div>
  );
};

export default SettingsPanel;
