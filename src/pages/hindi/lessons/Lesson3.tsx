import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';

const WORDS = [
  { word: 'घर', eng: 'House', emoji: '🏠' },
  { word: 'जल', eng: 'Water', emoji: '💧' },
  { word: 'फल', eng: 'Fruit', emoji: '🍎' },
  { word: 'बस', eng: 'Bus', emoji: '🚌' },
];

export default function HindiLesson3() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const { addScore, unlockLevel } = useStore();
  const { playCheer, playDing, speakHindi } = useAudio();
  const navigate = useNavigate();
  const item = WORDS[current];

  const handleNext = () => {
    speakHindi(item.word);
    playDing();
    if (current < WORDS.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setDone(true);
      playCheer();
      addScore(10);
      unlockLevel('hindi-game-3'); // Unlocks SwarTracing
    }
  };

  return (
    <div className="lesson-screen px-4 py-8 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link to="/hindi" className="back-btn tap-target"><ArrowLeft className="w-5 h-5" /> हिंदी</Link>
      </div>

      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-white/70 text-sm mb-2 font-bold">
          <span>पाठ 3: शब्द (Words)</span><span>{current + 1} / {WORDS.length}</span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full" animate={{ width: `${((current + 1) / WORDS.length) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
          className="glass-card p-10 text-center w-full max-w-sm"
        >
          <motion.div
            className="text-[120px] leading-none mb-6 cursor-pointer drop-shadow-2xl animate-float-slow"
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => speakHindi(item.word)}
          >
            {item.emoji}
          </motion.div>
          <h2 className="text-5xl font-black text-white mb-2 text-shadow">{item.word}</h2>
          <p className="text-white/70 text-2xl font-bold mb-8">{item.eng}</p>
          <button onClick={handleNext} className="action-btn tap-target bg-gradient-to-r from-violet-500 to-purple-600 text-white w-full">
            {current < WORDS.length - 1 ? 'अगला →' : 'शाबाश! 🎉'}
          </button>
        </motion.div>
      </AnimatePresence>

      <RewardModal isOpen={done} onClose={() => navigate('/hindi')} onReplay={() => { setCurrent(0); setDone(false); }} starsEarned={10} nextPath="/hindi/games/swar-tracing" nextLabel="Tracing ✍️" />
    </div>
  );
}
