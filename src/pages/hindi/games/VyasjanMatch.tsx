import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';

const PAIRS = [
  { char: 'क', roman: 'ka' }, { char: 'ख', roman: 'kha' },
  { char: 'ग', roman: 'ga' }, { char: 'घ', roman: 'gha' },
  { char: 'च', roman: 'cha' }, { char: 'ज', roman: 'ja' },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

export default function VyasjanMatch() {
  const { addScore, unlockLevel } = useStore();
  const { speakHindi, playDing, playBoop, playCheer } = useAudio();
  const navigate = useNavigate();

  const buildCards = () => shuffle([
    ...PAIRS.map(p => ({ id: `h-${p.char}`, content: p.char, match: p.char, type: 'hindi', matched: false, flipped: false })),
    ...PAIRS.map(p => ({ id: `r-${p.char}`, content: p.roman, match: p.char, type: 'roman', matched: false, flipped: false })),
  ]);

  const [cards, setCards] = useState(buildCards);
  const [selected, setSelected] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [shakeId, setShakeId] = useState<string | null>(null);

  const matchedCount = cards.filter(c => c.matched).length;

  const handleClick = (id: string) => {
    const card = cards.find(c => c.id === id);
    if (!card || card.matched || card.flipped || selected.length === 2) return;
    const newSel = [...selected, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setSelected(newSel);

    if (newSel.length === 2) {
      const [a, b] = newSel.map(sid => cards.find(c => c.id === sid)!);
      setTimeout(() => {
        if (a.match === b.match && a.type !== b.type) {
          speakHindi(a.match);
          playDing();
          setCards(prev => prev.map(c => newSel.includes(c.id) ? { ...c, matched: true } : c));
          if (matchedCount + 2 >= cards.length) {
            setTimeout(() => { setWon(true); playCheer(); addScore(20); unlockLevel('hindi-lesson-2'); }, 400);
          }
        } else {
          playBoop();
          setShakeId(newSel[1]);
          setTimeout(() => { setCards(prev => prev.map(c => newSel.includes(c.id) ? { ...c, flipped: false } : c)); setShakeId(null); }, 700);
        }
        setSelected([]);
      }, 800);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link to="/hindi" className="back-btn"><ArrowLeft className="w-5 h-5" /> हिंदी</Link>
        <h1 className="text-2xl font-black text-white text-shadow">🃏 व्यंजन Match</h1>
        <button onClick={() => { setCards(buildCards()); setSelected([]); setWon(false); }} className="back-btn">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full max-w-2xl mb-6">
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full" animate={{ width: `${(matchedCount / cards.length) * 100}%` }} />
        </div>
        <p className="text-white/60 text-sm mt-1 font-bold">{matchedCount / 2} / {PAIRS.length} जोड़े मिले!</p>
      </div>

      <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
        {cards.map(card => (
          <motion.button
            key={card.id}
            whileHover={!card.matched && !card.flipped ? { scale: 1.06 } : {}}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleClick(card.id)}
            className={`aspect-square rounded-2xl flex items-center justify-center font-black shadow-lg border-4 transition-all
              ${card.matched ? 'bg-emerald-400 border-emerald-300 text-white cursor-default' :
                card.flipped ? 'bg-white border-white' :
                'bg-white/20 border-white/30 text-white'}
              ${shakeId === card.id ? 'wrong-shake' : ''}
            `}
          >
            {card.flipped || card.matched ? (
              <span className={`${card.type === 'hindi' ? 'text-4xl' : 'text-xl'} ${card.matched ? 'text-white' : 'text-slate-800'}`}>
                {card.content}
              </span>
            ) : (
              <span className="text-3xl">❓</span>
            )}
          </motion.button>
        ))}
      </div>

      <RewardModal isOpen={won} onClose={() => navigate('/hindi')} onReplay={() => { setCards(buildCards()); setSelected([]); setWon(false); }} starsEarned={20} />
    </div>
  );
}
