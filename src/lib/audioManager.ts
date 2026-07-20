type SoundName = 'click' | 'hover' | 'correct' | 'wrong' | 'levelUp' | 'achievement' | 'reward' | 'complete' | 'navigation';
type MusicScene = 'home' | 'math' | 'english' | 'hindi' | 'drawing' | 'garden';

const frequencies: Record<SoundName, number[]> = {
  click: [420, 520], hover: [660], correct: [660, 880, 1040], wrong: [220, 180], levelUp: [523, 659, 784, 1046], achievement: [784, 988, 1175], reward: [587, 740, 988], complete: [523, 784, 1046], navigation: [330, 440],
};
const music: Record<MusicScene, number[]> = {
  home: [392, 523, 659, 784], math: [330, 392, 494, 659], english: [440, 554, 659, 880], hindi: [294, 392, 440, 587], drawing: [349, 440, 523, 698], garden: [262, 330, 392, 523],
};

class AudioManager {
  private ctx: AudioContext | null = null;
  private loop: number | null = null;
  private musicGain: GainNode | null = null;
  private muted = false;

  private ensure() {
    if (this.ctx || typeof window === 'undefined') return this.ctx;
    const Ctor = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    this.ctx = Ctor ? new Ctor() : null;
    return this.ctx;
  }

  playSound(name: SoundName) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    frequencies[name].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.24);
    });
  }

  playMusic(scene: MusicScene) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    this.stopMusic();
    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0.035;
    this.musicGain.connect(ctx.destination);
    let step = 0;
    const tick = () => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = music[scene][step % music[scene].length];
      osc.connect(this.musicGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.55);
      step += 1;
    };
    tick();
    this.loop = window.setInterval(tick, 800);
  }

  stopMusic() { if (this.loop) window.clearInterval(this.loop); this.loop = null; this.musicGain?.disconnect(); this.musicGain = null; }
  toggleMute() { this.muted = !this.muted; if (this.muted) this.stopMusic(); return this.muted; }
  isMuted() { return this.muted; }
}

export const audioManager = new AudioManager();
