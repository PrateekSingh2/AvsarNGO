import { Link } from 'react-router-dom';
import { useActiveProfile } from '../../store/useStore';
import { ArrowLeft, Lock, Play, BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LevelEntry {
  label: string;
  sublabel: string;
  path: string;
  id: string;
  emoji: string;
  type?: 'lesson' | 'game';
  rotate?: string;
}

const lessons: LevelEntry[] = [
  { id: 'math-lesson-1', label: 'गिनती 1 से 5', sublabel: 'Count 1 to 5', path: '/math/lessons/1', emoji: '🔢', type: 'lesson', rotate: '-rotate-2' },
  { id: 'math-lesson-2', label: 'जोड़ना', sublabel: 'Addition Basics', path: '/math/lessons/2', emoji: '➕', type: 'lesson', rotate: 'rotate-3' },
  { id: 'math-lesson-3', label: 'आकार', sublabel: 'Shapes', path: '/math/lessons/3', emoji: '🔺', type: 'lesson', rotate: '-rotate-1' },
];
const games: LevelEntry[] = [
  { id: 'math-game-1', label: 'गुब्बारे फोड़ो', sublabel: 'Balloon Pop', path: '/math/games/balloon-pop', emoji: '🎈', type: 'game', rotate: 'rotate-2' },
  { id: 'math-game-2', label: 'संख्या मिलाओ', sublabel: 'Number Match', path: '/math/games/number-match', emoji: '🃏', type: 'game', rotate: '-rotate-3' },
  { id: 'math-game-3', label: 'संख्या लिखो', sublabel: 'Number Tracing', path: '/math/games/number-tracing', emoji: '✍️', type: 'game', rotate: 'rotate-1' },
  { id: 'math-game-4', label: 'संख्या बोलो', sublabel: 'Say The Number', path: '/math/games/say-the-number', emoji: '🎙️', type: 'game', rotate: '-rotate-2' },
];

function LevelCard({ entry, unlocked, owned }: { entry: LevelEntry, unlocked: boolean, owned: boolean }) {
  if (!unlocked) {
    return (
      <div className={`sticker-card bg-slate-200/50 grayscale opacity-60 p-4 min-h-[140px] border-dashed`}>
        <Lock className="w-8 h-8 text-slate-400 mb-2" />
        <p className="font-bold text-slate-500 text-center leading-tight">{entry.sublabel}</p>
      </div>
    );
  }
  return (
    <Link to={entry.path} className={`sticker-card ${entry.rotate || ''} ${entry.type === 'lesson' ? 'bg-rose-100' : 'bg-purple-100'} p-4 min-h-[140px]`}>
      <span className="text-4xl group-hover:scale-110 transition-transform mb-2 drop-shadow-md">{entry.emoji}</span>
      <p className="font-black text-slate-800 text-center leading-tight mb-1">{entry.sublabel}</p>
      <p className="text-xs font-bold text-slate-500 text-center">{entry.label}</p>
      {owned && <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-emerald-500 drop-shadow-sm" />}
    </Link>
  );
}

export default function MathHub() {
  const profile = useActiveProfile();
  const unlockedLevels = profile?.unlockedLevels || [];
  const isUnlocked = (id: string) => unlockedLevels.includes(id);

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="back-btn"><ArrowLeft className="w-5 h-5" /> Home</Link>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white drop-shadow-md">🔢 Math · गणित</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-1 w-full max-w-5xl mx-auto">
        {/* LEARN */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="hub-card bg-white/20">
          <div className="w-full flex items-center justify-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Learn · पढ़ो</h2>
              <p className="text-slate-700 dark:text-white/60 text-sm">Complete lessons to unlock games!</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            {lessons.map(l => <LevelCard key={l.id} entry={l} unlocked={isUnlocked(l.id)} owned={false} />)}
          </div>
        </motion.div>

        {/* PLAY */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hub-card bg-white/20">
          <div className="w-full flex items-center justify-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Play · खेलो</h2>
              <p className="text-slate-700 dark:text-white/60 text-sm">Finish lessons to unlock!</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            {games.map(g => <LevelCard key={g.id} entry={g} unlocked={isUnlocked(g.id)} owned={false} />)}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
