import { Volume2, Sparkles, Gamepad2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAudio } from '../../hooks/useAudio';
import { audioManager } from '../../lib/audioManager';

const routeCopy: Record<string, { title: string; prompt: string; speak: string; type: 'lesson' | 'game'; reward: string }> = {
  '/math/lessons/1': { title: 'Counting Quest', prompt: 'Tap each number, listen, count the apples, then move forward.', speak: 'Count with me. One, two, three, four, five.', type: 'lesson', reward: '+20 XP' },
  '/math/lessons/2': { title: 'Addition Lab', prompt: 'Put groups together and say the answer out loud.', speak: 'Addition means putting groups together.', type: 'lesson', reward: '+25 XP' },
  '/math/lessons/3': { title: 'Shape Safari', prompt: 'Tap the shape and trace its outline in the air.', speak: 'Circle, square, triangle, and star are shapes.', type: 'lesson', reward: '+25 XP' },
  '/math/games/balloon-pop': { title: 'Balloon Count', prompt: 'Pop slowly and count every balloon with AVA.', speak: 'Pop a balloon and say the number you hear.', type: 'game', reward: '+50 XP' },
  '/math/games/number-match': { title: 'Number Match', prompt: 'Match each numeral with the group that has the same count.', speak: 'Find the matching number and picture group.', type: 'game', reward: '+50 XP' },
  '/math/games/number-tracing': { title: 'Number Tracing', prompt: 'Use a big finger path and trace from top to bottom.', speak: 'Trace the number carefully.', type: 'game', reward: '+40 XP' },
  '/math/games/say-the-number': { title: 'Speak Math', prompt: 'Listen, solve, press the microphone, and say your answer.', speak: 'Solve the math problem and say the number.', type: 'game', reward: '+60 XP' },
  '/english/lessons/1': { title: 'Alphabet Explorer', prompt: 'Tap letters to hear them and collect the whole alphabet.', speak: 'A for Apple. B for Ball. Let us learn letters.', type: 'lesson', reward: '+20 XP' },
  '/english/lessons/2': { title: 'Color Parade', prompt: 'Say each color name and find something nearby with that color.', speak: 'Red, blue, green, yellow, purple, orange.', type: 'lesson', reward: '+25 XP' },
  '/english/lessons/3': { title: 'Animal Friends', prompt: 'Tap animals, listen to their names, and copy the sound.', speak: 'Cat, dog, lion, elephant, monkey.', type: 'lesson', reward: '+25 XP' },
  '/english/games/word-builder': { title: 'Word Builder', prompt: 'Drag letters into the glowing boxes in the right order.', speak: 'Drag each letter to build the word.', type: 'game', reward: '+50 XP' },
  '/english/games/letter-hunt': { title: 'Letter Hunt', prompt: 'Find the target letter and ignore the decoys.', speak: 'Look carefully and tap only the target letter.', type: 'game', reward: '+50 XP' },
  '/english/games/letter-tracing': { title: 'Letter Tracing', prompt: 'Trace letters with a steady hand and replay the sound.', speak: 'Trace the letter and say its sound.', type: 'game', reward: '+40 XP' },
  '/english/games/speak-the-animal': { title: 'Animal Speaker', prompt: 'Listen, press the microphone, and say the animal name kindly.', speak: 'Say the animal name after me.', type: 'game', reward: '+60 XP' },
  '/hindi/lessons/1': { title: 'स्वर यात्रा', prompt: 'हर स्वर पर टैप करो, सुनो, और दोहराओ।', speak: 'अ आ इ ई उ ऊ ए ऐ ओ औ', type: 'lesson', reward: '+20 XP' },
  '/hindi/lessons/2': { title: 'व्यंजन पथ', prompt: 'बड़े अक्षर को देखो, आवाज़ सुनो, फिर बोलो।', speak: 'क ख ग घ च छ ज झ', type: 'lesson', reward: '+25 XP' },
  '/hindi/lessons/3': { title: 'पहले शब्द', prompt: 'शब्द सुनो, चित्र देखो, फिर खुशी से बोलो।', speak: 'घर जल फल बस', type: 'lesson', reward: '+25 XP' },
  '/hindi/games/swar-grid': { title: 'स्वर ग्रिड', prompt: 'सभी स्वरों को ढूँढो और आवाज़ के साथ बोलो।', speak: 'स्वरों को ढूँढो और बोलो।', type: 'game', reward: '+50 XP' },
  '/hindi/games/vyasjan-match': { title: 'व्यंजन मिलान', prompt: 'हिंदी अक्षर को उसकी ध्वनि से मिलाओ।', speak: 'व्यंजन और उनकी ध्वनि को मिलाओ।', type: 'game', reward: '+50 XP' },
  '/hindi/games/swar-tracing': { title: 'स्वर लिखो', prompt: 'धीरे-धीरे ट्रेस करो और स्वर दोहराओ।', speak: 'स्वर लिखो और बोलो।', type: 'game', reward: '+40 XP' },
};

export function LearningCompanion() {
  const { pathname } = useLocation();
  const info = routeCopy[pathname];
  const { speak, speakHindi } = useAudio();
  if (!info) return null;
  const replay = () => {
    audioManager.playSound('click');
    if (pathname.startsWith('/hindi')) speakHindi(info.speak); else speak(info.speak, 'en-US');
  };
  return <motion.aside initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-5xl rounded-[2rem] border border-white/70 bg-white/85 p-3 shadow-2xl backdrop-blur-xl dark:bg-slate-950/85 md:left-auto md:right-6 md:max-w-sm" aria-live="polite"><div className="flex gap-3"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-400 to-sky-400 text-3xl shadow-lg">🦉</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-black text-amber-700">{info.reward}</span>{info.type === 'game' ? <Gamepad2 className="h-4 w-4 text-violet-500" /> : <BookOpen className="h-4 w-4 text-emerald-500" />}<h2 className="truncate font-black text-slate-900 dark:text-white">{info.title}</h2></div><p className="mt-1 text-sm font-bold text-slate-600 dark:text-white/70">{info.prompt}</p><button onClick={replay} className="mt-2 inline-flex tap-target items-center rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-4 py-2 text-sm font-black text-slate-900 shadow"><Volume2 className="mr-2 h-4 w-4" /> Replay AVA audio <Sparkles className="ml-2 h-4 w-4" /></button></div></div></motion.aside>;
}

export default LearningCompanion;
