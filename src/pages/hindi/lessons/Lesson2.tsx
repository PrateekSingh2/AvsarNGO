import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';

const VYASJAN = [
  { char: 'क', name: 'ka' }, { char: 'ख', name: 'kha' }, { char: 'ग', name: 'ga' },
  { char: 'घ', name: 'gha' }, { char: 'च', name: 'cha' }, { char: 'छ', name: 'chha' },
  { char: 'ज', name: 'ja' }, { char: 'झ', name: 'jha' }, { char: 'ट', name: 'ta' },
  { char: 'ठ', name: 'tha' }, { char: 'ड', name: 'da' }, { char: 'ढ', name: 'dha' },
];

export default function HindiLesson2() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const { addScore, unlockLevel } = useStore();
  const { playCheer, playDing, speakHindi } = useAudio();
  const navigate = useNavigate();
  const letter = VYASJAN[current];

  const handleNext = () => {
    speakHindi(letter.char);
    playDing();
    if (current < VYASJAN.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setDone(true);
      playCheer();
      addScore(8);
      unlockLevel('hindi-game-2');
    }
  };

  return (
    <div className="lesson-screen px-4 py-8 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link to="/hindi" className="back-btn tap-target"><ArrowLeft className="w-5 h-5" /> हिंदी</Link>
      </div>

      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-white/70 text-sm mb-2 font-bold">
          <span>पाठ 2: व्यंजन</span><span>{current + 1} / {VYASJAN.length}</span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full" animate={{ width: `${((current + 1) / VYASJAN.length) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: -90 }}
          transition={{ duration: 0.35 }}
          className="glass-card p-10 md:p-16 text-center w-full max-w-xs"
        >
          <motion.div
            className="text-[140px] font-black text-white text-shadow leading-none mb-4 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => speakHindi(letter.char)}
          >
            {letter.char}
          </motion.div>
          <p className="text-white/60 text-xl font-bold mb-8">({letter.name})</p>
          <button onClick={handleNext} className="action-btn tap-target bg-gradient-to-r from-violet-500 to-purple-600 text-white w-full">
            {current < VYASJAN.length - 1 ? 'अगला →' : 'शाबाश! 🎉'}
          </button>
        </motion.div>
      </AnimatePresence>

      <RewardModal isOpen={done} onClose={() => navigate('/hindi')} onReplay={() => { setCurrent(0); setDone(false); }} starsEarned={8} nextPath="/hindi/games/vyasjan-match" nextLabel="व्यंजन Match" />
    </div>
  );
}
