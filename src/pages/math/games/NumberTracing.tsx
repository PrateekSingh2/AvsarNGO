import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';
import { CanvasDrawer } from '../../../components/CanvasDrawer';

const NUMBERS = [
  { num: '1', audio: 'एक' },
  { num: '2', audio: 'दो' },
  { num: '3', audio: 'तीन' },
];

export default function NumberTracing() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [won, setWon] = useState(false);
  const { addScore, unlockLevel } = useStore();
  const { playCheer, speakHindi, playDing } = useAudio();
  const navigate = useNavigate();

  const current = NUMBERS[currentIdx];

  const handleNext = () => {
    if (currentIdx < NUMBERS.length - 1) {
      setCurrentIdx(i => i + 1);
      speakHindi(NUMBERS[currentIdx + 1].audio);
    } else {
      setWon(true);
      playCheer();
      addScore(15);
      // unlockLevel('math-lesson-3'); // If we have one
    }
  };

  return (
    <div className="lesson-screen px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link to="/math" className="back-btn tap-target"><ArrowLeft className="w-5 h-5" /> गणित</Link>
        <h1 className="text-2xl font-black text-white text-shadow">✍️ Number Tracing</h1>
        <div className="back-btn font-black text-yellow-300">{currentIdx + 1}/{NUMBERS.length}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full">
          <div className="text-center mb-6">
            <button onClick={() => { speakHindi(current.audio); playDing(); }} className="bg-white/30 hover:bg-white/40 px-6 py-2 rounded-full font-bold text-white shadow-sm transition-all border-2 border-white/40">
              🔊 {current.audio}
            </button>
          </div>

          <CanvasDrawer bgText={current.num} onDrawStart={() => speakHindi(current.audio)} />
          
          <div className="mt-8 text-center max-w-2xl mx-auto">
            <button onClick={handleNext} className="action-btn tap-target bg-gradient-to-r from-emerald-500 to-teal-500 text-white w-full max-w-sm shadow-xl">
              {currentIdx < NUMBERS.length - 1 ? 'Next Number →' : 'Done! 🎉'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <RewardModal isOpen={won} onClose={() => navigate('/math')} onReplay={() => { setCurrentIdx(0); setWon(false); }} starsEarned={15} />
    </div>
  );
}
