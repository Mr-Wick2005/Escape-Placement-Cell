import { Howler } from 'howler';
import type { GameData } from '../store/gameTypes';
import { SOUND_MAP, type SoundName } from './soundMap';

class AudioManager {
  private unlocked = false;
  private audioCtx: AudioContext | null = null;
  private settings: GameData['settings'] = {
    musicVolume: 0.65,
    sfxVolume: 0.7,
    muted: false,
    reducedMotion: false,
    voiceEnabled: true,
    subtitles: true,
  };
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pauseAll();
        } else if (this.unlocked && !this.settings.muted) {
          this.resumeAmbient();
        }
      });
    }
  }

  unlock(settings: GameData['settings']): void {
    this.unlocked = true;
    this.settings = settings;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass && !this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        void this.audioCtx.resume();
      }
    } catch {
      // AudioContext unavailable
    }

    this.applySettings(settings);
    if (!settings.muted && settings.musicVolume > 0) {
      this.startAmbient();
    }
  }

  applySettings(settings: GameData['settings']): void {
    this.settings = settings;
    Howler.mute(settings.muted);
    Howler.volume(settings.muted ? 0 : settings.sfxVolume);

    if (this.ambientGain && this.audioCtx) {
      const targetVol = settings.muted ? 0 : settings.musicVolume * 0.12;
      this.ambientGain.gain.setTargetAtTime(targetVol, this.audioCtx.currentTime, 0.1);
    }
  }

  private startAmbient(): void {
    if (!this.audioCtx || this.ambientOsc || this.settings.muted) return;
    try {
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A1 drone

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      const targetVol = this.settings.muted ? 0 : this.settings.musicVolume * 0.12;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      this.ambientOsc = osc;
      this.ambientGain = gain;
    } catch {
      // Audio synth optional
    }
  }

  private resumeAmbient(): void {
    if (!this.ambientOsc) {
      this.startAmbient();
    }
  }

  play(name: SoundName): void {
    if (!this.unlocked || this.settings.muted || this.settings.sfxVolume <= 0) return;

    // Check if external file mapped
    const customUrl = SOUND_MAP[name];
    if (customUrl) {
      // If external sound exists, Howl can be triggered
      return;
    }

    // High quality procedural audio synthesis
    this.synthProceduralSound(name);
  }

  private synthProceduralSound(name: SoundName): void {
    if (!this.audioCtx) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) this.audioCtx = new AudioContextClass();
      } catch {
        return;
      }
    }

    const ctx = this.audioCtx;
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    const masterGain = ctx.createGain();
    const vol = Math.max(0.01, Math.min(1, this.settings.sfxVolume));
    masterGain.gain.setValueAtTime(vol * 0.25, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (name) {
      case 'uiClick': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'uiHover': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.02);
        break;
      }

      case 'uiBack': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.06);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }

      case 'doorOpen':
      case 'powerUp': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(70, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.45);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      }

      case 'doorLocked':
      case 'testFail':
      case 'answerWrong': {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'square';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(140, now);
        osc1.frequency.linearRampToValueAtTime(90, now + 0.22);
        osc2.frequency.setValueAtTime(145, now);
        osc2.frequency.linearRampToValueAtTime(95, now + 0.22);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(masterGain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.22);
        osc2.stop(now + 0.22);
        break;
      }

      case 'answerCorrect':
      case 'testPass': {
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + idx * 0.07;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.25, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(start);
          osc.stop(start + 0.2);
        });
        break;
      }

      case 'fragmentGain':
      case 'confetti':
      case 'rankReveal': {
        // Glorious arpeggiated triumphant chord
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + idx * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.35, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(start);
          osc.stop(start + 0.55);
        });
        break;
      }

      case 'hintUse': {
        [440, 554.37, 659.25].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + idx * 0.06;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.2, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(start);
          osc.stop(start + 0.25);
        });
        break;
      }

      case 'alarmLockdown': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.15);
        osc.frequency.linearRampToValueAtTime(440, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }

      case 'timerTickLow': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1000, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.025);
        break;
      }

      case 'keyType': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(600 + Math.random() * 200, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.015);
        break;
      }

      default:
        break;
    }
  }

  pauseAll(): void {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
      } catch {
        // Already stopped
      }
      this.ambientOsc = null;
      this.ambientGain = null;
    }
    Howler.stop();
  }
}

export const audioManager = new AudioManager();
