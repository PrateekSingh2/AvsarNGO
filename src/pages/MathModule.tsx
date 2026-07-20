import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { RewardModal } from '../components/RewardModal';

export default function MathModule() {
  const [balloons, setBalloons] = useState([1, 2, 3, 4, 5]);
  const [poppedCount, setPoppedCount] = useState(0);
  const { playCheer, speak } = useAudio();
  const addScore = useStore((state) => state.addScore);

  const handlePop = (id: number) => {
    setBalloons((prev) => prev.filter((b) => b !== id));
    const newCount = poppedCount + 1;
    setPoppedCount(newCount);
    speak(newCount.toString());

    if (newCount === 5) {
      setTimeout(() => {
        playCheer();
        speak("Yay! You counted to five!");
        addScore(10);
      }, 500);
    }
  };

  const reset = () => {
    setBalloons([1, 2, 3, 4, 5]);
    setPoppedCount(0);
  };

  return (
    <div className="p-8 min-h-[80vh] flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-12">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-kid-blue hover:text-blue-600 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
          <ArrowLeft /> Back
        </Link>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kid-red to-kid-orange">
          Count the Balloons!
        </h1>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      <div className="text-6xl font-black text-kid-purple mb-12 h-24 flex items-center justify-center bg-white/60 backdrop-blur-lg px-12 rounded-3xl shadow-xl border-4 border-white">
        {poppedCount > 0 ? poppedCount : "?"}
      </div>

      <div className="flex gap-4 md:gap-8 flex-wrap justify-center mt-12 min-h-[200px]">
        <AnimatePresence>
          {balloons.map((id) => (
            <motion.button
              key={id}
              initial={{ scale: 0, y: 100 }}
              animate={{ 
                scale: 1, 
                y: [0, -15, 0],
              }}
              transition={{ 
                y: { repeat: Infinity, duration: 2 + Math.random(), ease: "easeInOut" },
                scale: { type: 'spring', bounce: 0.5 }
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
              onClick={() => handlePop(id)}
              className={`w-24 h-32 md:w-32 md:h-40 rounded-full cursor-pointer shadow-lg active:scale-90 ${
                ['bg-kid-red', 'bg-kid-blue', 'bg-kid-green', 'bg-kid-yellow', 'bg-kid-purple'][id - 1]
              }`}
              style={{ borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%' }} // Balloon shape
            >
              <div className="w-4 h-4 bg-white/30 rounded-full ml-4 mt-4"></div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <RewardModal 
        isOpen={poppedCount === 5} 
        onClose={reset} 
        onReplay={reset} 
        starsEarned={10} 
      />
    </div>
  );
}
