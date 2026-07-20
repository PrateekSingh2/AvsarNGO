import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplay: () => void;
  starsEarned: number;
  nextPath?: string;
  nextLabel?: string;
}

export function RewardModal({ isOpen, onClose, onReplay, starsEarned, nextPath, nextLabel }: RewardModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.4, opacity: 0, y: 40 }}
            transition={{ type: "spring", bounce: 0.55, duration: 0.7 }}
            className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-4 border-yellow-400 w-full max-w-sm flex flex-col items-center text-center z-10"
          >
            {/* Spinning star halo */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ rotate: { duration: 5, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
              className="absolute -top-14"
            >
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full p-5 shadow-[0_0_40px_rgba(250,200,0,0.7)]">
                <Star className="w-16 h-16 text-white fill-white" />
              </div>
            </motion.div>

            <div className="mt-10 mb-6 space-y-2">
              <motion.h2
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.25, type: "spring", bounce: 0.7 }}
                className="text-4xl font-black text-slate-800 dark:text-white"
              >
                शाबाश! 🎉
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-xl font-bold text-slate-500 dark:text-slate-300"
              >
                You earned
              </motion.p>
              <motion.p
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", bounce: 0.8 }}
                className="text-5xl font-black text-yellow-500"
              >
                +{starsEarned} ⭐
              </motion.p>
            </div>

            <div className="flex gap-3 w-full mt-6">
              <button
                onClick={onReplay}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold py-4 rounded-2xl transition-colors text-lg"
              >
                <RotateCcw className="w-5 h-5" /> फिर से
              </button>
              {nextPath ? (
                <Link
                  to={nextPath}
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  {nextLabel ?? 'Next'} <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/garden"
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  🌻 बगीचा
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
