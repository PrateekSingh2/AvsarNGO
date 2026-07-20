import { useCallback } from 'react';
import confetti from 'canvas-confetti';
import { audioManager } from '../lib/audioManager';

// Hindi audio phrases using Web Speech API with hi-IN locale
const HINDI_CHEER_PHRASES = [
  'शाबाश! बहुत अच्छे!',
  'वाह! क्या बात है!',
  'बहुत बढ़िया! तुमने कर दिखाया!',
  'अरे वाह! तुम तो कमाल हो!',
];

const HINDI_TRY_AGAIN = 'फिर से कोशिश करो!';
const HINDI_CORRECT = 'सही जवाब!';
const HINDI_WRONG = 'ओह! फिर से करो!';

// Force voice loading as early as possible
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

export function useAudio() {
  const getVoice = useCallback((lang: string) => {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    
    // First, try to find a Google-specific cloud voice for this language
    let voice = voices.find(v => v.lang === lang && v.name.includes('Google'));
    
    // Then try exact match
    if (!voice) voice = voices.find(v => v.lang === lang);
    
    // Then try prefix match
    if (!voice) {
      const prefix = lang.split('-')[0];
      voice = voices.find(v => v.lang.startsWith(prefix));
    }
    
    // Aggressive fallback for Hindi
    if (!voice && lang.startsWith('hi')) {
      voice = voices.find(v => 
        v.name.toLowerCase().includes('hindi') || 
        v.name.includes('हिन्दी') ||
        v.lang === 'hi'
      );
    }
    return voice || null;
  }, []);

  const speakWithVoice = useCallback((text: string, lang: string, pitch = 1.2) => {
    if (audioManager.isMuted() || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const voice = getVoice(lang);
    if (voice) utterance.voice = voice;
    utterance.rate = lang.startsWith('hi') ? 0.68 : 0.78;
    utterance.pitch = pitch;
    utterance.volume = 1;
    utterance.onerror = () => {
      const retry = new SpeechSynthesisUtterance(text);
      retry.lang = lang.startsWith('hi') ? 'hi' : lang;
      retry.rate = 0.7;
      retry.pitch = pitch;
      window.speechSynthesis.speak(retry);
    };
    window.speechSynthesis.speak(utterance);
  }, [getVoice]);

  const speak = useCallback((text: string, lang: string = 'hi-IN') => {
    speakWithVoice(text, lang, 1.2);
  }, [speakWithVoice]);

  const speakHindi = useCallback((text: string) => {
    speakWithVoice(text, 'hi-IN', 1.28);
  }, [speakWithVoice]);

  const speakEnglish = useCallback((text: string) => {
    if (!audioManager.isMuted() && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      const voice = getVoice('en-US');
      if (voice) utterance.voice = voice;
      utterance.rate = 0.75; // Slower pace for kids
      utterance.pitch = 1.2;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [getVoice]);

  const cheerHindi = useCallback(() => {
    const phrase = HINDI_CHEER_PHRASES[Math.floor(Math.random() * HINDI_CHEER_PHRASES.length)];
    speakWithVoice(phrase, 'hi-IN', 1.4);
  }, [speakWithVoice]);

  const playBoop = useCallback(() => {
    audioManager.playSound('wrong');
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) { /* noop */ }
  }, []);

  const correctHindi = useCallback(() => {
    speak(HINDI_CORRECT, 'hi-IN');
  }, [speak]);

  const wrongHindi = useCallback(() => {
    speak(HINDI_WRONG, 'hi-IN');
  }, [speak]);

  const tryAgainHindi = useCallback(() => {
    speak(HINDI_TRY_AGAIN, 'hi-IN');
  }, [speak]);

  const playDing = useCallback(() => {
    audioManager.playSound('correct');
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) { /* noop */ }
  }, []);

  const playCheer = useCallback(() => {
    audioManager.playSound('achievement');
    cheerHindi();
    const duration = 3500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 70, zIndex: 9999 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 60 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 200);
  }, [cheerHindi]);

  return { speak, speakHindi, speakEnglish, cheerHindi, correctHindi, wrongHindi, tryAgainHindi, playBoop, playDing, playCheer };
}
