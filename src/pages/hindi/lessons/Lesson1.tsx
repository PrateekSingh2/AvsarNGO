import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';

const SWAR = [
  { char: 'अ', name: 'a' }, { char: 'आ', name: 'aa' }, { char: 'इ', name: 'i' },
  { char: 'ई', name: 'ii' }, { char: 'उ', name: 'u' }, { char: 'ऊ', name: 'uu' },
  { char: 'ए', name: 'e' }, { char: 'ऐ', name: 'ai' }, { char: 'ओ', name: 'o' },
  { char: 'औ', name: 'au' },
];

export default function HindiLesson1() {
  const [active, setActive] = useState<string | null>(null);
  const [tapped, setTapped] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);
  const { addScore, unlockLevel } = useStore();
  const { playCheer, playDing, speakHindi } = useAudio();
  const navigate = useNavigate();

  const handleTap = (v: typeof SWAR[0]) => {
    speakHindi(v.char);
    playDing();
    setActive(v.char);
    const newTapped = new Set(tapped).add(v.char);
    setTapped(newTapped);
    setTimeout(() => setActive(null), 600);
    if (newTapped.size === SWAR.length && !done) {
      setTimeout(() => { setDone(true); playCheer(); addScore(5); unlockLevel('hindi-game-1'); }, 700);
    }
  };

  return (
    <div className="lesson-screen px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <Link to="/hindi" className="back-btn tap-target"><ArrowLeft className="w-5 h-5" /> हिंदी</Link>
        <h1 className="text-2xl font-black text-white text-shadow">स्वर सीखो!</h1>
        <div className="back-btn font-black text-yellow-300">{tapped.size}/{SWAR.length}</div>
      </div>

      <div className="w-full max-w-3xl mb-4">
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full" animate={{ width: `${(tapped.size / SWAR.length) * 100}%` }} />
        </div>
        <p className="text-white/60 text-sm mt-1 font-bold text-center">हर अक्षर को छूओ! (Tap each letter!)</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full max-w-3xl mt-4">
        {SWAR.map(v => {
          const isTapped = tapped.has(v.char);
          const isActive = active === v.char;
          return (
            <motion.button
              key={v.char}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
              onClick={() => handleTap(v)}
              className={`aspect-square rounded-3xl flex flex-col items-center justify-center text-5xl font-black shadow-lg border-4 transition-all
                ${isActive ? 'bg-yellow-400 border-yellow-300 scale-110 shadow-2xl' :
                  isTapped ? 'bg-emerald-400 border-emerald-300 text-white' :
                  'bg-white/70 border-white/40 text-slate-800 hover:bg-white'}
              `}
            >
              <span>{v.char}</span>
              <span className="text-sm font-bold opacity-70 mt-1">{v.name}</span>
            </motion.button>
          );
        })}
      </div>

      <RewardModal isOpen={done} onClose={() => navigate('/hindi')} onReplay={() => { setTapped(new Set()); setDone(false); }} starsEarned={5} nextPath="/hindi/games/swar-grid" nextLabel="Swar Grid 🎯" />
    </div>
  );
}
