
import React, { useState, useEffect, useRef } from 'react';
import { BattleRewards, ProgressionState, LootItem, Artifact } from '../../types';
import { generateArtifactImage, generateRestorationVideo } from '../../services/geminiService';

interface VictoryScreenProps {
  chapterName: string;
  guardianName: string;
  rewards: BattleRewards;
  progression: ProgressionState;
  onComplete: (artifact?: Artifact) => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ 
  chapterName,
  guardianName, 
  rewards, 
  progression,
  onComplete 
}) => {
  const [phase, setPhase] = useState<'intro' | 'rewards' | 'vision' | 'artifact'>('intro');
  const [displayXP, setDisplayXP] = useState(0);
  const [displayCrystals, setDisplayCrystals] = useState(0);
  const [visibleLootCount, setVisibleLootCount] = useState(0);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [barProgress, setBarProgress] = useState((progression.xp / progression.maxXp) * 100);
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoadingVision, setIsLoadingVision] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  
  const loadingMessages = [
    "Weaving the echoes of restoration...",
    "Calibrating resonance frequencies...",
    "Cleansing the island's voice...",
    "Visualizing the Great Awakening...",
    "Stabilizing the Syllable Matrix..."
  ];

  useEffect(() => {
    if (phase === 'rewards') {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      let step = 0;
      const totalXpToAdd = rewards.xp;
      const totalCrystalsToAdd = rewards.crystals;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setDisplayXP(Math.floor(totalXpToAdd * progress));
        setDisplayCrystals(Math.floor(totalCrystalsToAdd * progress));

        let simulatedXp = progression.xp + Math.floor(totalXpToAdd * progress);
        if (simulatedXp >= progression.maxXp) {
          setIsLevelingUp(true);
          setBarProgress(100);
        } else {
          setBarProgress((simulatedXp / progression.maxXp) * 100);
        }

        if (step >= steps) {
          clearInterval(timer);
          if (rewards.loot?.length) {
            let lootIdx = 0;
            const lootTimer = setInterval(() => {
              lootIdx++;
              setVisibleLootCount(lootIdx);
              if (lootIdx >= rewards.loot!.length) clearInterval(lootTimer);
            }, 400);
          }
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [phase, rewards, progression]);

  const handleStartVision = async () => {
    if (!window.aistudio || !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
    }
    
    setIsLoadingVision(true);
    setPhase('vision');
    
    const msgInterval = setInterval(() => {
      setLoadingMsg(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }, 4000);
    setLoadingMsg(loadingMessages[0]);

    try {
      const [art, vid] = await Promise.all([
        generateArtifactImage(chapterName, guardianName),
        generateRestorationVideo(chapterName)
      ]);
      setArtifact(art);
      setVideoUrl(vid);
    } catch (e) {
      console.error("Cinematic generation failed", e);
    } finally {
      clearInterval(msgInterval);
      setIsLoadingVision(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background-dark/95 backdrop-blur-2xl p-6 overflow-hidden">
      {phase === 'intro' && (
        <div className="animate-fadeIn flex flex-col items-center gap-8">
          <div className="relative">
            <span className="material-symbols-outlined text-[160px] text-primary drop-shadow-[0_0_50px_rgba(13,223,242,0.8)] animate-bounce">
              trophy
            </span>
          </div>
          <div className="space-y-3 text-center">
            <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_0_25px_#0ddff2]">Victory</h2>
            <p className="text-primary font-black uppercase tracking-[0.5em] text-[12px] opacity-80">{guardianName} Restored</p>
          </div>
          <button onClick={() => setPhase('rewards')} className="px-12 py-5 bg-primary text-background-dark rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(13,223,242,0.5)] active:scale-95 transition-all">
            Examine Echoes
          </button>
        </div>
      )}

      {phase === 'rewards' && (
        <div className="w-full max-w-sm space-y-6 animate-fadeIn">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
             <div className="flex justify-between items-end">
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Combat Experience</span>
               <span className="text-primary font-black text-2xl tracking-tighter">+{displayXP} XP</span>
             </div>
             <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-1">
               <div className="h-full bg-primary rounded-full shadow-[0_0_15px_#0ddff2]" style={{ width: `${barProgress}%` }}></div>
             </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">diamond</span>
              <div>
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Crystals</p>
                <p className="text-2xl font-black text-white">+{displayCrystals}</p>
              </div>
            </div>
            <button 
              onClick={handleStartVision}
              className="bg-amber-400 text-background-dark px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.5)]"
            >
              Watch Vision
            </button>
          </div>

          <button onClick={() => onComplete()} className="w-full py-5 bg-white/10 border border-white/20 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-sm hover:bg-white/20 transition-all">
            Skip to World
          </button>
        </div>
      )}

      {phase === 'vision' && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-8">
          {isLoadingVision ? (
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-primary font-black uppercase tracking-[0.3em] text-xs text-center animate-pulse max-w-[200px]">{loadingMsg}</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col gap-6">
              <div className="relative flex-1 bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <video src={videoUrl || ""} autoPlay loop className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">The Restoration of {chapterName}</h3>
                  <p className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">Restoration Fragment • LV {progression.restorationLevel + 1}</p>
                </div>
              </div>
              <button 
                onClick={() => artifact ? setPhase('artifact') : onComplete()}
                className="py-5 bg-primary text-background-dark font-black uppercase tracking-widest text-sm rounded-2xl shadow-2xl"
              >
                Claim Relic
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'artifact' && artifact && (
        <div className="animate-fadeIn flex flex-col items-center gap-8 text-center max-w-sm">
           <div className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-2">Weaver's Forge Result</div>
           <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
              <div className="relative w-72 h-72 rounded-3xl border-4 border-primary/40 p-2 bg-background-dark overflow-hidden shadow-[0_0_50px_rgba(13,223,242,0.3)]">
                 <img src={artifact.imageUrl} className="w-full h-full object-cover rounded-2xl" alt={artifact.name} />
              </div>
           </div>
           <div className="space-y-3">
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{artifact.name}</h2>
              <p className="text-white/60 text-xs italic leading-relaxed">"{artifact.description}"</p>
           </div>
           <button onClick={() => onComplete(artifact)} className="w-full py-5 bg-primary text-background-dark rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_30px_#0ddff2]">
             Seal the Echo
           </button>
        </div>
      )}
    </div>
  );
};

export default VictoryScreen;
