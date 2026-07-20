import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';

const ROUNDS = [
  { target: 'A', question: "Find all the A's!", letters: ['A', 'B', 'A', 'C', 'D', 'A', 'E', 'F', 'G', 'A', 'H', 'I'] },
  { target: 'B', question: "Spot the B's!", letters: ['C', 'B', 'D', 'B', 'E', 'B', 'A', 'F', 'G', 'B', 'H', 'I'] },
  { target: 'S', question: "Hunt the S's!", letters: ['S', 'T', 'S', 'U', 'V', 'W', 'S', 'X', 'Y', 'S', 'Z', 'A'] },
];

export default function LetterHunt() {
  const { addScore, unlockLevel } = useStore();
  const { speakEnglish, playDing, playBoop, playCheer } = useAudio();
  const navigate = useNavigate();

  const [round, setRound] = useState(0);
  const [found, setFound] = useState<number[]>([]);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const [won, setWon] = useState(false);

  const current = ROUNDS[round];
  const targetCount = current.letters.filter(l => l === current.target).length;

  const handleClick = useCallback((idx: number, letter: string) => {
    if (found.includes(idx)) return;
    if (letter === current.target) {
      speakEnglish(letter);
      playDing();
      const newFound = [...found, idx];
      setFound(newFound);
      if (newFound.length === targetCount) {
        setTimeout(() => {
          if (round < ROUNDS.length - 1) {
            setRound(r => r + 1);
            setFound([]);
          } else {
            setWon(true);
            playCheer();
            addScore(12);
            unlockLevel('english-lesson-2');
          }
        }, 500);
      }
    } else {
      playBoop();
      setShakeIdx(idx);
      setTimeout(() => setShakeIdx(null), 500);
    }
  }, [found, current, round, targetCount, speakEnglish, playDing, playBoop, playCheer, addScore, unlockLevel]);

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link to="/english" className="back-btn"><ArrowLeft className="w-5 h-5" /> English</Link>
        <h1 className="text-2xl font-black text-white text-shadow">🔍 Letter Hunt</h1>
        <div className="back-btn font-black text-yellow-300">{found.length}/{targetCount}</div>
      </div>

      {/* Progress */}
      <div className="w-full max-w-2xl mb-6">
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
            animate={{ width: `${(found.length / targetCount) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Target card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={round}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
          className="glass-card p-6 w-full max-w-2xl text-center mb-6"
        >
          <p className="text-white/70 font-bold mb-2">Round {round + 1} of {ROUNDS.length}</p>
          <p className="text-2xl font-black text-white mb-4">{current.question}</p>
          <div className="inline-block bg-white/30 rounded-2xl px-8 py-3 text-6xl font-black text-yellow-300 text-shadow">
            {current.target}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Letter grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 w-full max-w-2xl">
        {current.letters.map((letter, idx) => {
          const isFound = found.includes(idx);
          const isShaking = shakeIdx === idx;
          return (
            <motion.button
              key={`${round}-${idx}`}
              whileHover={!isFound ? { scale: 1.1 } : {}}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleClick(idx, letter)}
              className={`aspect-square rounded-2xl flex items-center justify-center text-3xl font-black shadow-md transition-all border-4
                ${isFound
                  ? 'bg-emerald-400 border-emerald-300 text-white cursor-default scale-95'
                  : isShaking
                  ? 'bg-red-400 border-red-300 text-white wrong-shake'
                  : 'bg-white/80 border-white/50 text-slate-800 hover:bg-white'
                }
              `}
            >
              {letter}
            </motion.button>
          );
        })}
      </div>

      <RewardModal
        isOpen={won}
        onClose={() => navigate('/english')}
        onReplay={() => { setRound(0); setFound([]); setWon(false); }}
        starsEarned={12}
      />
    </div>
  );
}
