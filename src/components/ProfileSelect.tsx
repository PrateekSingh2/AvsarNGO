import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useAudio } from '../hooks/useAudio';

const AVATARS = ['🦁', '🐯', '🐰', '🐼', '🦊', '🦄', '🦖', '🦋'];

export default function ProfileSelect() {
  const profiles = useStore(state => state.profiles);
  const addProfile = useStore(state => state.addProfile);
  const setActiveProfile = useStore(state => state.setActiveProfile);
  const { playDing, playCheer } = useAudio();

  const [isCreating, setIsCreating] = useState(profiles.length === 0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const handleSelect = (id: string) => {
    playDing();
    setActiveProfile(id);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    playCheer();
    addProfile(name.trim(), avatar);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="glass-card w-full max-w-3xl p-8 md:p-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-black text-white text-shadow mb-10">
          कौन खेल रहा है? (Who's playing?)
        </h1>

        <AnimatePresence mode="wait">
          {!isCreating ? (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {profiles.map(p => (
                  <motion.button
                    key={p.id}
                    whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(p.id)}
                    className="flex flex-col items-center gap-3 bg-white/20 p-6 rounded-3xl border-4 border-white/30 hover:border-kid-green hover:bg-white/40 transition-all"
                  >
                    <span className="text-6xl">{p.avatar}</span>
                    <span className="text-xl font-bold text-white">{p.name}</span>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-8 rounded-full border-2 border-white/50 transition-all"
              >
                + नया खिलाड़ी (New Player)
              </button>
            </motion.div>
          ) : (
            <motion.form key="create" onSubmit={handleCreate} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <p className="text-white font-bold mb-4">अपना चित्र चुनो! (Pick an avatar!)</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {AVATARS.map(a => (
                    <button
                      key={a} type="button" onClick={() => setAvatar(a)}
                      className={`text-4xl p-4 rounded-2xl transition-all ${avatar === a ? 'bg-kid-yellow scale-110 shadow-lg' : 'bg-white/20 hover:bg-white/40'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <input
                  type="text"
                  placeholder="आपका नाम (Your Name)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full max-w-sm px-6 py-4 rounded-2xl text-2xl font-bold text-center text-slate-800 focus:outline-none focus:ring-4 focus:ring-kid-green"
                  maxLength={12}
                  autoFocus
                />
              </div>
              <div className="flex gap-4 justify-center">
                {profiles.length > 0 && (
                  <button type="button" onClick={() => setIsCreating(false)} className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold py-4 px-8 rounded-2xl transition-all">
                    रद्द करें (Cancel)
                  </button>
                )}
                <button type="submit" disabled={!name.trim()} className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-4 px-10 rounded-2xl shadow-lg transition-all disabled:opacity-50">
                  शुरू करें! (Start!)
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
