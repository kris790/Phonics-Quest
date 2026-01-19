
let globalAudioContext: AudioContext | null = null;

/**
 * Ensures a single AudioContext is used across the app.
 * Fixed for iOS Safari: Contexts created outside of user gestures start suspended.
 */
export function getAudioContext(): AudioContext {
  if (!globalAudioContext) {
    globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ 
      sampleRate: 24000 
    });
  }
  return globalAudioContext;
}

/**
 * Critical for iOS: Call this on every 'click' or 'touchstart' event.
 */
export async function resumeAudioContext() {
  const ctx = getAudioContext();
  // Fix: TypeScript error regarding union overlap. Cast to any to safely check platform-specific states.
  if ((ctx.state as any) === 'suspended' || (ctx.state as any) === 'interrupted') {
    try {
      await ctx.resume();
      console.log("AudioContext resumed successfully.");
    } catch (err) {
      console.warn("Failed to resume AudioContext:", err);
    }
  }
}

export function decodeBase64(base64: string): Uint8Array {
  try {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    console.error("Base64 decoding failed:", e);
    return new Uint8Array(0);
  }
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export async function playTTS(base64Audio: string) {
  try {
    const ctx = getAudioContext();
    // Re-verify context is active before play
    await resumeAudioContext();
    
    const rawData = decodeBase64(base64Audio);
    if (rawData.length === 0) return;

    const audioBuffer = await decodeAudioData(rawData, ctx, 24000, 1);
    
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();
  } catch (err) {
    console.warn("TTS Playback failed:", err);
  }
}
