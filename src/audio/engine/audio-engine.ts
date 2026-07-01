import { eventBus } from "@/core/events/event-bus";

export type BusType = 'master' | 'music' | 'sfx' | 'ambient' | 'voice' | 'ui';
export type SoundName = 'mission_complete' | 'level_up' | 'achievement' | 'xp_gain' | 'focus_start' | 'focus_end' | 'capsule_open' | 'streak_updated' | 'campaign_complete' | 'daily_briefing' | 'workspace_upgrade' | 'notification';
export type AmbientType = 'focus_deep' | 'focus_light' | 'rain' | 'forest' | 'ocean' | 'cafe' | 'bubble_pop' | 'lo_fi';

type BusConfig = { gain: GainNode; volume: number };

class AudioEngineImpl {
  private ctx: AudioContext | null = null;
  private initialized = false;
  private enabled = true;
  private buses = new Map<BusType, BusConfig>();
  private currentAmbient: AmbientType | null = null;
  private ambientNodes: AudioNode[] = [];
  private lfos: OscillatorNode[] = [];

  async init(): Promise<void> {
    if (this.initialized) return;
    try {
      this.ctx = new AudioContext();
      const master = this.ctx.createGain();
      master.gain.value = 0.8;
      master.connect(this.ctx.destination);
      this.buses.set('master', { gain: master, volume: 0.8 });

      const busDefs: { type: BusType; vol: number }[] = [
        { type: 'music', vol: 0.7 },
        { type: 'sfx', vol: 0.8 },
        { type: 'ambient', vol: 0.5 },
        { type: 'voice', vol: 0.8 },
        { type: 'ui', vol: 0.6 },
      ];

      for (const def of busDefs) {
        const gain = this.ctx.createGain();
        gain.gain.value = def.vol;
        gain.connect(master);
        this.buses.set(def.type, { gain, volume: def.vol });
      }

      this.initialized = true;
    } catch {
      console.warn('[AudioEngine] Web Audio API not available');
    }
  }

  destroy(): void {
    this.stopAmbient();
    this.ctx?.close();
    this.ctx = null;
    this.initialized = false;
    this.buses.clear();
  }

  private ensureContext(): void {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  resumeContext(): void {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private getBus(type: BusType): GainNode | null {
    return this.buses.get(type)?.gain ?? null;
  }

  setBusVolume(bus: BusType, volume: number): void {
    const b = this.buses.get(bus);
    if (b) {
      b.volume = Math.max(0, Math.min(1, volume));
      b.gain.gain.linearRampToValueAtTime(b.volume, this.ctx!.currentTime + 0.05);
    }
  }

  getBusVolumes(): Record<BusType, number> {
    const vols: Partial<Record<BusType, number>> = {};
    this.buses.forEach((b, type) => { vols[type] = b.volume; });
    return vols as Record<BusType, number>;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.stopAmbient();
    const master = this.buses.get('master');
    if (master) {
      master.gain.gain.linearRampToValueAtTime(enabled ? master.volume : 0, this.ctx!.currentTime + 0.05);
    }
  }

  getEnabled(): boolean {
    return this.enabled;
  }

  private createOscillator(freq: number, type: OscillatorType, startTime: number, duration: number, bus: BusType, vol: number = 0.3): void {
    if (!this.ctx || !this.enabled) return;
    this.ensureContext();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
    osc.connect(gain);
    const busNode = this.getBus(bus);
    if (busNode) gain.connect(busNode);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private scheduleFrequencies(freqs: { time: number; freq: number }[], type: OscillatorType, duration: number, bus: BusType, vol: number = 0.3): void {
    if (!this.ctx || !this.enabled) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    for (const f of freqs) {
      osc.frequency.setValueAtTime(f.freq, now + f.time);
    }
    gain.gain.setValueAtTime(vol, now);
    gain.gain.linearRampToValueAtTime(0, now + duration);
    osc.connect(gain);
    const busNode = this.getBus(bus);
    if (busNode) gain.connect(busNode);
    osc.start(now);
    osc.stop(now + duration);
  }

  async playEffect(name: SoundName): Promise<void> {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;

    switch (name) {
      case 'mission_complete':
        this.scheduleFrequencies([
          { time: 0, freq: 523 },
          { time: 0.1, freq: 659 },
          { time: 0.2, freq: 784 },
        ], 'sine', 0.4, 'sfx', 0.6);
        break;

      case 'level_up':
        this.scheduleFrequencies([
          { time: 0, freq: 440 },
          { time: 0.15, freq: 554 },
          { time: 0.3, freq: 659 },
          { time: 0.45, freq: 880 },
        ], 'sine', 0.6, 'sfx', 0.7);
        break;

      case 'achievement':
        this.scheduleFrequencies([
          { time: 0, freq: 523 },
          { time: 0.12, freq: 659 },
          { time: 0.24, freq: 784 },
          { time: 0.36, freq: 1047 },
        ], 'sine', 0.5, 'sfx', 0.7);
        break;

      case 'xp_gain':
        this.scheduleFrequencies([
          { time: 0, freq: 440 },
          { time: 0.06, freq: 554 },
          { time: 0.12, freq: 659 },
        ], 'sine', 0.25, 'sfx', 0.5);
        break;

      case 'focus_start':
        this.scheduleFrequencies([
          { time: 0, freq: 330 },
          { time: 0.5, freq: 220 },
        ], 'triangle', 1.5, 'sfx', 0.5);
        break;

      case 'focus_end':
        this.scheduleFrequencies([
          { time: 0, freq: 220 },
          { time: 0.25, freq: 330 },
          { time: 0.5, freq: 440 },
        ], 'triangle', 0.8, 'sfx', 0.5);
        break;

      case 'capsule_open':
        this.scheduleFrequencies([
          { time: 0, freq: 392 },
          { time: 0.08, freq: 523 },
          { time: 0.16, freq: 659 },
          { time: 0.24, freq: 784 },
          { time: 0.32, freq: 1047 },
        ], 'sine', 0.5, 'sfx', 0.6);
        break;

      case 'streak_updated':
        this.scheduleFrequencies([
          { time: 0, freq: 440 },
          { time: 0.1, freq: 554 },
          { time: 0.2, freq: 659 },
        ], 'sine', 0.35, 'sfx', 0.55);
        break;

      case 'campaign_complete': {
        const notes = [262, 330, 392, 523, 659, 784, 1047];
        notes.forEach((freq, i) => {
          this.createOscillator(freq, 'sine', now + i * 0.08, 0.5, 'sfx', 0.55);
        });
        break;
      }

      case 'daily_briefing':
        this.createOscillator(528, 'sine', now, 0.15, 'sfx', 0.5);
        this.createOscillator(660, 'sine', now + 0.12, 0.15, 'sfx', 0.5);
        this.createOscillator(792, 'sine', now + 0.24, 0.3, 'sfx', 0.5);
        break;

      case 'workspace_upgrade':
        this.createOscillator(350, 'sawtooth', now, 0.1, 'sfx', 0.4);
        this.createOscillator(700, 'sawtooth', now + 0.08, 0.1, 'sfx', 0.4);
        this.createOscillator(1050, 'sawtooth', now + 0.16, 0.2, 'sfx', 0.4);
        break;

      case 'notification':
        this.createOscillator(800, 'sine', now, 0.08, 'ui', 0.4);
        this.createOscillator(1000, 'sine', now + 0.12, 0.08, 'ui', 0.4);
        break;
    }
  }

  async startAmbient(type: AmbientType): Promise<void> {
    if (!this.ctx || !this.enabled) return;
    this.ensureContext();
    this.stopAmbient();
    this.currentAmbient = type;

    const ambientBus = this.getBus('ambient');
    if (!ambientBus) return;

    const now = this.ctx.currentTime;
    const duration = 4;
    const sampleRate = this.ctx.sampleRate;

    const createNoiseBuffer = (len: number): AudioBuffer => {
      const buffer = this.ctx!.createBuffer(1, len, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buffer;
    };

    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    source.loop = true;

    switch (type) {
      case 'focus_deep': {
        const buf = createNoiseBuffer(sampleRate * duration);
        source.buffer = buf;
        filter.type = 'lowpass';
        filter.frequency.value = 300;
        filter.Q.value = 1.5;
        gain.gain.value = 0.35;

        const drone = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        drone.type = 'sine';
        drone.frequency.value = 432;
        droneGain.gain.value = 0.12;
        drone.connect(droneGain);
        droneGain.connect(ambientBus);
        drone.start();
        this.ambientNodes.push(drone, droneGain);
        break;
      }

      case 'focus_light': {
        const buf = createNoiseBuffer(sampleRate * duration);
        source.buffer = buf;
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 0.7;
        gain.gain.value = 0.25;

        const drone = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        drone.type = 'sine';
        drone.frequency.value = 528;
        droneGain.gain.value = 0.1;
        drone.connect(droneGain);
        droneGain.connect(ambientBus);
        drone.start();
        this.ambientNodes.push(drone, droneGain);
        break;
      }

      case 'rain': {
        const buf = createNoiseBuffer(sampleRate * duration);
        source.buffer = buf;
        filter.type = 'highpass';
        filter.frequency.value = 2000;
        filter.Q.value = 0.5;
        gain.gain.value = 0.45;

        lfo.type = 'sine';
        lfo.frequency.value = 0.3;
        lfoGain.gain.value = 0.1;
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();
        this.lfos.push(lfo);
        break;
      }

      case 'forest': {
        const buf = createNoiseBuffer(sampleRate * duration);
        source.buffer = buf;
        filter.type = 'bandpass';
        filter.frequency.value = 500;
        filter.Q.value = 1.0;
        gain.gain.value = 0.3;

        const chirp = (delay: number, f1: number, f2: number) => {
          const chirpOsc = this.ctx!.createOscillator();
          const chirpGain = this.ctx!.createGain();
          chirpOsc.type = 'sine';
          chirpOsc.frequency.setValueAtTime(f1, now + delay);
          chirpOsc.frequency.linearRampToValueAtTime(f2, now + delay + 0.15);
          chirpGain.gain.setValueAtTime(0, now + delay);
          chirpGain.gain.linearRampToValueAtTime(0.12, now + delay + 0.02);
          chirpGain.gain.linearRampToValueAtTime(0, now + delay + 0.15);
          chirpOsc.connect(chirpGain);
          chirpGain.connect(ambientBus);
          chirpOsc.start(now + delay);
          chirpOsc.stop(now + delay + 0.15);
          this.ambientNodes.push(chirpOsc, chirpGain);
        };

        chirp(0.5, 2400, 3200);
        chirp(1.8, 2000, 2800);
        chirp(3.0, 2600, 3400);

        const reChirp = setInterval(() => {
          if (this.currentAmbient !== 'forest') { clearInterval(reChirp); return; }
          const d = Math.random() * 2;
          const f1 = 1800 + Math.random() * 1000;
          const f2 = f1 + 400 + Math.random() * 600;
          chirp(d, f1, f2);
        }, 4000);
        (source as any)._chirpInterval = reChirp;
        break;
      }

      case 'ocean': {
        const buf = createNoiseBuffer(sampleRate * duration);
        source.buffer = buf;
        filter.type = 'lowpass';
        filter.frequency.value = 600;
        filter.Q.value = 0.3;
        gain.gain.value = 0.4;

        lfo.type = 'sine';
        lfo.frequency.value = 0.08;
        lfoGain.gain.value = 0.2;
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();
        this.lfos.push(lfo);
        break;
      }

      case 'cafe': {
        const buf = createNoiseBuffer(sampleRate * duration);
        source.buffer = buf;
        filter.type = 'bandpass';
        filter.frequency.value = 1500;
        filter.Q.value = 0.4;
        gain.gain.value = 0.2;

        const clatter = () => {
          if (this.currentAmbient !== 'cafe') return;
          const cGain = this.ctx!.createGain();
          cGain.gain.setValueAtTime(0.2, this.ctx!.currentTime);
          cGain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.08);
          const cBuf = createNoiseBuffer(sampleRate * 0.08);
          const cSrc = this.ctx!.createBufferSource();
          cSrc.buffer = cBuf;
          const cFilter = this.ctx!.createBiquadFilter();
          cFilter.type = 'highpass';
          cFilter.frequency.value = 3000;
          cSrc.connect(cFilter);
          cFilter.connect(cGain);
          cGain.connect(ambientBus);
          cSrc.start();
          this.ambientNodes.push(cSrc, cFilter, cGain);
        };

        const reClatter = setInterval(() => {
          if (this.currentAmbient !== 'cafe') { clearInterval(reClatter); return; }
          if (Math.random() < 0.3) clatter();
        }, 3000);
        (source as any)._clatterInterval = reClatter;
        break;
      }

      case 'bubble_pop': {
        const bbBuf = createNoiseBuffer(sampleRate * duration);
        source.buffer = bbBuf;
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 2.0;
        gain.gain.value = 0.15;

        const pop = () => {
          if (this.currentAmbient !== 'bubble_pop') return;
          const pGain = this.ctx!.createGain();
          const t = this.ctx!.currentTime;
          pGain.gain.setValueAtTime(0.25, t);
          pGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
          const pBuf = createNoiseBuffer(sampleRate * 0.12);
          const pSrc = this.ctx!.createBufferSource();
          pSrc.buffer = pBuf;
          const pFilter = this.ctx!.createBiquadFilter();
          pFilter.type = 'bandpass';
          pFilter.frequency.value = 800 + Math.random() * 1600;
          pFilter.Q.value = 1.5 + Math.random();
          pSrc.connect(pFilter);
          pFilter.connect(pGain);
          pGain.connect(ambientBus);
          pSrc.start();
          this.ambientNodes.push(pSrc, pFilter, pGain);
        };

        const rePop = setInterval(() => {
          if (this.currentAmbient !== 'bubble_pop') { clearInterval(rePop); return; }
          if (Math.random() < 0.4) pop();
        }, 1500);
        (source as any)._popInterval = rePop;
        break;
      }

      case 'lo_fi': {
        const lofiBuf = createNoiseBuffer(sampleRate * duration);
        source.buffer = lofiBuf;
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        filter.Q.value = 1.0;
        gain.gain.value = 0.12;

        const beat = () => {
          if (this.currentAmbient !== 'lo_fi') return;
          const bGain = this.ctx!.createGain();
          const t = this.ctx!.currentTime;
          bGain.gain.setValueAtTime(0.18, t);
          bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
          const bBuf = createNoiseBuffer(sampleRate * 0.15);
          const bSrc = this.ctx!.createBufferSource();
          bSrc.buffer = bBuf;
          const bFilter = this.ctx!.createBiquadFilter();
          bFilter.type = 'lowpass';
          bFilter.frequency.value = 150;
          bSrc.connect(bFilter);
          bFilter.connect(bGain);
          bGain.connect(ambientBus);
          bSrc.start();
          this.ambientNodes.push(bSrc, bFilter, bGain);
        };

        beat();
        const reBeat = setInterval(() => {
          if (this.currentAmbient !== 'lo_fi') { clearInterval(reBeat); return; }
          beat();
        }, 800);
        (source as any)._beatInterval = reBeat;
        break;
      }
    }

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ambientBus);
    source.start();

    this.ambientNodes.push(source, filter, gain);
  }

  stopAmbient(): void {
    const source = this.ambientNodes.find(n => n instanceof AudioBufferSourceNode) as AudioBufferSourceNode | undefined;
    if ((source as any)?._chirpInterval) clearInterval((source as any)._chirpInterval);
    if ((source as any)?._clatterInterval) clearInterval((source as any)._clatterInterval);
    if ((source as any)?._popInterval) clearInterval((source as any)._popInterval);
    if ((source as any)?._beatInterval) clearInterval((source as any)._beatInterval);

    this.ambientNodes.forEach(n => {
      try {
        if (n instanceof OscillatorNode || n instanceof AudioBufferSourceNode) {
          n.stop();
        }
        n.disconnect();
      } catch { /* already stopped */ }
    });
    this.ambientNodes = [];

    this.lfos.forEach(lfo => {
      try { lfo.stop(); lfo.disconnect(); } catch { /* already stopped */ }
    });
    this.lfos = [];

    this.currentAmbient = null;
  }

  getCurrentAmbient(): AmbientType | null {
    return this.currentAmbient;
  }

  setupEventSubscriptions(): void {
    eventBus.subscribe('MISSION_COMPLETED', async () => { await this.playEffect('mission_complete'); });
    eventBus.subscribe('LEVEL_UP', async () => { await this.playEffect('level_up'); });
    eventBus.subscribe('ACHIEVEMENT_UNLOCKED', async () => { await this.playEffect('achievement'); });
    eventBus.subscribe('XP_GAINED', async () => { await this.playEffect('xp_gain'); });
    eventBus.subscribe('FOCUS_STARTED', async () => { await this.playEffect('focus_start'); });
    eventBus.subscribe('FOCUS_ENDED', async () => { await this.playEffect('focus_end'); });
    eventBus.subscribe('STREAK_UPDATED', async () => { await this.playEffect('streak_updated'); });
    eventBus.subscribe('CAMPAIGN_COMPLETED', async () => { await this.playEffect('campaign_complete'); });
    eventBus.subscribe('REWARD_CAPSULE_OPENED', async () => { await this.playEffect('capsule_open'); });
  }
}

export const audioEngine = new AudioEngineImpl();

export function setupAudioEventSubscriptions(): void {
  audioEngine.setupEventSubscriptions();
}
