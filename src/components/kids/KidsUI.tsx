import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { audioManager } from '../../lib/audioManager';

export function XPBar({ value, label }: { value: number; label?: string }) {
  return <div className="w-full" aria-label={label || `XP progress ${value}%`}><div className="flex justify-between text-xs font-black text-slate-600 mb-1"><span>{label || 'XP Progress'}</span><span>{value}%</span></div><div className="h-4 rounded-full bg-white/70 border-2 border-white overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full bg-gradient-to-r from-amber-300 via-orange-400 to-pink-500 rounded-full" /></div></div>;
}

export function AvaBubble({ children }: { children: React.ReactNode }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-3 rounded-[1.75rem] bg-white/80 dark:bg-slate-900/80 p-4 border border-white/70 shadow-xl"><motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-sky-400 text-3xl shadow-lg" aria-label="AVA learning guide">🦉</motion.div><div className="font-bold text-slate-700 dark:text-white">{children}</div></motion.div>;
}

export function MagicCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <motion.div whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: .98 }} onHoverStart={() => audioManager.playSound('hover')} className={`rounded-[1.75rem] border border-white/70 bg-white/55 dark:bg-slate-900/55 backdrop-blur-2xl shadow-[0_18px_60px_rgba(31,38,135,.16)] ${className}`}>{children}</motion.div>;
}

export function UniverseLink({ to, emoji, title, subtitle, gradient }: { to: string; emoji: string; title: string; subtitle: string; gradient: string }) {
  return <Link to={to} onClick={() => audioManager.playSound('navigation')} className="focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 rounded-[1.75rem]"><MagicCard className={`relative min-h-32 p-4 overflow-hidden bg-gradient-to-br ${gradient}`}><div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20 blur-xl" /><motion.div animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 3 }} className="text-5xl drop-shadow-lg">{emoji}</motion.div><h3 className="mt-3 text-xl font-black text-white drop-shadow">{title}</h3><p className="font-bold text-white/85">{subtitle}</p></MagicCard></Link>;
}
