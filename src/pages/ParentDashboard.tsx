import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useActiveProfile } from '../store/useStore';
import { MagicCard } from '../components/kids/KidsUI';

export default function ParentDashboard() {
  const p = useActiveProfile();
  const stats = [
    ['Learning Time', '2h 35m', '⏰'], ['Lessons Completed', String(p?.completedLessons ?? 3), '✅'], ['Games Played', String(p?.gamesPlayed ?? 2), '🎮'], ['Achievements', String(p?.badges?.length ?? 0), '🏆'],
  ];
  return <div className="px-4 py-8"><Link to="/" className="back-btn mb-6"><ArrowLeft className="w-5 h-5" /> Home</Link><h1 className="text-4xl font-black mb-2">Parent Dashboard</h1><p className="font-bold text-slate-600 dark:text-white/70 mb-6">Gentle progress insights for parents, teachers, NGOs, and volunteers.</p><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{stats.map(([k,v,e])=><MagicCard key={k} className="p-5"><div className="text-4xl">{e}</div><div className="text-3xl font-black">{v}</div><div className="font-bold text-slate-600 dark:text-white/70">{k}</div></MagicCard>)}</div><div className="grid md:grid-cols-2 gap-4"><MagicCard className="p-6"><h2 className="text-2xl font-black mb-4">Progress by Subject</h2>{[['Math',80],['English',68],['Hindi',74],['Creativity',90]].map(([n,val])=><div key={n} className="mb-4"><div className="flex justify-between font-bold"><span>{n}</span><span>{val}%</span></div><div className="h-4 bg-white/70 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-500" style={{width:`${val}%`}} /></div></div>)}</MagicCard><MagicCard className="p-6"><h2 className="text-2xl font-black mb-4">Learning Notes</h2><div className="space-y-3 font-bold"><p>💪 Strong areas: creativity, numbers, activity completion.</p><p>🌱 Practice next: daily reading aloud and Hindi pronunciation.</p><p>✨ Recommendation: complete one mission per day to maintain streaks.</p></div></MagicCard></div></div>;
}
