
import React, { useEffect, useRef, useState } from 'react';
import { AppState, BattlePhase, Chapter } from '../types';
import { AUDIO_TRACKS } from '../constants';

interface AudioEngineProps {
  view: AppState;
  battlePhase: BattlePhase;
  isMuted: boolean;
  currentChapterId: string;
  chapters: Chapter[];
}

const FADE_DURATION = 1500; // ms
const MAX_VOLUME = 0.4;

const AudioEngine: React.FC<AudioEngineProps> = ({ view, battlePhase, isMuted, currentChapterId, chapters }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const [currentTrack, setCurrentTrack] = useState<string>('');

  useEffect(() => {
    let targetTrack = AUDIO_TRACKS.map;

    if (view === 'battle') {
      if (battlePhase === 'victory') targetTrack = AUDIO_TRACKS.victory;
      else if (battlePhase === 'defeat') targetTrack = AUDIO_TRACKS.defeat;
      else targetTrack = AUDIO_TRACKS.battle;
    } else if (view === 'world-map') {
      const chapter = chapters.find(c => c.id === currentChapterId);
      if (chapter && chapter.ambientAudio) {
        targetTrack = chapter.ambientAudio;
      }
    } else {
      targetTrack = AUDIO_TRACKS.map;
    }

    if (targetTrack && targetTrack !== currentTrack) {
      transitionTo(targetTrack);
      setCurrentTrack(targetTrack);
    }
  }, [view, battlePhase, currentChapterId, chapters, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const transitionTo = (url: string) => {
    if (!url) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const nextAudio = new Audio(url);
    nextAudio.loop = true;
    nextAudio.volume = 0;
    nextAudio.muted = isMuted;
    nextAudioRef.current = nextAudio;

    const startTransition = () => {
      nextAudio.play().catch(e => {
        // Silently catch autoplay errors, common in mobile browsers
      });
      
      const step = 0.05;
      const intervalTime = FADE_DURATION * step;
      
      fadeIntervalRef.current = window.setInterval(() => {
        let finished = true;

        if (audioRef.current) {
          audioRef.current.volume = Math.max(0, audioRef.current.volume - step);
          if (audioRef.current.volume > 0) finished = false;
        }

        if (nextAudioRef.current) {
          nextAudioRef.current.volume = Math.min(MAX_VOLUME, nextAudioRef.current.volume + step);
          if (nextAudioRef.current.volume < MAX_VOLUME) finished = false;
        }

        if (finished) {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.remove();
          }
          audioRef.current = nextAudioRef.current;
          nextAudioRef.current = null;
        }
      }, intervalTime);
    };

    startTransition();
  };

  return null;
};

export default AudioEngine;
