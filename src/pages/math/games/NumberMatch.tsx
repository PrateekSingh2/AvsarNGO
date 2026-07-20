import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { RewardModal } from '../../../components/RewardModal';
import { useAudio } from '../../../hooks/useAudio';

const PAIRS = [
  { num: 1, emoji: '🍎' }, { num: 2, emoji: '🐝🐝' }, { num: 3, emoji: '⭐⭐⭐' },
  { num: 4, emoji: '🌸🌸🌸🌸' }, { num: 5, emoji: '🐠🐠🐠🐠🐠' },
];

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

export default function NumberMatch() {
  const { addScore, unlockLevel } = useStore();
  const { speakHindi, playDing, playBoop, playCheer } = useAudio();
  const navigate = useNavigate();

  const [cards, setCards] = useState(() => shuffle([
    ...PAIRS.map(p => ({ id: `n-${p.num}`, content: `${p.num}`, type: 'number', match: p.num, flipped: false, matched: false })),
    ...PAIRS.map(p => ({ id: `e-${p.num}`, content: p.emoji, type: 'emoji', match: p.num, flipped: false, matched: false })),
  ]));
  const [selected, setSelected] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [shakeId, setShakeId] = useState<string | null>(null);

  const matchedCount = cards.filter(c => c.matched).length;

  const handleClick = (id: string) => {
    if (selected.length === 2 || cards.find(c => c.id === id)?.matched) return;
    if (selected.includes(id)) return;

    const newSel = [...selected, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setSelected(newSel);

    if (newSel.length === 2) {
      const [a, b] = newSel.map(sid => cards.find(c => c.id === sid)!);
      setTimeout(() => {
        if (a.match === b.match && a.type !== b.type) {
          playDing();
          speakHindi(String(a.match));
          setCards(prev => prev.map(c => newSel.includes(c.id) ? { ...c, matched: true } : c));
          const nowMatched = matchedCount + 2;
          if (nowMatched === cards.length) {
            setTimeout(() => { setWon(true); playCheer(); addScore(15); unlockLevel('math-lesson-2'); }, 400);
          }
        } else {
          playBoop();
          setShakeId(newSel[1]);
          setTimeout(() => { setCards(prev => prev.map(c => newSel.includes(c.id) ? { ...c, flipped: false } : c)); setShakeId(null); }, 600);
        }
        setSelected([]);
      }, 700);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <Link to="/math" className="back-btn"><ArrowLeft className="w-5 h-5" /> गणित</Link>
        <h1 className="text-2xl md:text-3xl font-black text-white text-shadow">🃏 संख्या मिलाओ!</h1>
        <button onClick={() => setCards(shuffle([...cards.map(c => ({ ...c, flipped: false, matched: false }))]))} className="back-btn">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full max-w-3xl mb-6">
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full" animate={{ width: `${(matchedCount / cards.length) * 100}%` }} />
        </div>
        <p className="text-white/70 text-sm mt-1 font-bold">{matchedCount / 2} / {PAIRS.length} जोड़े मिले!</p>
      </div>

      <div className="grid grid-cols-5 gap-3 w-full max-w-3xl">
        {cards.map(card => (
          <motion.button
            key={card.id}
            className={`aspect-square rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black shadow-lg transition-all border-4
              ${card.matched ? 'bg-emerald-400 border-emerald-300 scale-95' : card.flipped ? 'bg-white border-white' : 'bg-white/20 border-white/30 text-white'}
              ${shakeId === card.id ? 'wrong-shake' : ''}
            `}
            onClick={() => handleClick(card.id)}
            whileHover={!card.matched && !card.flipped ? { scale: 1.08 } : {}}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {card.flipped || card.matched ? (
                <motion.span key="content" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} className={card.matched ? 'text-white' : 'text-slate-800'}>
                  {card.content}
                </motion.span>
              ) : (
                <motion.span key="back" className="text-3xl">❓</motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <RewardModal isOpen={won} onClose={() => navigate('/math')} onReplay={() => { setCards(shuffle([...cards.map(c => ({ ...c, flipped: false, matched: false }))])); setWon(false); }} starsEarned={15} />
    </div>
  );
}
