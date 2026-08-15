class SensorySystem {
  audioCtx: AudioContext | null = null;
  soundEnabled: boolean = false;
  hapticsEnabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const savedSound = localStorage.getItem("cq_sound");
        const savedHaptics = localStorage.getItem("cq_haptics");
        if (savedSound !== null) this.soundEnabled = savedSound === "true";
        if (savedHaptics !== null) this.hapticsEnabled = savedHaptics === "true";
      } catch (e) {}
    }
  }

  setSound(val: boolean) {
    this.soundEnabled = val;
    if (typeof window !== "undefined") {
      try { localStorage.setItem("cq_sound", val.toString()); } catch (e) {}
    }
  }

  setHaptics(val: boolean) {
    this.hapticsEnabled = val;
    if (typeof window !== "undefined") {
      try { localStorage.setItem("cq_haptics", val.toString()); } catch (e) {}
    }
  }

  initAudio() {
    if (typeof window === "undefined") return;
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1) {
    if (!this.soundEnabled || typeof window === "undefined") return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioCtx.currentTime + duration,
      );

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }

  vibrate(pattern: number | number[]) {
    if (!this.hapticsEnabled || typeof window === "undefined" || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }

  // Base Methods
  playSuccess() {
    this.playTone(440, "sine", 0.15, 0.1);
    setTimeout(() => this.playTone(659.25, "sine", 0.4, 0.1), 100);
    this.vibrate([50, 50, 50]);
  }

  playError() {
    this.playTone(150, "sawtooth", 0.3, 0.15);
    this.vibrate([200, 100, 200]);
  }

  playKeystroke() {
    this.playTone(800, "square", 0.02, 0.01);
    this.vibrate([10]); // very light haptic for keystroke
  }

  playTap() {
    this.playTone(600, "sine", 0.05, 0.02);
    this.vibrate([20]); // button tap
  }

  // Aliases for System Context
  triggerSuccess() {
    this.playSuccess();
  }
  triggerError() {
    this.playError();
  }
  triggerNotification() {
    this.playTone(600, "sine", 0.1, 0.05);
    setTimeout(() => this.playTone(800, "sine", 0.1, 0.05), 150);
    this.vibrate([50, 100, 50]);
  }
}

export const SensoryEngine = new SensorySystem();
