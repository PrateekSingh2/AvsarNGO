import { Link } from 'react-router-dom';
import { useActiveProfile } from '../../store/useStore';
import { ArrowLeft, Lock, Play, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface LevelEntry { label: string; sublabel: string; path: string; id: string; emoji: string; type?: 'lesson' | 'game'; rotate?: string; }
const lessons: LevelEntry[] = [
  { id: 'hindi-lesson-1', label: 'स्वर', sublabel: 'Swar (Vowels)', path: '/hindi/lessons/1', emoji: 'अ', type: 'lesson', rotate: '-rotate-2' },
  { id: 'hindi-lesson-2', label: 'व्यंजन', sublabel: 'Vyasjan (Consonants)', path: '/hindi/lessons/2', emoji: 'क', type: 'lesson', rotate: 'rotate-3' },
  { id: 'hindi-lesson-3', label: 'शब्द', sublabel: 'First Words', path: '/hindi/lessons/3', emoji: '🏠', type: 'lesson', rotate: '-rotate-1' },
];
const games: LevelEntry[] = [
  { id: 'hindi-game-1', label: 'स्वर ग्रिड', sublabel: 'Swar Grid Game', path: '/hindi/games/swar-grid', emoji: '🎯', type: 'game', rotate: 'rotate-2' },
  { id: 'hindi-game-2', label: 'व्यंजन मिलाओ', sublabel: 'Vyasjan Match', path: '/hindi/games/vyasjan-match', emoji: '🃏', type: 'game', rotate: '-rotate-3' },
  { id: 'hindi-game-3', label: 'स्वर लिखो', sublabel: 'Swar Tracing', path: '/hindi/games/swar-tracing', emoji: '✍️', type: 'game', rotate: 'rotate-1' },
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
    <Link to={entry.path} className={`sticker-card ${entry.rotate || ''} ${entry.type === 'lesson' ? 'bg-violet-100' : 'bg-purple-100'} p-4 min-h-[140px]`}>
      <span className="text-4xl group-hover:scale-110 transition-transform mb-2 drop-shadow-md font-bold">{entry.emoji}</span>
      <p className="font-black text-slate-800 text-center leading-tight mb-1">{entry.sublabel}</p>
      <p className="text-xs font-bold text-slate-500 text-center">{entry.label}</p>
      <Play className="absolute top-2 right-2 w-5 h-5 text-violet-500 drop-shadow-sm" />
    </Link>
  );
}

export default function HindiHub() {
  const profile = useActiveProfile();
  const unlockedLevels = profile?.unlockedLevels || [];
  const isUnlocked = (id: string) => unlockedLevels.includes(id);
  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="back-btn"><ArrowLeft className="w-5 h-5" /> Home</Link>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white drop-shadow-md">अ Hindi · हिंदी</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-6 flex-1 w-full max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="hub-card bg-white/20">
          <div className="w-full flex items-center justify-center mb-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white drop-shadow-md rotate-[-2deg] bg-violet-500 px-6 py-2 rounded-2xl border-4 border-white">Learn · पढ़ो</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">{lessons.map(l => <LevelCard key={l.id} entry={l} unlocked={isUnlocked(l.id)} />)}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hub-card bg-white/20">
          <div className="w-full flex items-center justify-center mb-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white drop-shadow-md rotate-[2deg] bg-purple-500 px-6 py-2 rounded-2xl border-4 border-white">Play · खेलो</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">{games.map(g => <LevelCard key={g.id} entry={g} unlocked={isUnlocked(g.id)} />)}</div>
        </motion.div>
      </div>
    </div>
  );
}
