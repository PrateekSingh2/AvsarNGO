import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';
import { CanvasDrawer } from '../../../components/CanvasDrawer';

const SWAR = [
  { char: 'अ', audio: 'a' },
  { char: 'आ', audio: 'aa' },
  { char: 'इ', audio: 'i' },
];

export default function SwarTracing() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [won, setWon] = useState(false);
  const { addScore, unlockLevel } = useStore();
  const { playCheer, speakHindi, playDing } = useAudio();
  const navigate = useNavigate();

  const current = SWAR[currentIdx];

  const handleNext = () => {
    if (currentIdx < SWAR.length - 1) {
      setCurrentIdx(i => i + 1);
      speakHindi(SWAR[currentIdx + 1].char);
    } else {
      setWon(true);
      playCheer();
      addScore(15);
      // unlockLevel('hindi-lesson-3');
    }
  };

  return (
    <div className="lesson-screen px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link to="/hindi" className="back-btn tap-target"><ArrowLeft className="w-5 h-5" /> हिंदी</Link>
        <h1 className="text-2xl font-black text-white text-shadow">✍️ स्वर Tracing</h1>
        <div className="back-btn font-black text-yellow-300">{currentIdx + 1}/{SWAR.length}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full">
          <div className="text-center mb-6">
            <button onClick={() => { speakHindi(current.char); playDing(); }} className="bg-white/30 hover:bg-white/40 px-6 py-2 rounded-full font-bold text-white shadow-sm transition-all border-2 border-white/40">
              🔊 Listen
            </button>
          </div>

          <CanvasDrawer bgText={current.char} onDrawStart={() => speakHindi(current.char)} />
          
          <div className="mt-8 text-center max-w-2xl mx-auto">
            <button onClick={handleNext} className="action-btn tap-target bg-gradient-to-r from-violet-500 to-purple-600 text-white w-full max-w-sm shadow-xl">
              {currentIdx < SWAR.length - 1 ? 'अगला अक्षर →' : 'शाबाश! 🎉'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <RewardModal isOpen={won} onClose={() => navigate('/hindi')} onReplay={() => { setCurrentIdx(0); setWon(false); }} starsEarned={15} />
    </div>
  );
}
