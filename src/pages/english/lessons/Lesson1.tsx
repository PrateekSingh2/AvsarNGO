import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch, i) => ({
  char: ch, emoji: ['🍎','🐝','🐱','🐶','🐘','🐸','🦒','🏠','🍦','🤹','🪁','🦁','🌙','🦕','🐙','🐧','👸','🚀','⭐','🐢','☂️','🦄','🌊','❌','🪀','⚡'][i]
}));

export default function EnglishLesson1() {
  const [active, setActive] = useState<string | null>(null);
  const [tapped, setTapped] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);
  const { addScore, unlockLevel } = useStore();
  const { playCheer, playDing, speakEnglish } = useAudio();
  const navigate = useNavigate();

  const handleTap = (item: typeof ALPHABET[0]) => {
    speakEnglish(`${item.char}. ${item.char} for ${item.emoji}`);
    playDing();
    setActive(item.char);
    const newTapped = new Set(tapped).add(item.char);
    setTapped(newTapped);
    setTimeout(() => setActive(null), 600);
    if (newTapped.size === ALPHABET.length && !done) {
      setTimeout(() => { setDone(true); playCheer(); addScore(5); unlockLevel('english-game-1'); }, 700);
    }
  };

  return (
    <div className="lesson-screen px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <Link to="/english" className="back-btn tap-target"><ArrowLeft className="w-5 h-5" /> English</Link>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white drop-shadow-md">🔤 Alphabet A-Z</h1>
        <div className="back-btn font-black text-amber-500 dark:text-yellow-300">{tapped.size}/26</div>
      </div>

      <div className="w-full max-w-4xl mb-4">
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" animate={{ width: `${(tapped.size / 26) * 100}%` }} />
        </div>
        <p className="text-slate-700 dark:text-white/60 text-sm mt-1 font-bold text-center">Tap each letter to hear it!</p>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-2 w-full max-w-4xl">
        {ALPHABET.map(item => {
          const isTapped = tapped.has(item.char);
          const isActive = active === item.char;
          return (
            <motion.button
              key={item.char}
              whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
              onClick={() => handleTap(item)}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-2xl font-black shadow-md transition-all border-4
                ${isActive ? 'bg-yellow-400 border-yellow-300 scale-115 shadow-xl' :
                  isTapped ? 'bg-emerald-400 border-emerald-300 text-white' :
                  'bg-white/70 border-white/40 text-slate-800 hover:bg-white'}
              `}
            >
              <span>{item.char}</span>
              {isTapped && <span className="text-xs">{item.emoji}</span>}
            </motion.button>
          );
        })}
      </div>

      <RewardModal isOpen={done} onClose={() => navigate('/english')} onReplay={() => { setTapped(new Set()); setDone(false); }} starsEarned={5} nextPath="/english/games/word-builder" nextLabel="Word Builder 🐱" />
    </div>
  );
}
