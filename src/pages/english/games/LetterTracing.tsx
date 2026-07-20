import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';
import { CanvasDrawer } from '../../../components/CanvasDrawer';

const LETTERS = [
  { char: 'A', audio: 'A' },
  { char: 'B', audio: 'B' },
  { char: 'C', audio: 'C' },
];

export default function LetterTracing() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [won, setWon] = useState(false);
  const { addScore, unlockLevel } = useStore();
  const { playCheer, speakEnglish, playDing } = useAudio();
  const navigate = useNavigate();

  const current = LETTERS[currentIdx];

  const handleNext = () => {
    if (currentIdx < LETTERS.length - 1) {
      setCurrentIdx(i => i + 1);
      speakEnglish(LETTERS[currentIdx + 1].audio);
    } else {
      setWon(true);
      playCheer();
      addScore(15);
      // unlockLevel('english-lesson-3');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link to="/english" className="back-btn"><ArrowLeft className="w-5 h-5" /> English</Link>
        <h1 className="text-2xl font-black text-white text-shadow">✍️ Letter Tracing</h1>
        <div className="back-btn font-black text-yellow-300">{currentIdx + 1}/{LETTERS.length}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full">
          <div className="text-center mb-6">
            <button onClick={() => { speakEnglish(current.audio); playDing(); }} className="bg-white/30 hover:bg-white/40 px-6 py-2 rounded-full font-bold text-white shadow-sm transition-all border-2 border-white/40">
              🔊 Listen
            </button>
          </div>

          <CanvasDrawer bgText={current.char} onDrawStart={() => speakEnglish(current.audio)} />
          
          <div className="mt-8 text-center max-w-2xl mx-auto">
            <button onClick={handleNext} className="action-btn bg-gradient-to-r from-emerald-500 to-teal-500 text-white w-full max-w-sm shadow-xl">
              {currentIdx < LETTERS.length - 1 ? 'Next Letter →' : 'Done! 🎉'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <RewardModal isOpen={won} onClose={() => navigate('/english')} onReplay={() => { setCurrentIdx(0); setWon(false); }} starsEarned={15} />
    </div>
  );
}
