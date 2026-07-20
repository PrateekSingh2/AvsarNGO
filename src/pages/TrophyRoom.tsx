import { Link } from 'react-router-dom';
import { useActiveProfile } from '../store/useStore';
import { ArrowLeft, Award, Lock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const ALL_BADGES = [
  { id: 'first_lesson', title: 'First Steps', description: 'Completed your first lesson!', emoji: '🎓', color: 'bg-blue-100 dark:bg-blue-900 border-blue-400' },
  { id: 'math_whiz', title: 'Math Whiz', description: 'Completed a math game!', emoji: '🔢', color: 'bg-rose-100 dark:bg-rose-900 border-rose-400' },
  { id: 'word_master', title: 'Word Master', description: 'Completed an English game!', emoji: '🔤', color: 'bg-emerald-100 dark:bg-emerald-900 border-emerald-400' },
  { id: 'hindi_hero', title: 'Hindi Hero', description: 'Completed a Hindi game!', emoji: 'अ', color: 'bg-violet-100 dark:bg-violet-900 border-violet-400' },
  { id: 'artist', title: 'Little Artist', description: 'Used the Drawingboard!', emoji: '🎨', color: 'bg-amber-100 dark:bg-amber-900 border-amber-400' },
];

export default function TrophyRoom() {
  const profile = useActiveProfile();
  const badges = profile?.badges || [];

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 flex flex-col max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="back-btn"><ArrowLeft className="w-5 h-5" /> Home</Link>
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500 fill-yellow-400 drop-shadow-md" />
          <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white drop-shadow-sm">Trophy Room</h1>
        </div>
      </div>

      <div className="hub-card bg-white/50 dark:bg-slate-800/50 w-full p-8 md:p-12">
        <p className="text-xl font-bold text-center text-slate-600 dark:text-slate-300 mb-8">
          You have unlocked {badges.length} out of {ALL_BADGES.length} badges! Keep learning! 🌟
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {ALL_BADGES.map((badge, i) => {
            const isUnlocked = badges.includes(badge.id);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`sticker-card relative p-6 ${isUnlocked ? badge.color : 'bg-slate-200 dark:bg-slate-700 border-slate-400 grayscale opacity-70'} min-h-[180px]`}
              >
                {isUnlocked ? (
                  <div className="absolute -top-3 -right-3 bg-yellow-400 border-2 border-black rounded-full p-1 rotate-12 drop-shadow-md">
                    <Award className="w-6 h-6 text-yellow-900" />
                  </div>
                ) : (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-6 h-6 text-slate-400" />
                  </div>
                )}
                <span className="text-6xl mb-3 drop-shadow-md">{badge.emoji}</span>
                <h3 className="text-xl font-black text-slate-800 dark:text-white text-center leading-tight mb-2">
                  {isUnlocked ? badge.title : '???'}
                </h3>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 text-center">
                  {isUnlocked ? badge.description : 'Keep playing to unlock!'}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
