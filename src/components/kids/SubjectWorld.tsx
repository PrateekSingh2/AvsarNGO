import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useActiveProfile } from '../../store/useStore';
import { AvaBubble, MagicCard, XPBar } from './KidsUI';
import { audioManager } from '../../lib/audioManager';

export interface SubjectEntry { label: string; sublabel: string; path: string; id: string; emoji: string; type?: 'lesson' | 'game'; }

export function SubjectWorld({ title, subtitle, emoji, gradient, lessons, games }: { title: string; subtitle: string; emoji: string; scene: 'math'|'english'|'hindi'; gradient: string; lessons: SubjectEntry[]; games: SubjectEntry[] }) {
  const profile = useActiveProfile();
  const unlockedLevels = profile?.unlockedLevels || [];
  const progress = Math.round((lessons.filter(l => unlockedLevels.includes(l.id)).length / lessons.length) * 100);
  const card = (entry: SubjectEntry, index: number) => {
    const unlocked = unlockedLevels.includes(entry.id);
    if (!unlocked) return <MagicCard key={entry.id} className="min-h-44 p-5 grayscale opacity-70 border-dashed flex flex-col items-center justify-center text-center"><Lock className="mb-3 h-8 w-8 text-slate-400" /><h3 className="font-black text-slate-500">{entry.sublabel}</h3><p className="text-sm font-bold text-slate-400">Complete the previous step to unlock</p></MagicCard>;
    return <Link key={entry.id} to={entry.path} onClick={() => audioManager.playSound('navigation')} className="focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 rounded-[2rem]"><MagicCard className={`relative min-h-44 p-5 overflow-hidden bg-gradient-to-br ${gradient}`}><div className="absolute right-4 top-4 rounded-full bg-white/80 p-2"><CheckCircle className="h-5 w-5 text-emerald-500" /></div><motion.div animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 2.6 + index * .2 }} className="text-6xl drop-shadow-lg">{entry.emoji}</motion.div><h3 className="mt-3 text-2xl font-black text-white drop-shadow">{entry.sublabel}</h3><p className="font-bold text-white/85">{entry.label}</p><p className="mt-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-black text-slate-700">{entry.type === 'game' ? 'Play challenge' : 'Listen & learn'}</p></MagicCard></Link>;
  };

  return <section className="px-4 py-8 space-y-6"><div className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${gradient} p-6 md:p-8 text-white shadow-2xl`}><div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-2xl" /><Link to="/" className="relative inline-flex rounded-full bg-white/85 px-4 py-2 font-black text-slate-800"><ArrowLeft className="mr-2 h-5 w-5" /> Home</Link><div className="relative mt-6 grid gap-4 md:grid-cols-[auto_1fr_.7fr] md:items-center"><motion.div animate={{ rotate: [-3, 3, -3], scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="text-8xl">{emoji}</motion.div><div><p className="font-black uppercase tracking-widest text-white/75">Learning Path</p><h1 className="text-4xl md:text-6xl font-black">{title}</h1><p className="mt-2 text-lg font-bold text-white/85">{subtitle}</p></div><div className="rounded-3xl bg-white/25 p-4 backdrop-blur"><XPBar value={progress} label="Path progress" /><p className="mt-3 font-black"><Sparkles className="mr-2 inline h-5 w-5" /> Finish lessons → mini challenge → reward chest</p></div></div></div><AvaBubble>Choose the next glowing step. Every card has friendly audio, large tap targets, and magical feedback.</AvaBubble><div className="grid gap-5 lg:grid-cols-2"><MagicCard className="p-5"><h2 className="mb-4 text-3xl font-black">Lessons Trail</h2><div className="grid gap-4 sm:grid-cols-2">{lessons.map(card)}</div></MagicCard><MagicCard className="p-5"><h2 className="mb-4 text-3xl font-black">Game Galaxy</h2><div className="grid gap-4 sm:grid-cols-2">{games.map(card)}</div></MagicCard></div></section>;
}
