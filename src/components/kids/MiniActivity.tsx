import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../hooks/useAudio';
import { useStore } from '../../store/useStore';
import { RewardModal } from '../RewardModal';
import { MagicCard, XPBar } from './KidsUI';

export interface ActivityItem { title: string; subtitle: string; emoji: string; audio: string; lang?: 'hi-IN' | 'en-US'; }

export function MiniLesson({ backTo, backLabel, title, intro, items, rewardStars, unlockId }: { backTo: string; backLabel: string; title: string; intro: string; items: ActivityItem[]; rewardStars: number; unlockId?: string }) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const { speak, playDing, playCheer } = useAudio();
  const { addScore, unlockLevel, addXp } = useStore();
  const navigate = useNavigate();
  const current = items[index];
  const play = (item = current) => speak(item.audio, item.lang || 'en-US');
  const next = () => {
    play(); playDing();
    if (index < items.length - 1) setIndex(i => i + 1);
    else { setDone(true); playCheer(); addScore(rewardStars); addXp(rewardStars * 4); if (unlockId) unlockLevel(unlockId); }
  };
  return <section className="lesson-screen px-4 py-8 flex flex-col items-center justify-center"><div className="w-full max-w-3xl mb-5 flex items-center justify-between gap-3"><Link to={backTo} className="back-btn tap-target"><ArrowLeft className="h-5 w-5" /> {backLabel}</Link><div className="w-40"><XPBar value={Math.round(((index + 1) / items.length) * 100)} label="Progress" /></div></div><MagicCard className="w-full max-w-xl p-5 md:p-7 text-center"><p className="font-black text-violet-600">{intro}</p><h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{title}</h1><AnimatePresence mode="wait"><motion.div key={current.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}><div className="my-5 text-7xl md:text-8xl">{current.emoji}</div><h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{current.title}</h1><p className="mt-2 text-xl font-bold text-slate-600 dark:text-white/70">{current.subtitle}</p></motion.div></AnimatePresence><div className="mt-6 grid gap-3 sm:grid-cols-2"><button onClick={() => play()} className="action-btn tap-target bg-white text-slate-900 text-lg"><Volume2 className="mr-2 inline h-5 w-5" /> Listen</button><button onClick={next} className="action-btn tap-target bg-gradient-to-r from-amber-300 to-pink-400 text-slate-900 text-lg">{index < items.length - 1 ? 'Next →' : 'Claim Reward 🎉'}</button></div></MagicCard><RewardModal isOpen={done} onClose={() => navigate(backTo)} onReplay={() => { setIndex(0); setDone(false); }} starsEarned={rewardStars} /></section>;
}

export function MiniQuizGame({ backTo, backLabel, title, prompt, questions, rewardStars, unlockId }: { backTo: string; backLabel: string; title: string; prompt: string; questions: Array<{ question: string; emoji: string; answer: string; options: string[]; audio: string; lang?: 'hi-IN' | 'en-US' }>; rewardStars: number; unlockId?: string }) {
  const [index, setIndex] = useState(0); const [picked, setPicked] = useState<string | null>(null); const [done, setDone] = useState(false);
  const { speak, playDing, playBoop, playCheer } = useAudio(); const { addScore, addXp, unlockLevel } = useStore(); const navigate = useNavigate(); const q = questions[index];
  const choose = (option: string) => { setPicked(option); const correct = option === q.answer; speak(correct ? 'Wonderful! Great thinking.' : 'Good try. Choose another one.', q.lang || 'en-US'); if (correct) playDing(); else playBoop(); if (correct) setTimeout(() => { if (index < questions.length - 1) { setIndex(i => i + 1); setPicked(null); } else { setDone(true); playCheer(); addScore(rewardStars); addXp(rewardStars * 5); if (unlockId) unlockLevel(unlockId); } }, 700); };
  return <section className="lesson-screen px-4 py-8 flex flex-col items-center justify-center"><div className="w-full max-w-3xl mb-5 flex items-center justify-between gap-3"><Link to={backTo} className="back-btn tap-target"><ArrowLeft className="h-5 w-5" /> {backLabel}</Link><div className="w-40"><XPBar value={Math.round(((index + 1) / questions.length) * 100)} label="Game" /></div></div><MagicCard className="w-full max-w-2xl p-5 md:p-7 text-center"><p className="font-black text-emerald-600">{prompt}</p><h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{title}</h1><div className="my-5 text-7xl">{q.emoji}</div><h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{q.question}</h1><button onClick={() => speak(q.audio, q.lang || 'en-US')} className="mt-4 rounded-full bg-white/80 px-4 py-2 font-black text-slate-800"><Volume2 className="mr-2 inline h-5 w-5" /> Hear clue</button><div className="mt-6 grid gap-3 sm:grid-cols-2">{q.options.map(o => <button key={o} onClick={() => choose(o)} className={`tap-target rounded-2xl p-4 text-xl font-black shadow ${picked === o ? (o === q.answer ? 'bg-emerald-300' : 'bg-amber-300') : 'bg-white/80 text-slate-900 hover:bg-sky-100'}`}>{o}</button>)}</div></MagicCard><RewardModal isOpen={done} onClose={() => navigate(backTo)} onReplay={() => { setIndex(0); setPicked(null); setDone(false); }} starsEarned={rewardStars} /></section>;
}
