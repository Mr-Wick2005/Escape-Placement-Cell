import { Howler } from 'howler';
import type { GameData, Screen } from '../store/gameTypes';
import { SOUND_MAP, type SoundName } from './soundMap';

interface MusicTrackNodes {
  oscillators: OscillatorNode[];
  gain: GainNode;
  filter: BiquadFilterNode;
  intervalId?: number;
}

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

  private currentTrack: Screen | null = null;
  private activeMusic: MusicTrackNodes | null = null;
  private fadingMusic: MusicTrackNodes | null = null;

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pauseAll();
        } else if (this.unlocked && !this.settings.muted) {
          if (this.currentTrack) {
            this.playMusicForScreen(this.currentTrack);
          }
        }
      });
    }
  }

  unlock(settings: GameData['settings']): void {
    this.unlocked = true;
    this.settings = settings;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
  }

  applySettings(settings: GameData['settings']): void {
    this.settings = settings;
    Howler.mute(settings.muted);
    Howler.volume(settings.muted ? 0 : settings.sfxVolume);

    if (this.activeMusic && this.audioCtx) {
      const targetVol = settings.muted ? 0 : settings.musicVolume * 0.15;
      this.activeMusic.gain.gain.setTargetAtTime(targetVol, this.audioCtx.currentTime, 0.1);
    }
  }

  /**
   * Screen-specific music loops with 1.5s crossfade between screens
   */
  playMusicForScreen(screen: Screen): void {
    if (!this.unlocked || this.currentTrack === screen) return;
    this.currentTrack = screen;

    if (!this.audioCtx) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

    const now = ctx.currentTime;
    const targetVol = this.settings.muted ? 0 : this.settings.musicVolume * 0.15;

    // Crossfade: Fade out currently active music over 1.5 seconds
    if (this.activeMusic) {
      if (this.fadingMusic) {
        this.cleanupTrack(this.fadingMusic);
      }
      this.fadingMusic = this.activeMusic;
      this.activeMusic.gain.gain.setValueAtTime(this.activeMusic.gain.gain.value, now);
      this.activeMusic.gain.gain.linearRampToValueAtTime(0, now + 1.5);
      const toClean = this.activeMusic;
      setTimeout(() => {
        this.cleanupTrack(toClean);
        if (this.fadingMusic === toClean) this.fadingMusic = null;
      }, 1600);
      this.activeMusic = null;
    }

    // Build theme for the new screen
    const newTrack = this.createScreenMusic(screen, ctx, now, targetVol);
    this.activeMusic = newTrack;
  }

  private cleanupTrack(track: MusicTrackNodes): void {
    try {
      if (track.intervalId) clearInterval(track.intervalId);
      track.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Already stopped
        }
      });
      track.gain.disconnect();
      track.filter.disconnect();
    } catch {
      // Disposed
    }
  }

  private createScreenMusic(
    screen: Screen,
    ctx: AudioContext,
    now: number,
    targetVol: number
  ): MusicTrackNodes {
    const masterGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const oscs: OscillatorNode[] = [];

    // Fade in new music over 1.5s
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(targetVol, now + 1.5);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    let intervalId: number | undefined;

    switch (screen) {
      case 'TITLE': {
        // Dark synth pad: deep minor chord (A1, E2, C3)
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(160, now);
        [55, 82.4, 130.8].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          osc.connect(filter);
          osc.start(now);
          oscs.push(osc);
        });
        break;
      }

      case 'INTRO':
      case 'HUB': {
        // Low pulse ambience: subtle rhythmic breathing sub-bass
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(110, now);
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65.4, now); // C2
        osc.connect(filter);
        osc.start(now);
        oscs.push(osc);
        break;
      }

      case 'APTITUDE': {
        // Tense puzzle loop: cyan, airy, high crystalline harmonic sines
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(440, now);
        filter.Q.setValueAtTime(1.5, now);
        [220, 329.6, 440].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq + idx * 0.5, now);
          osc.connect(filter);
          osc.start(now);
          oscs.push(osc);
        });
        break;
      }

      case 'CODING': {
        // Cyberpunk beat: rhythmic bass pulse (82Hz / 164Hz)
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, now);
        const bass = ctx.createOscillator();
        bass.type = 'sawtooth';
        bass.frequency.setValueAtTime(82.4, now); // E2
        bass.connect(filter);
        bass.start(now);
        oscs.push(bass);
        break;
      }

      case 'INTERVIEW': {
        // Minimal drone + heartbeat tension
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(90, now);
        const drone = ctx.createOscillator();
        drone.type = 'sine';
        drone.frequency.setValueAtTime(55, now);
        drone.connect(filter);
        drone.start(now);
        oscs.push(drone);
        break;
      }

      case 'FINAL': {
        // Epic build: detuned saw oscillators and dramatic swell
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, now);
        [110, 146.8, 164.8, 220].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          osc.connect(filter);
          osc.start(now);
          oscs.push(osc);
        });
        break;
      }

      case 'ENDING':
      case 'REPORT': {
        // Serene ambient victory resolution pad (C major / G major)
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);
        [130.8, 164.8, 196.0, 261.6].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          osc.connect(filter);
          osc.start(now);
          oscs.push(osc);
        });
        break;
      }

      default:
        break;
    }

    return { oscillators: oscs, gain: masterGain, filter, intervalId };
  }

  play(name: SoundName): void {
    if (!this.unlocked || this.settings.muted || this.settings.sfxVolume <= 0) return;

    const customUrl = SOUND_MAP[name];
    if (customUrl) return;

    this.synthProceduralSound(name);
  }

  private synthProceduralSound(name: SoundName): void {
    if (!this.audioCtx) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
    if (this.activeMusic) {
      this.cleanupTrack(this.activeMusic);
      this.activeMusic = null;
    }
    if (this.fadingMusic) {
      this.cleanupTrack(this.fadingMusic);
      this.fadingMusic = null;
    }
    Howler.stop();
  }
}

export const audioManager = new AudioManager();
