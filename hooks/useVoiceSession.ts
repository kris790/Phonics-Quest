
import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { encode } from '../utils/audioUtils';

export type VoiceStatus = 'idle' | 'listening' | 'denied' | 'timeout' | 'error';

export const useVoiceSession = (
  apiKey: string, 
  targetDigraph: string | undefined, 
  timeoutMs: number,
  onMatch: (digraph: string) => void
) => {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  /* Fix: Use a ref to track status to avoid stale closures and narrowing issues in async callbacks like setTimeout or onclose */
  const statusRef = useRef<VoiceStatus>('idle');

  /* Fix: Helper to update both state and ref in sync */
  const setVoiceStatus = useCallback((newStatus: VoiceStatus) => {
    statusRef.current = newStatus;
    setStatus(newStatus);
  }, []);

  const sessionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    sessionRef.current = null;
    /* Fix: use helper function */
    setVoiceStatus('idle');
  }, [setVoiceStatus]);

  const start = useCallback(async () => {
    if (status === 'listening' || !targetDigraph) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      /* Fix: use helper function */
      setVoiceStatus('listening');

      const ai = new GoogleGenAI({ apiKey });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioCtxRef.current = inputCtx;

      const createBlob = (data: Float32Array) => {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
          int16[i] = data[i] * 32768;
        }
        return {
          data: encode(new Uint8Array(int16.buffer)),
          mimeType: 'audio/pcm;rate=16000',
        };
      };

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: { 
          responseModalities: [Modality.AUDIO], 
          inputAudioTranscription: {}, 
          systemInstruction: `Listen for the digraph "${targetDigraph}". If detected, trigger completion.` 
        },
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const text = msg.serverContent?.inputTranscription?.text?.toLowerCase() || "";
            if (text.includes(targetDigraph.toLowerCase())) {
               onMatch(targetDigraph);
               stop();
            }
          },
          onerror: () => { 
            /* Fix: use helper function */
            setVoiceStatus('error');
            stop();
          },
          onclose: () => {
             /* Fix: Check ref current value to avoid stale closure issue and avoid type narrowing error */
             if (statusRef.current === 'listening') setVoiceStatus('idle');
          }
        }
      });
      sessionRef.current = sessionPromise;

      timeoutRef.current = window.setTimeout(() => {
        /* Fix: Check ref current value to avoid stale closure issue and avoid type narrowing error */
        if (statusRef.current === 'listening') {
          setVoiceStatus('timeout');
          stop();
        }
      }, timeoutMs);

    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        /* Fix: use helper function */
        setVoiceStatus('denied');
      } else {
        /* Fix: use helper function */
        setVoiceStatus('error');
      }
      console.error("Voice initialization failed:", err);
    }
  }, [apiKey, targetDigraph, timeoutMs, onMatch, status, stop, setVoiceStatus]);

  // Auto-stop on digraph change
  useEffect(() => {
    return () => stop();
  }, [targetDigraph, stop]);

  return { status, start, stop };
};
