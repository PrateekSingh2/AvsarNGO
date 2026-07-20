import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';

const COLORS = [
  { name: 'Red', hindi: 'लाल', emoji: '🍎', color: 'bg-red-500', text: 'text-white' },
  { name: 'Blue', hindi: 'नीला', emoji: '🫐', color: 'bg-blue-500', text: 'text-white' },
  { name: 'Green', hindi: 'हरा', emoji: '🍀', color: 'bg-green-500', text: 'text-white' },
  { name: 'Yellow', hindi: 'पीला', emoji: '🌻', color: 'bg-yellow-400', text: 'text-slate-800' },
  { name: 'Purple', hindi: 'बैंगनी', emoji: '🍇', color: 'bg-purple-500', text: 'text-white' },
  { name: 'Orange', hindi: 'नारंगी', emoji: '🍊', color: 'bg-orange-500', text: 'text-white' },
];

export default function EnglishLesson2() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const { addScore, unlockLevel } = useStore();
  const { playCheer, playDing, speakEnglish } = useAudio();
  const navigate = useNavigate();
  const color = COLORS[current];

  const handleNext = () => {
    speakEnglish(`${color.name}. ${color.name} रंग.`);
    playDing();
    if (current < COLORS.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setDone(true);
      playCheer();
      addScore(8);
      unlockLevel('english-game-2');
    }
  };

  return (
    <div className="lesson-screen px-4 py-8 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link to="/english" className="back-btn tap-target"><ArrowLeft className="w-5 h-5" /> English</Link>
      </div>

      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-slate-700 dark:text-white/70 text-sm mb-2 font-bold">
          <span>Lesson 2: Colors</span><span>{current + 1} / {COLORS.length}</span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" animate={{ width: `${((current + 1) / COLORS.length) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
          className="glass-card p-10 text-center w-full max-w-sm"
        >
          <div className={`w-32 h-32 rounded-3xl mx-auto mb-6 flex items-center justify-center text-6xl shadow-2xl ${color.color}`}>
            {color.emoji}
          </div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-2 drop-shadow-md">{color.name}</h2>
          <p className="text-slate-700 dark:text-white/70 text-2xl font-bold mb-8">{color.hindi}</p>
          <button onClick={handleNext} className="action-btn tap-target bg-gradient-to-r from-emerald-500 to-teal-500 text-white w-full">
            {current < COLORS.length - 1 ? 'Next Color →' : 'Done! 🎉'}
          </button>
        </motion.div>
      </AnimatePresence>

      <RewardModal isOpen={done} onClose={() => navigate('/english')} onReplay={() => { setCurrent(0); setDone(false); }} starsEarned={8} nextPath="/english/games/letter-hunt" nextLabel="Letter Hunt" />
    </div>
  );
}
