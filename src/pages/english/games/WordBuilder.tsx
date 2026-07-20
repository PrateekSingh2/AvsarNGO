import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../../hooks/useAudio';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { RewardModal } from '../../../components/RewardModal';

function DraggableLetter({ letter, placed }: { letter: string; placed: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `drag-${letter}`, data: { letter }
  });
  if (placed) return <div className="w-16 h-16" />;
  return (
    <motion.button
      ref={setNodeRef}
      style={{ transform: transform ? `translate3d(${transform.x}px,${transform.y}px,0)` : undefined }}
      {...listeners} {...attributes}
      className={`w-16 h-16 rounded-2xl font-black text-3xl shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing border-4 border-white/50 transition-all
        ${isDragging ? 'bg-yellow-400 scale-110 shadow-2xl z-50' : 'bg-gradient-to-br from-sky-400 to-blue-500 text-white'}`}
    >{letter}</motion.button>
  );
}

function DroppableSlot({ id, expected, current }: { id: string; expected: string; current: string | null }) {
  const { isOver, setNodeRef } = useDroppable({ id, data: { expected } });
  return (
    <div ref={setNodeRef} className={`w-20 h-24 rounded-2xl flex flex-col items-center justify-center border-4 transition-all
      ${current ? 'bg-emerald-400 border-emerald-300' : isOver ? 'bg-white/50 border-white scale-105' : 'bg-white/20 border-white/30 border-dashed'}
    `}>
      {current
        ? <span className="text-4xl font-black text-white">{current}</span>
        : <span className="text-2xl font-black text-white/40">{expected}</span>
      }
    </div>
  );
}

const WORDS = [
  { word: 'CAT', emoji: '🐱', letters: ['C', 'A', 'T'] },
  { word: 'DOG', emoji: '🐶', letters: ['D', 'G', 'O'] },
  { word: 'SUN', emoji: '☀️', letters: ['S', 'N', 'U'] },
];

export default function WordBuilder() {
  const { speakEnglish, playBoop, playDing, playCheer } = useAudio();
  const { addScore, unlockLevel } = useStore();
  const navigate = useNavigate();
  const [roundIdx, setRoundIdx] = useState(0);
  const [slots, setSlots] = useState<Record<string, string | null>>({});
  const [won, setWon] = useState(false);

  const round = WORDS[roundIdx];
  const initSlots = () => Object.fromEntries(round.word.split('').map((_, i) => [`slot-${i}`, null]));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || !active) return;
    const letter = active.data.current.letter;
    const expected = over.data.current.expected;
    if (letter === expected) {
      speakEnglish(letter);
      playDing();
      setSlots(prev => {
        const next = { ...prev, [over.id]: letter };
        if (Object.values(next).every(Boolean)) {
          speakEnglish(round.word);
          setTimeout(() => {
            if (roundIdx < WORDS.length - 1) {
              setRoundIdx(r => r + 1);
              setSlots(initSlots());
            } else {
              setWon(true);
              playCheer();
              addScore(15);
              unlockLevel('english-lesson-2');
            }
          }, 700);
        }
        return next;
      });
    } else {
      playBoop();
    }
  };

  const currentSlots = Object.keys(slots).length ? slots : initSlots();

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-xl flex justify-between items-center mb-6">
        <Link to="/english" className="back-btn"><ArrowLeft className="w-5 h-5" /> English</Link>
        <h1 className="text-2xl font-black text-white text-shadow">🐱 Word Builder</h1>
        <div className="back-btn font-black text-yellow-300">{roundIdx + 1}/{WORDS.length}</div>
      </div>

      <div className="w-full max-w-xl mb-6">
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" animate={{ width: `${((roundIdx) / WORDS.length) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={roundIdx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="glass-card p-8 w-full max-w-xl text-center">
          <div className="text-8xl mb-4 animate-float">{round.emoji}</div>
          <p className="text-white/70 font-bold text-lg mb-8">Spell the word! शब्द बनाओ!</p>

          <DndContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 justify-center mb-10">
              {round.word.split('').map((ch, i) => (
                <DroppableSlot key={`slot-${i}`} id={`slot-${i}`} expected={ch} current={currentSlots[`slot-${i}`] ?? null} />
              ))}
            </div>
            <div className="flex gap-5 justify-center bg-white/10 p-5 rounded-2xl">
              {round.letters.map(letter => (
                <DraggableLetter key={letter} letter={letter} placed={Object.values(currentSlots).includes(letter)} />
              ))}
            </div>
          </DndContext>
        </motion.div>
      </AnimatePresence>

      <RewardModal isOpen={won} onClose={() => navigate('/english')} onReplay={() => { setRoundIdx(0); setSlots(initSlots()); setWon(false); }} starsEarned={15} />
    </div>
  );
}
