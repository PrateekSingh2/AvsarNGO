import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Volume2 } from 'lucide-react';
import { useStore, useActiveProfile } from '../../../store/useStore';
import { useAudio } from '../../../hooks/useAudio';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceMic } from '../../../components/VoiceMic';

const EQUATIONS = [
  { text: '1 + 1', answer: '2', words: ['two', '2'] },
  { text: '2 + 3', answer: '5', words: ['five', '5'] },
  { text: '4 + 4', answer: '8', words: ['eight', '8'] },
  { text: '10 - 3', answer: '7', words: ['seven', '7'] },
  { text: '5 + 5', answer: '10', words: ['ten', '10'] }
];

export default function SayTheNumber() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  
  const { addScore } = useStore();
  const profile = useActiveProfile();
  const { playCheer, playBoop, speak } = useAudio();

  const currentEquation = EQUATIONS[currentIndex];
  
  const handleResult = (transcript: string) => {
    const spokenText = transcript.toLowerCase().trim();
    console.log("Heard:", spokenText);
    
    const isCorrect = currentEquation.words.some(word => spokenText.includes(word));

    if (isCorrect) {
      setFeedback('success');
      playCheer();
      speak(`Awesome! ${currentEquation.text} is ${currentEquation.answer}!`);
      addScore(30);
      
      setTimeout(() => {
        setFeedback('idle');
        setShowHint(false);
        if (currentIndex < EQUATIONS.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setCurrentIndex(0); // Loop or end game
        }
      }, 2500);
    } else {
      setFeedback('wrong');
      playBoop();
      setShowHint(true);
      speak(`You said ${spokenText}. Let's count it again!`);
      
      setTimeout(() => {
        setFeedback('idle');
      }, 2000);
    }
  };

  return (
    <div className="lesson-screen px-4 py-8 flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-12">
        <Link to="/math" className="back-btn tap-target"><ArrowLeft className="w-5 h-5" /> Back</Link>
        <div className="score-badge">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-400" />
          <span className="text-xl font-bold">{profile?.userScore || 0}</span>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 drop-shadow-md text-center">
        Say The Number!
      </h1>
      <p className="text-slate-600 dark:text-slate-300 font-bold text-xl mb-12 text-center">
        Press the mic and say the answer out loud!
      </p>

      <div className="hub-card bg-rose-100/50 dark:bg-rose-900/30 w-full max-w-2xl min-h-[400px] justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.5, opacity: 0, y: -50 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="text-[100px] md:text-[140px] font-black text-slate-800 dark:text-white leading-none mb-8 drop-shadow-md">
              {currentEquation.text}
            </div>
            
            <VoiceMic onResult={handleResult} lang="en-US" expectedWord={currentEquation.answer} />

            <div className="mt-8 h-12 flex items-center justify-center w-full">
              {feedback === 'success' && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-rose-600 dark:text-rose-400 font-black text-3xl">
                  Super! +30 ⭐
                </motion.span>
              )}
              {feedback === 'wrong' && (
                <motion.span initial={{ x: -10 }} animate={{ x: [0, -10, 10, -10, 10, 0] }} className="text-rose-500 font-black text-xl">
                  Oops! Try again!
                </motion.span>
              )}
            </div>

            {showHint && feedback !== 'success' && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => speak(`What is ${currentEquation.text}?`)}
                className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-3 rounded-full border-2 border-rose-500 shadow-sm hover:bg-rose-100 transition-colors"
              >
                <Volume2 className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
