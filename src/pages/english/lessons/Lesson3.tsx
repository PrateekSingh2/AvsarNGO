import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';

const ANIMALS = [
  { name: 'Cat', hindi: 'बिल्ली', emoji: '🐱' },
  { name: 'Dog', hindi: 'कुत्ता', emoji: '🐶' },
  { name: 'Elephant', hindi: 'हाथी', emoji: '🐘' },
  { name: 'Monkey', hindi: 'बंदर', emoji: '🐒' },
];

export default function EnglishLesson3() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const { addScore, unlockLevel } = useStore();
  const { playCheer, playDing, speakEnglish } = useAudio();
  const navigate = useNavigate();
  const animal = ANIMALS[current];

  const handleNext = () => {
    speakEnglish(`${animal.name}.`);
    playDing();
    if (current < ANIMALS.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setDone(true);
      playCheer();
      addScore(10);
      unlockLevel('english-game-3'); // Unlocks LetterTracing
    }
  };

  return (
    <div className="lesson-screen px-4 py-8 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link to="/english" className="back-btn tap-target"><ArrowLeft className="w-5 h-5" /> English</Link>
      </div>

      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-white/70 text-sm mb-2 font-bold">
          <span>Lesson 3: Animals</span><span>{current + 1} / {ANIMALS.length}</span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" animate={{ width: `${((current + 1) / ANIMALS.length) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, rotate: -10, scale: 0.8 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 10, scale: 0.8 }}
          className="glass-card p-10 text-center w-full max-w-sm"
        >
          <motion.div
            className="text-[120px] leading-none mb-6 cursor-pointer drop-shadow-2xl animate-blob"
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => speakEnglish(animal.name)}
          >
            {animal.emoji}
          </motion.div>
          <h2 className="text-4xl font-black text-white mb-2 text-shadow">{animal.name}</h2>
          <p className="text-white/70 text-2xl font-bold mb-8">{animal.hindi}</p>
          <button onClick={handleNext} className="action-btn tap-target bg-gradient-to-r from-emerald-500 to-teal-500 text-white w-full">
            {current < ANIMALS.length - 1 ? 'Next →' : 'Done! 🎉'}
          </button>
        </motion.div>
      </AnimatePresence>

      <RewardModal isOpen={done} onClose={() => navigate('/english')} onReplay={() => { setCurrent(0); setDone(false); }} starsEarned={10} nextPath="/english/games/letter-tracing" nextLabel="Tracing ✍️" />
    </div>
  );
}
