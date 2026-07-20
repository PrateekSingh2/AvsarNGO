import { useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Draggable Letter Component
function DraggableLetter({ letter }: { letter: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${letter}`,
    data: { letter },
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="w-16 h-16 bg-kid-blue text-white font-bold text-3xl rounded-xl shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 z-10 relative"
    >
      {letter}
    </button>
  );
}

// Droppable Slot Component
function DroppableSlot({ id, expectedLetter, currentLetter }: { id: string, expectedLetter: string, currentLetter: string | null }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { expectedLetter }
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-20 h-24 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center
        ${isOver ? 'border-kid-green bg-green-50' : 'border-slate-300 bg-white/50'}
        ${currentLetter ? 'border-solid border-kid-green bg-green-100' : ''}
      `}
    >
      {currentLetter ? (
        <span className="text-4xl font-bold text-kid-green">{currentLetter}</span>
      ) : (
        <span className="text-slate-300 text-2xl">{expectedLetter}</span>
      )}
    </div>
  );
}

export default function EnglishModule() {
  const { speak, playBoop, playCheer } = useAudio();
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  
  // Word Building State
  const targetWord = "CAT";
  const [slots, setSlots] = useState<Record<string, string | null>>({
    'slot-0': null,
    'slot-1': null,
    'slot-2': null,
  });

  const handleLetterTap = (letter: string) => {
    setActiveLetter(letter);
    speak(letter, 'en-US');
    setTimeout(() => setActiveLetter(null), 500);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active) {
      const draggedLetter = active.data.current.letter;
      const expectedLetter = over.data.current.expectedLetter;
      
      if (draggedLetter === expectedLetter) {
        setSlots(prev => {
          const newSlots = { ...prev, [over.id]: draggedLetter };
          
          // Check if word is complete
          if (Object.values(newSlots).filter(Boolean).length === targetWord.length) {
            setTimeout(() => {
              playCheer();
              speak("Cat! Meow!");
            }, 300);
          } else {
            speak(draggedLetter); // Say the letter when placed correctly
          }
          
          return newSlots;
        });
      } else {
        playBoop(); // Wrong letter dropped in slot
      }
    }
  };

  return (
    <div className="p-8 min-h-[80vh] flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-kid-blue hover:text-blue-600 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
          <ArrowLeft /> Back
        </Link>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kid-green to-teal-500">
          ABC & Words
        </h1>
        <div className="w-24"></div>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-12">
        {/* Alphabet Section */}
        <section className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/60">
          <h2 className="text-2xl font-bold text-slate-700 mb-6 text-center">Tap a Letter!</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {ALPHABET.map((letter) => (
              <motion.button
                key={letter}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleLetterTap(letter)}
                className={`
                  w-12 h-12 rounded-xl text-2xl font-bold shadow-sm transition-colors border-2
                  ${activeLetter === letter ? 'bg-kid-green text-white border-kid-green scale-110' : 'bg-white text-slate-600 border-slate-200'}
                `}
              >
                {letter}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Word Building Section */}
        <section className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/60 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Spell the Word!</h2>
          <div className="text-6xl mb-8">🐱</div>
          
          <DndContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 mb-12">
              {targetWord.split('').map((char, index) => (
                <DroppableSlot 
                  key={`slot-${index}`} 
                  id={`slot-${index}`} 
                  expectedLetter={char} 
                  currentLetter={slots[`slot-${index}`]} 
                />
              ))}
            </div>

            <div className="flex gap-6 p-4 bg-slate-100/50 rounded-2xl">
              {/* Show only letters that haven't been placed yet, and maybe some random decoys */}
              {['T', 'C', 'A'].map(letter => {
                 // Hide if it's already in a slot
                 const isPlaced = Object.values(slots).includes(letter);
                 if (isPlaced) return <div key={`empty-${letter}`} className="w-16 h-16" />;
                 return <DraggableLetter key={letter} letter={letter} />;
              })}
            </div>
          </DndContext>
        </section>
      </div>
    </div>
  );
}
