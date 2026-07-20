import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';

const NUMBERS = [
  { num: 1, hindi: 'एक', emoji: '🍎' },
  { num: 2, hindi: 'दो', emoji: '🍎🍎' },
  { num: 3, hindi: 'तीन', emoji: '🍎🍎🍎' },
  { num: 4, hindi: 'चार', emoji: '🍎🍎🍎🍎' },
  { num: 5, hindi: 'पाँच', emoji: '🍎🍎🍎🍎🍎' },
];

export default function MathLesson1() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const { addScore, unlockLevel } = useStore();
  const { playCheer, playDing, speakHindi } = useAudio();
  const navigate = useNavigate();
  const item = NUMBERS[current];

  const handleNext = () => {
    speakHindi(`${item.num}. ${item.hindi}`);
    playDing();
    if (current < NUMBERS.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setDone(true);
      playCheer();
      addScore(5);
      unlockLevel('math-game-1');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link to="/math" className="back-btn"><ArrowLeft className="w-5 h-5" /> गणित</Link>
      </div>

      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-slate-700 dark:text-white/70 text-sm mb-2 font-bold">
          <span>पाठ 1: गिनती</span><span>{current + 1} / {NUMBERS.length}</span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full" animate={{ width: `${((current + 1) / NUMBERS.length) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
          className="glass-card p-8 md:p-14 text-center w-full max-w-sm"
        >
          <motion.div
            className="text-8xl md:text-[120px] font-black text-slate-900 dark:text-white drop-shadow-md mb-2 cursor-pointer"
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => speakHindi(`${item.num}. ${item.hindi}`)}
          >
            {item.num}
          </motion.div>
          <p className="text-slate-700 dark:text-white/70 text-3xl font-black mb-6">{item.hindi}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-10 text-4xl min-h-[50px] items-center">
            {item.emoji.split('').map((e, i) => (
              <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.12 }}>{e}</motion.span>
            ))}
          </div>
          <button onClick={handleNext} className="action-btn bg-gradient-to-r from-rose-500 to-pink-500 text-white w-full">
            {current < NUMBERS.length - 1 ? 'अगला →' : 'शाबाश! 🎉'}
          </button>
        </motion.div>
      </AnimatePresence>

      <RewardModal isOpen={done} onClose={() => navigate('/math')} onReplay={() => { setCurrent(0); setDone(false); }} starsEarned={5} nextPath="/math/games/balloon-pop" nextLabel="Balloon Pop 🎈" />
    </div>
  );
}
