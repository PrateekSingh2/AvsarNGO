import { useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const HINDI_VOWELS = [
  { char: 'अ', name: 'a' },
  { char: 'आ', name: 'aa' },
  { char: 'इ', name: 'i' },
  { char: 'ई', name: 'ii' },
  { char: 'उ', name: 'u' },
  { char: 'ऊ', name: 'uu' },
  { char: 'ए', name: 'e' },
  { char: 'ऐ', name: 'ai' },
  { char: 'ओ', name: 'o' },
  { char: 'औ', name: 'au' },
];

export default function HindiModule() {
  const { speak } = useAudio();
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const handleTap = (vowel: typeof HINDI_VOWELS[0]) => {
    setActiveLetter(vowel.char);
    // Use hi-IN for Hindi pronunciation via Web Speech API
    speak(vowel.char, 'hi-IN');
    
    setTimeout(() => setActiveLetter(null), 500);
  };

  return (
    <div className="p-8 min-h-[80vh] flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-12">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-kid-blue hover:text-blue-600 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
          <ArrowLeft /> Back
        </Link>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kid-purple to-pink-500">
          Learn Swar!
        </h1>
        <div className="w-24"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full max-w-4xl">
        {HINDI_VOWELS.map((vowel) => (
          <motion.button
            key={vowel.char}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTap(vowel)}
            className={`
              aspect-square rounded-3xl flex items-center justify-center text-6xl font-bold shadow-lg
              transition-all duration-300 border-4
              ${activeLetter === vowel.char ? 'bg-kid-yellow border-white text-kid-purple scale-110 shadow-2xl' : 'bg-white border-slate-100 text-slate-700 hover:border-kid-purple/30'}
            `}
          >
            {vowel.char}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
