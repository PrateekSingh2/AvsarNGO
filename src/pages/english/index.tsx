import { Link } from 'react-router-dom';
import { useActiveProfile } from '../../store/useStore';
import { ArrowLeft, Lock, Play, BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LevelEntry { label: string; sublabel: string; path: string; id: string; emoji: string; type?: 'lesson' | 'game';   rotate?: string;
}
const lessons: LevelEntry[] = [
  { id: 'english-lesson-1', label: 'A से Z तक', sublabel: 'Alphabet A to Z', path: '/english/lessons/1', emoji: '🔤', type: 'lesson', rotate: 'rotate-2' },
  { id: 'english-lesson-2', label: 'रंगों के नाम', sublabel: 'Colors in English', path: '/english/lessons/2', emoji: '🎨', type: 'lesson', rotate: '-rotate-3' },
  { id: 'english-lesson-3', label: 'जानवर', sublabel: 'Animals', path: '/english/lessons/3', emoji: '🦁', type: 'lesson', rotate: 'rotate-1' },
];
const games: LevelEntry[] = [
  { id: 'english-game-1', label: 'शब्द बनाओ', sublabel: 'Word Builder', path: '/english/games/word-builder', emoji: '🐱', type: 'game', rotate: '-rotate-2' },
  { id: 'english-game-2', label: 'अक्षर खोजो', sublabel: 'Letter Hunt', path: '/english/games/letter-hunt', emoji: '🔍', type: 'game', rotate: 'rotate-3' },
  { id: 'english-game-3', label: 'अक्षर लिखो', sublabel: 'Letter Tracing', path: '/english/games/letter-tracing', emoji: '✍️', type: 'game', rotate: '-rotate-1' },
  { id: 'english-game-4', label: 'जानवर बोलो', sublabel: 'Speak the Animal', path: '/english/games/speak-the-animal', emoji: '🎙️', type: 'game', rotate: 'rotate-2' },
];

function LevelCard({ entry, unlocked }: { entry: LevelEntry, unlocked: boolean }) {
  if (!unlocked) {
    return (
      <div className={`sticker-card bg-slate-200/50 grayscale opacity-60 p-4 min-h-[140px] border-dashed`}>
        <Lock className="w-8 h-8 text-slate-400 mb-2" />
        <p className="font-bold text-slate-500 text-center leading-tight">{entry.sublabel}</p>
      </div>
    );
  }
  return (
    <Link to={entry.path} className={`sticker-card ${entry.rotate || ''} ${entry.type === 'lesson' ? 'bg-emerald-100' : 'bg-teal-100'} p-4 min-h-[140px]`}>
      <span className="text-4xl group-hover:scale-110 transition-transform mb-2 drop-shadow-md">{entry.emoji}</span>
      <p className="font-black text-slate-800 text-center leading-tight mb-1">{entry.sublabel}</p>
      <p className="text-xs font-bold text-slate-500 text-center">{entry.label}</p>
      <Play className="absolute top-2 right-2 w-5 h-5 text-emerald-500 drop-shadow-sm" />
    </Link>
  );
}

export default function EnglishHub() {
  const profile = useActiveProfile();
  const unlockedLevels = profile?.unlockedLevels || [];
  const isUnlocked = (id: string) => unlockedLevels.includes(id);
  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="back-btn"><ArrowLeft className="w-5 h-5" /> Home</Link>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white drop-shadow-md">🔤 English · अंग्रेज़ी</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-6 flex-1 w-full max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="hub-card bg-white/20">
          <div className="w-full flex items-center justify-center mb-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-shadow rotate-[-2deg] bg-emerald-500 px-6 py-2 rounded-2xl border-4 border-white">Learn · पढ़ो</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">{lessons.map(l => <LevelCard key={l.id} entry={l} unlocked={isUnlocked(l.id)} />)}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hub-card bg-white/20">
          <div className="w-full flex items-center justify-center mb-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-shadow rotate-[2deg] bg-teal-500 px-6 py-2 rounded-2xl border-4 border-white">Play · खेलो</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">{games.map(g => <LevelCard key={g.id} entry={g} unlocked={isUnlocked(g.id)} />)}</div>
        </motion.div>
      </div>
    </div>
  );
}
