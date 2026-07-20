import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';

const ADDITIONS = [
  { q: '1 + 1 = ?', a: 2, emojis: ['🍎', '🍎'] },
  { q: '2 + 1 = ?', a: 3, emojis: ['⭐', '⭐', '⭐'] },
  { q: '2 + 2 = ?', a: 4, emojis: ['🐙', '🐙', '🐙', '🐙'] },
  { q: '3 + 2 = ?', a: 5, emojis: ['🌸', '🌸', '🌸', '🌸', '🌸'] },
];

export default function MathLesson2() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const { addScore, unlockLevel } = useStore();
  const { playCheer, playDing, speakHindi } = useAudio();
  const navigate = useNavigate();
  const current = ADDITIONS[step];

  const handleNext = () => {
    playDing();
    speakHindi(current.q.replace('?', current.a.toString()));
    if (step < ADDITIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      setDone(true);
      playCheer();
      addScore(8);
      unlockLevel('math-game-2');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link to="/math" className="back-btn"><ArrowLeft className="w-5 h-5" /> गणित</Link>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-slate-700 dark:text-white/70 text-sm mb-2 font-bold">
          <span>पाठ 2: जोड़ना</span>
          <span>{step + 1} / {ADDITIONS.length}</span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
            animate={{ width: `${((step + 1) / ADDITIONS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
          className="glass-card p-8 md:p-12 text-center w-full max-w-lg"
        >
          <p className="text-slate-700 dark:text-white/70 text-lg font-bold mb-4">जोड़ो! (Add!)</p>
          <div className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 drop-shadow-md">{current.q}</div>
          <div className="flex flex-wrap justify-center gap-3 mb-10 min-h-[80px] items-center">
            {current.emojis.map((e, i) => (
              <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} className="text-4xl">
                {e}
              </motion.span>
            ))}
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            className="text-8xl font-black text-yellow-300 mb-10 cursor-pointer text-shadow"
            onClick={handleNext}
          >
            = {current.a}
          </motion.div>
          <button onClick={handleNext} className="action-btn bg-gradient-to-r from-emerald-500 to-teal-500 text-white w-full">
            {step < ADDITIONS.length - 1 ? 'अगला →' : 'पूरा हो गया! 🎉'}
          </button>
        </motion.div>
      </AnimatePresence>

      <RewardModal isOpen={done} onClose={() => navigate('/math')} onReplay={() => { setStep(0); setDone(false); }} starsEarned={8} nextPath="/math/games/number-match" nextLabel="Number Match" />
    </div>
  );
}
