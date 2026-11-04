/**
 * Web Audio API Engine for Motion Mobile
 * Handles multitrack playback, synthesizers, filters, EQ, and microphone recording
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private activeNodes: Map<string, { osc?: OscillatorNode; source?: AudioBufferSourceNode; gain: GainNode }> = new Map();
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playSynthesizedTrack(trackId: string, trackType: string, volume: number = 0.8) {
    try {
      const ctx = this.initContext();
      this.stopTrack(trackId);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.connect(ctx.destination);

      if (trackType.includes('future-bass') || trackType.includes('beat')) {
        // Synthesize an energetic rhythmic bass pattern
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.3);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        osc.start();

        this.activeNodes.set(trackId, { osc, gain });
      } else if (trackType.includes('whoosh') || trackType.includes('sfx')) {
        // Synthesize a white-noise whoosh sweep
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.7);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.4);

        noise.connect(filter);
        filter.connect(gain);
        noise.start();

        this.activeNodes.set(trackId, { source: noise, gain });
      } else {
        // Standard gentle synthesizer tone
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.connect(gain);
        osc.start();
        this.activeNodes.set(trackId, { osc, gain });
      }
    } catch (e) {
      console.warn('AudioEngine play error:', e);
    }
  }

  public stopTrack(trackId: string) {
    const node = this.activeNodes.get(trackId);
    if (node) {
      try {
        if (node.osc) node.osc.stop();
        if (node.source) node.source.stop();
        node.gain.disconnect();
      } catch {
        // Ignore if already stopped
      }
      this.activeNodes.delete(trackId);
    }
  }

  public stopAll() {
    this.activeNodes.forEach((_, id) => this.stopTrack(id));
    this.isPlaying = false;
  }

  // Generate simulated waveform data points for audio tracks
  public generateWaveform(samples: number = 40): number[] {
    const waveform: number[] = [];
    for (let i = 0; i < samples; i++) {
      const val = 0.2 + Math.abs(Math.sin(i * 0.4) * 0.5 + (Math.random() * 0.3));
      waveform.push(Math.min(1.0, val));
    }
    return waveform;
  }

  // Voice recording support
  public async startRecording(): Promise<boolean> {
    try {
      this.recordedChunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };
      this.mediaRecorder.start();
      return true;
    } catch (err) {
      console.warn('Microphone permission not granted or unavailable:', err);
      return false;
    }
  }

  public stopRecording(): Promise<{ url: string; duration: number } | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null);
        return;
      }
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        resolve({
          url: audioUrl,
          duration: 3.5 // typical estimate or duration
        });
      };
      this.mediaRecorder.stop();
      // stop tracks
      this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
    });
  }
}

export const audioEngine = new AudioEngine();
