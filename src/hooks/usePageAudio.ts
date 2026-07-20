import { useEffect } from 'react';
import { audioManager } from '../lib/audioManager';

export function usePageAudio(scene: 'home'|'math'|'english'|'hindi'|'drawing'|'garden') {
  useEffect(() => { audioManager.playMusic(scene); return () => audioManager.stopMusic(); }, [scene]);
}
