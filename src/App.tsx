import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTheme } from './theme/ThemeContext';
import { Moon, Sun, Star, Home as HomeIcon, LogOut, Trophy } from 'lucide-react';
import { useStore, useActiveProfile } from './store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

import ProfileSelect from './components/ProfileSelect';
import { CanvasDrawer } from './components/CanvasDrawer';
import VirtualGarden from './pages/VirtualGarden';
import MathHub from './pages/math/index';
import EnglishHub from './pages/english/index';
import HindiHub from './pages/hindi/index';
import TrophyRoom from './pages/TrophyRoom';

// Math
import MathLesson1 from './pages/math/lessons/Lesson1';
import MathLesson2 from './pages/math/lessons/Lesson2';
import MathLesson3 from './pages/math/lessons/Lesson3';
import BalloonPop from './pages/math/games/BalloonPop';
import NumberMatch from './pages/math/games/NumberMatch';
import NumberTracing from './pages/math/games/NumberTracing';
import SayTheNumber from './pages/math/games/SayTheNumber';

// English
import EnglishLesson1 from './pages/english/lessons/Lesson1';
import EnglishLesson2 from './pages/english/lessons/Lesson2';
import EnglishLesson3 from './pages/english/lessons/Lesson3';
import WordBuilder from './pages/english/games/WordBuilder';
import LetterHunt from './pages/english/games/LetterHunt';
import LetterTracing from './pages/english/games/LetterTracing';
import SpeakTheAnimal from './pages/english/games/SpeakTheAnimal';

// Hindi
import HindiLesson1 from './pages/hindi/lessons/Lesson1';
import HindiLesson2 from './pages/hindi/lessons/Lesson2';
import HindiLesson3 from './pages/hindi/lessons/Lesson3';
import SwarGrid from './pages/hindi/games/SwarGrid';
import VyasjanMatch from './pages/hindi/games/VyasjanMatch';
import SwarTracing from './pages/hindi/games/SwarTracing';

const Decoration = () => (
  <>
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="absolute top-[-8%] left-[-5%] w-80 h-80 bg-white/20 rounded-full mix-blend-overlay blur-3xl animate-blob" />
      <div className="absolute top-[30%] right-[-8%] w-96 h-96 bg-yellow-300/20 rounded-full mix-blend-overlay blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[25%] w-80 h-80 bg-pink-300/20 rounded-full mix-blend-overlay blur-3xl animate-blob animation-delay-4000" />
      {/* Floating emojis background */}
      <span className="absolute top-[12%] left-[8%] text-4xl opacity-20 animate-float-slow select-none">⭐</span>
      <span className="absolute top-[25%] right-[12%] text-3xl opacity-20 animate-float select-none">🌈</span>
      <span className="absolute bottom-[20%] left-[5%] text-4xl opacity-20 animate-float-fast select-none">🎈</span>
      <span className="absolute bottom-[30%] right-[8%] text-3xl opacity-20 animate-float-slow select-none">🚀</span>
      <span className="absolute top-[60%] left-[45%] text-2xl opacity-15 animate-float select-none">✨</span>
    </div>
  </>
);

const Home = () => {
  const profile = useActiveProfile();
  const userScore = profile?.userScore || 0;
  const [showCanvas, setShowCanvas] = useState(false);
  const subjects = [
    { to: '/math', emoji: '🔢', label: 'गणित', sublabel: 'Math', from: 'from-rose-500', to2: 'to-pink-600', border: 'border-rose-700', shadow: 'rgba(244,63,94,0.4)', rotate: '-rotate-3' },
    { to: '/english', emoji: '🔤', label: 'अंग्रेज़ी', sublabel: 'English', from: 'from-emerald-500', to2: 'to-teal-500', border: 'border-emerald-700', shadow: 'rgba(16,185,129,0.4)', rotate: 'rotate-2' },
    { to: '/hindi', emoji: 'अ', label: 'हिंदी', sublabel: 'Hindi', from: 'from-violet-500', to2: 'to-purple-600', border: 'border-violet-700', shadow: 'rgba(139,92,246,0.4)', rotate: '-rotate-2' },
    { to: '/garden', emoji: '🌻', label: 'बगीचा', sublabel: 'Garden', from: 'from-amber-400', to2: 'to-orange-500', border: 'border-amber-600', shadow: 'rgba(245,158,11,0.4)', rotate: 'rotate-3' },
  ];

  return (
    <>
      <AnimatePresence>
        {showCanvas && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col w-full h-full"
          >
            <div className="absolute top-4 left-4 z-[210] flex items-center gap-4">
              <h2 className="text-3xl font-black text-white dark:text-black drop-shadow-md">🎨 Drawingboard</h2>
            </div>
            <button onClick={() => setShowCanvas(false)} className="absolute top-4 left-1/2 -translate-x-1/2 z-[210] back-btn bg-rose-500 text-white shadow-[6px_6px_0px_rgba(0,0,0,1)]">Close ❌</button>
            <CanvasDrawer fullScreen={true} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 text-center"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.55, delay: 0.1 }}
        className="mb-4"
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white drop-shadow-md mb-2">
          🎓 EduPlay
        </h1>
        <p className="text-slate-700 dark:text-white/80 text-xl font-semibold">खेलो, सीखो, बढ़ो!</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
        className="score-badge mb-10"
      >
        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow animate-pulse" />
        <span className="text-2xl font-black text-amber-600 dark:text-yellow-300">{userScore} तारे!</span>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl">
        {subjects.map((s, i) => (
          <Link key={s.to} to={s.to} className="group">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i + 0.4, type: "spring", bounce: 0.4 }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              whileTap={{ scale: 0.95 }}
              className={`sticker-card ${s.rotate} bg-gradient-to-br ${s.from} ${s.to2} p-6 md:p-8 min-h-[180px] md:min-h-[220px]`}
            >
              <span className="text-5xl md:text-7xl mb-3 block drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
                {s.emoji}
              </span>
              <p className="text-white font-black text-lg md:text-2xl drop-shadow">{s.sublabel}</p>
              <p className="text-white/70 font-bold text-sm md:text-base">{s.label}</p>
            </motion.div>
          </Link>
        ))}
      </div>
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}
        onClick={() => setShowCanvas(true)}
        className="mt-12 bg-white dark:bg-slate-800 px-10 py-5 rounded-full font-black text-slate-900 dark:text-white text-2xl border-4 border-black dark:border-white shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:bg-yellow-100 dark:hover:bg-yellow-900"
      >
        🎨 Open Drawingboard!
      </motion.button>
    </motion.div>
    </>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const t = { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 }, transition: { duration: 0.28 } };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/garden" element={<motion.div {...t}><VirtualGarden /></motion.div>} />
        <Route path="/trophies" element={<motion.div {...t}><TrophyRoom /></motion.div>} />

        {/* MATH */}
        <Route path="/math" element={<motion.div {...t}><MathHub /></motion.div>} />
        <Route path="/math/lessons/1" element={<motion.div {...t}><MathLesson1 /></motion.div>} />
        <Route path="/math/lessons/2" element={<motion.div {...t}><MathLesson2 /></motion.div>} />
        <Route path="/math/lessons/3" element={<motion.div {...t}><MathLesson3 /></motion.div>} />
        <Route path="/math/games/balloon-pop" element={<motion.div {...t}><BalloonPop /></motion.div>} />
        <Route path="/math/games/number-match" element={<motion.div {...t}><NumberMatch /></motion.div>} />
        <Route path="/math/games/number-tracing" element={<motion.div {...t}><NumberTracing /></motion.div>} />
        <Route path="/math/games/say-the-number" element={<motion.div {...t}><SayTheNumber /></motion.div>} />

        {/* ENGLISH */}
        <Route path="/english" element={<motion.div {...t}><EnglishHub /></motion.div>} />
        <Route path="/english/lessons/1" element={<motion.div {...t}><EnglishLesson1 /></motion.div>} />
        <Route path="/english/lessons/2" element={<motion.div {...t}><EnglishLesson2 /></motion.div>} />
        <Route path="/english/lessons/3" element={<motion.div {...t}><EnglishLesson3 /></motion.div>} />
        <Route path="/english/games/word-builder" element={<motion.div {...t}><WordBuilder /></motion.div>} />
        <Route path="/english/games/letter-hunt" element={<motion.div {...t}><LetterHunt /></motion.div>} />
        <Route path="/english/games/letter-tracing" element={<motion.div {...t}><LetterTracing /></motion.div>} />
        <Route path="/english/games/speak-the-animal" element={<motion.div {...t}><SpeakTheAnimal /></motion.div>} />

        {/* HINDI */}
        <Route path="/hindi" element={<motion.div {...t}><HindiHub /></motion.div>} />
        <Route path="/hindi/lessons/1" element={<motion.div {...t}><HindiLesson1 /></motion.div>} />
        <Route path="/hindi/lessons/2" element={<motion.div {...t}><HindiLesson2 /></motion.div>} />
        <Route path="/hindi/lessons/3" element={<motion.div {...t}><HindiLesson3 /></motion.div>} />
        <Route path="/hindi/games/swar-grid" element={<motion.div {...t}><SwarGrid /></motion.div>} />
        <Route path="/hindi/games/vyasjan-match" element={<motion.div {...t}><VyasjanMatch /></motion.div>} />
        <Route path="/hindi/games/swar-tracing" element={<motion.div {...t}><SwarTracing /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const { theme, toggleTheme } = useTheme();
  const profile = useActiveProfile();
  const userScore = profile?.userScore || 0;
  const activeProfileId = useStore(state => state.activeProfileId);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <Decoration />
        
        {!activeProfileId && <ProfileSelect />}

        <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b-4 border-black dark:border-white">
          <Link to="/" className="flex items-center gap-2 font-black text-2xl text-black dark:text-white cursor-pointer hover:scale-105 transition-transform">
            <HomeIcon className="w-8 h-8 text-black dark:text-white" /> EduPlay
          </Link>

          <div className="flex items-center gap-3">
            {profile && (
              <div className="flex items-center gap-2">
                <Link to="/trophies" className="p-3 rounded-full bg-yellow-400 text-slate-900 border-2 border-black dark:border-white shadow-sm hover:-translate-y-1 hover:bg-yellow-300 active:translate-y-1 transition-all" title="Trophy Room">
                  <Trophy className="w-6 h-6" />
                </Link>
                <div className="score-badge hidden sm:flex bg-white dark:bg-slate-800">
                  <span className="text-xl mr-2">{profile.avatar}</span>
                  <span className="font-bold text-black dark:text-white mr-3">{profile.name}</span>
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                  <span className="font-black text-amber-700 dark:text-yellow-300 ml-1">{userScore}</span>
                </div>
                <button
                  onClick={() => useStore.getState().setActiveProfile('')}
                  className="p-3 rounded-full bg-rose-500 text-white border-2 border-black dark:border-white shadow-sm hover:-translate-y-1 hover:bg-rose-600 active:translate-y-1 transition-all"
                  title="Switch Profile"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white dark:bg-slate-800 border-4 border-black dark:border-white hover:-translate-y-1 active:translate-y-1 transition-all"
            >
              {theme === 'light'
                ? <Moon className="w-6 h-6 text-black" />
                : <Sun className="w-6 h-6 text-yellow-300" />}
            </button>
          </div>
        </nav>

        <main className="flex-1 w-full max-w-6xl mx-auto px-2 md:px-6">
          <AnimatedRoutes />
        </main>

        <footer className="text-center py-3 text-slate-600 dark:text-white/50 text-sm font-semibold">
          EduPlay &copy; 2025 · खेलो और सीखो! 🌟
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
