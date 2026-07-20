import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Volume2 } from 'lucide-react';
import { useStore, useActiveProfile } from '../../../store/useStore';
import { useAudio } from '../../../hooks/useAudio';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceMic } from '../../../components/VoiceMic';

const ANIMALS = [
  { word: 'cat', emoji: '🐱', hint: 'Meow!' },
  { word: 'dog', emoji: '🐶', hint: 'Woof!' },
  { word: 'lion', emoji: '🦁', hint: 'Roar!' },
  { word: 'elephant', emoji: '🐘', hint: 'Trumpet!' },
  { word: 'monkey', emoji: '🐒', hint: 'Ooh ooh aah aah!' }
];

export default function SpeakTheAnimal() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  
  const { addScore } = useStore();
  const profile = useActiveProfile();
  const { playCheer, playBoop, speak } = useAudio();

  const currentAnimal = ANIMALS[currentIndex];
  
  const handleResult = (transcript: string) => {
    const spokenText = transcript.toLowerCase().trim();
    console.log("Heard:", spokenText);
    
    // We do a loose include match because kids might say "A cat" or "It's a cat"
    if (spokenText.includes(currentAnimal.word)) {
      setFeedback('success');
      playCheer();
      speak(`Great job! It is a ${currentAnimal.word}!`);
      addScore(30);
      
      setTimeout(() => {
        setFeedback('idle');
        setShowHint(false);
        if (currentIndex < ANIMALS.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setCurrentIndex(0); // Loop or end game
        }
      }, 2500);
    } else {
      setFeedback('wrong');
      playBoop();
      setShowHint(true);
      speak(`Not quite. You said ${spokenText}. Try saying ${currentAnimal.word}!`);
      
      setTimeout(() => {
        setFeedback('idle');
      }, 2000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-12">
        <Link to="/english" className="back-btn"><ArrowLeft className="w-5 h-5" /> Back</Link>
        <div className="score-badge">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-400" />
          <span className="text-xl font-bold">{profile?.userScore || 0}</span>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 drop-shadow-md text-center">
        Speak The Animal!
      </h1>
      <p className="text-slate-600 dark:text-slate-300 font-bold text-xl mb-12 text-center">
        Press the mic and say the animal's name in English!
      </p>

      <div className="hub-card bg-emerald-100/50 dark:bg-emerald-900/30 w-full max-w-2xl min-h-[400px] justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0, rotate: 10 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="text-[150px] md:text-[200px] leading-none mb-8 drop-shadow-2xl">
              {currentAnimal.emoji}
            </div>
            
            <VoiceMic onResult={handleResult} lang="en-US" expectedWord={currentAnimal.word} />

            <div className="mt-8 h-12 flex items-center justify-center w-full">
              {feedback === 'success' && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-600 dark:text-emerald-400 font-black text-3xl">
                  Excellent! +30 ⭐
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
                onClick={() => speak(`Say ${currentAnimal.word}!`)}
                className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-3 rounded-full border-2 border-emerald-500 shadow-sm hover:bg-emerald-100 transition-colors"
              >
                <Volume2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
