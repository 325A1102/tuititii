/**
 * Web Audio API based Sound Effects & Procedural J-POP Synthesizer
 * Reproduces the bouncy, high-energy festival anthem and authentic festival SFX.
 */

class AudioService {
  private ctx: AudioContext | null = null;
  public analyser: AnalyserNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmStartTime: number = 0;
  private timerId: number | null = null;
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private tempo: number = 132;
  private currentStep: number = 0;
  private customAudio: HTMLAudioElement | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play synthesized SFX
  public playBell() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // School Festival Bell (dual chime)
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.3, now + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 2.5);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 2.6);
    });
  }

  public playHighFive() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Clap noise burst
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 1.8;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    whiteNoise.start(now);

    // Cheerful high tone
    const osc = this.ctx.createOscillator();
    const toneGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.18);
    toneGain.gain.setValueAtTime(0.25, now);
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(toneGain);
    toneGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playSizzle() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Frying noise
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3200;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.48);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  public playBoing() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Cheese stretch boing
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  public playDing() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, now); // C6
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playChime() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    [784, 987.77, 1174.66].forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.65);
    });
  }

  // Synthetic Pop BGM Sequencer
  public startBgm(onTimeUpdate?: (time: number) => void) {
    this.initContext();
    if (!this.ctx) return;
    if (this.isBgmPlaying) return;

    this.isBgmPlaying = true;
    this.bgmStartTime = this.ctx.currentTime;
    this.currentStep = 0;
    this.onTimeUpdateCallback = onTimeUpdate || null;

    // Chord progression (IV - V - iii - vi) Anime pop classic
    // F - G - Em - Am
    const bassNotes = [174.61, 196.00, 164.81, 220.00]; // F3, G3, E3, A3
    const chordFrequencies = [
      [349.23, 440.00, 523.25, 659.25], // Fmaj7
      [392.00, 493.88, 587.33, 698.46], // G7
      [329.63, 392.00, 493.88, 587.33], // Em7
      [440.00, 523.25, 659.25, 783.99], // Am7
    ];
    // Catchy melody notes
    const melodyPhrases = [
      [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 659.25], // C5, D5, E5, G5, E5, D5, C5, E5
      [783.99, 880.00, 783.99, 659.25, 587.33, 659.25, 783.99, 987.77], // G5, A5, G5, E5, D5, E5, G5, B5
      [1046.5, 987.77, 880.00, 783.99, 659.25, 587.33, 659.25, 783.99], // C6, B5, A5, G5, E5, D5, E5, G5
      [880.00, 783.99, 659.25, 587.33, 523.25, 587.33, 659.25, 523.25], // A5, G5, E5, D5, C5, D5, E5, C5
    ];

    const stepInterval = (60 / this.tempo) / 4; // 16th note

    const scheduleNext = () => {
      if (!this.isBgmPlaying || !this.ctx) return;

      const now = this.ctx.currentTime;
      const barIndex = Math.floor(this.currentStep / 16) % 4;
      const stepInBar = this.currentStep % 16;
      const sixteenthBeat = this.currentStep % 4;

      // 1. Drum Beat: Kick on 1 & 3, Snare on 2 & 4, Hi-hat on every 8th
      if (stepInBar === 0 || stepInBar === 8) {
        // Kick
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.analyser!);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      }

      if (stepInBar === 4 || stepInBar === 12) {
        // Snare
        const bufferSize = this.ctx.sampleRate * 0.09;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        noise.connect(gain);
        gain.connect(this.analyser!);
        gain.connect(this.ctx.destination);
        noise.start(now);
      }

      // Hi-hat on every 16th or 8th
      if (sixteenthBeat === 0 || sixteenthBeat === 2) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'highpass' as unknown as OscillatorType;
        const noiseBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.03, this.ctx.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const src = this.ctx.createBufferSource();
        src.buffer = noiseBuf;
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        src.connect(gain);
        gain.connect(this.ctx.destination);
        src.start(now);
      }

      // 2. Bass (bouncy 8th notes)
      if (stepInBar % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        const root = bassNotes[barIndex];
        const oct = (stepInBar === 2 || stepInBar === 10) ? root * 2 : root;
        bassOsc.frequency.setValueAtTime(oct / 2, now);
        bassGain.gain.setValueAtTime(0.2, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        bassOsc.connect(bassGain);
        bassGain.connect(this.analyser!);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.15);
      }

      // 3. Chord Stabs on upbeat (2, 6, 10, 14)
      if (stepInBar === 2 || stepInBar === 6 || stepInBar === 10 || stepInBar === 14) {
        const freqs = chordFrequencies[barIndex];
        freqs.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(this.analyser!);
          gain.connect(this.ctx!.destination);
          osc.start(now);
          osc.stop(now + 0.16);
        });
      }

      // 4. Lead Melody on even beats
      if (stepInBar % 2 === 0) {
        const melodyIdx = Math.floor(stepInBar / 2) % 8;
        const note = melodyPhrases[barIndex][melodyIdx];
        if (note) {
          const mOsc = this.ctx.createOscillator();
          const mGain = this.ctx.createGain();
          mOsc.type = 'sine';
          mOsc.frequency.setValueAtTime(note, now);
          mGain.gain.setValueAtTime(0.12, now);
          mGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          mOsc.connect(mGain);
          mGain.connect(this.analyser!);
          mGain.connect(this.ctx.destination);
          mOsc.start(now);
          mOsc.stop(now + 0.19);
        }
      }

      this.currentStep++;
      const elapsed = (this.ctx.currentTime - this.bgmStartTime) % 185; // loop length
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(elapsed);
      }

      this.timerId = window.setTimeout(scheduleNext, stepInterval * 1000);
    };

    scheduleNext();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public isPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public getPlaybackTime(): number {
    if (!this.ctx || !this.isBgmPlaying) return 0;
    return (this.ctx.currentTime - this.bgmStartTime) % 185;
  }
}

export const audioService = new AudioService();
