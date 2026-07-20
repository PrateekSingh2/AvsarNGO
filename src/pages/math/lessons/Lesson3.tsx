import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';

const SHAPES = [
  { name: 'Circle', hindi: 'गोल', emoji: '🔴' },
  { name: 'Square', hindi: 'चौकोर', emoji: '🟦' },
  { name: 'Triangle', hindi: 'त्रिकोण', emoji: '🔺' },
  { name: 'Star', hindi: 'तारा', emoji: '⭐' },
];

export default function MathLesson3() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const { addScore, unlockLevel } = useStore();
  const { playCheer, playDing, speakHindi } = useAudio();
  const navigate = useNavigate();
  const shape = SHAPES[current];

  const handleNext = () => {
    speakHindi(`${shape.name}. ${shape.hindi}`);
    playDing();
    if (current < SHAPES.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setDone(true);
      playCheer();
      addScore(10);
      unlockLevel('math-game-3'); // Unlocks NumberTracing
    }
  };

  return (
    <div className="lesson-screen px-4 py-8 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link to="/math" className="back-btn tap-target"><ArrowLeft className="w-5 h-5" /> गणित</Link>
      </div>

      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-slate-700 dark:text-white/70 text-sm mb-2 font-bold">
          <span>पाठ 3: आकार (Shapes)</span><span>{current + 1} / {SHAPES.length}</span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" animate={{ width: `${((current + 1) / SHAPES.length) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
          className="glass-card p-10 md:p-14 text-center w-full max-w-sm"
        >
          <motion.div
            className="text-[120px] leading-none mb-6 cursor-pointer drop-shadow-2xl animate-float"
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => speakHindi(`${shape.name}. ${shape.hindi}`)}
          >
            {shape.emoji}
          </motion.div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 drop-shadow-md">{shape.name}</h2>
          <p className="text-slate-700 dark:text-white/70 text-2xl font-bold mb-8">{shape.hindi}</p>
          <button onClick={handleNext} className="action-btn tap-target bg-gradient-to-r from-emerald-500 to-teal-500 text-white w-full">
            {current < SHAPES.length - 1 ? 'अगला →' : 'शाबाश! 🎉'}
          </button>
        </motion.div>
      </AnimatePresence>

      <RewardModal isOpen={done} onClose={() => navigate('/math')} onReplay={() => { setCurrent(0); setDone(false); }} starsEarned={10} nextPath="/math/games/number-tracing" nextLabel="Tracing ✍️" />
    </div>
  );
}
