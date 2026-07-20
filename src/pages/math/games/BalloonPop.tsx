import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../../hooks/useAudio';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';

const BALLOON_COLORS = ['from-rose-400 to-red-500', 'from-sky-400 to-blue-500', 'from-emerald-400 to-green-500', 'from-yellow-300 to-amber-400', 'from-violet-400 to-purple-500'];

export default function BalloonPop() {
  const [balloons, setBalloons] = useState([1, 2, 3, 4, 5]);
  const [poppedCount, setPoppedCount] = useState(0);
  const { speakHindi, playCheer, playDing } = useAudio();
  const { addScore, unlockLevel } = useStore();
  const navigate = useNavigate();

  const handlePop = (id: number) => {
    setBalloons(prev => prev.filter(b => b !== id));
    const newCount = poppedCount + 1;
    setPoppedCount(newCount);
    playDing();
    speakHindi(String(newCount));
    if (newCount === 5) {
      setTimeout(() => { playCheer(); addScore(10); unlockLevel('math-lesson-2'); }, 600);
    }
  };

  const reset = () => { setBalloons([1,2,3,4,5]); setPoppedCount(0); };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <Link to="/math" className="back-btn"><ArrowLeft className="w-5 h-5" /> गणित</Link>
        <h1 className="text-2xl md:text-3xl font-black text-white text-shadow">🎈 गुब्बारे फोड़ो!</h1>
        <div className="glass-card px-5 py-2 text-3xl font-black text-white text-shadow min-w-[80px] text-center">
          {poppedCount}
        </div>
      </div>

      <p className="text-white/70 font-bold text-lg mb-10">गुब्बारों पर टैप करो और गिनो! (Tap & count!)</p>

      <div className="flex gap-6 md:gap-10 flex-wrap justify-center items-end min-h-[300px]">
        <AnimatePresence>
          {balloons.map((id) => (
            <motion.button
              key={id}
              initial={{ scale: 0, y: 150 }}
              animate={{ scale: 1, y: [0, -18, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                scale: { type: 'spring', bounce: 0.6 },
                y: { repeat: Infinity, duration: 2 + id * 0.3, ease: 'easeInOut' },
                exit: { duration: 0.2 }
              }}
              onClick={() => handlePop(id)}
              className={`relative w-24 h-36 md:w-32 md:h-44 rounded-full bg-gradient-to-br ${BALLOON_COLORS[id - 1]} shadow-2xl border-4 border-white/40 active:scale-90 transition-transform cursor-pointer`}
              style={{ borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%' }}
            >
              <div className="absolute top-6 left-6 w-5 h-5 bg-white/40 rounded-full" />
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white font-black text-2xl drop-shadow">{id}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <RewardModal isOpen={poppedCount === 5} onClose={() => navigate('/math')} onReplay={reset} starsEarned={10} nextPath="/math/lessons/2" nextLabel="Lesson 2 ➕" />
    </div>
  );
}
