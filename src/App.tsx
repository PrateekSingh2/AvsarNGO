import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTheme } from './theme/ThemeContext';
import { Moon, Sun, Star, Home as HomeIcon, LogOut, Trophy, BarChart3 } from 'lucide-react';
import { useStore, useActiveProfile } from './store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

import ProfileSelect from './components/ProfileSelect';
import { CanvasDrawer } from './components/CanvasDrawer';
import VirtualGarden from './pages/VirtualGarden';
import MathHub from './pages/math/index';
import EnglishHub from './pages/english/index';
import HindiHub from './pages/hindi/index';
import TrophyRoom from './pages/TrophyRoom';
import ParentDashboard from './pages/ParentDashboard';
import { AvaBubble, MagicCard, UniverseLink, XPBar } from './components/kids/KidsUI';
import { levelFromXp } from './lib/gamification';
import { audioManager } from './lib/audioManager';

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
  const [showCanvas, setShowCanvas] = useState(false);
  const xp = profile?.xp ?? profile?.userScore ?? 0;
  const level = levelFromXp(xp);
  const missions = ['Complete 1 Math Lesson', 'Complete 1 English Game', 'Practice Hindi'];
  const locations = [
    { to: '/math', emoji: '🧮', title: 'Number Island', subtitle: 'Math adventures', gradient: 'from-rose-400 to-orange-500' },
    { to: '/english', emoji: '🔤', title: 'Alphabet Forest', subtitle: 'Letters and words', gradient: 'from-emerald-400 to-teal-500' },
    { to: '/english/lessons/3', emoji: '📖', title: 'Reading Valley', subtitle: 'Story practice', gradient: 'from-sky-400 to-indigo-500' },
    { to: '/hindi', emoji: '🕉️', title: 'Hindi Kingdom', subtitle: 'स्वर और व्यंजन', gradient: 'from-violet-400 to-fuchsia-500' },
    { to: '#art', emoji: '🎨', title: 'Art Studio', subtitle: 'Draw and create', gradient: 'from-amber-300 to-pink-500' },
    { to: '/garden', emoji: '🌻', title: 'Nature Garden', subtitle: 'Grow rewards', gradient: 'from-lime-400 to-green-600' },
    { to: '/trophies', emoji: '🏆', title: 'Rewards Castle', subtitle: 'Badges and trophies', gradient: 'from-yellow-300 to-orange-500' },
  ];

  useEffect(() => { audioManager.playMusic('home'); return () => audioManager.stopMusic(); }, []);

  return <>
    <AnimatePresence>{showCanvas && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-slate-950"><button onClick={() => setShowCanvas(false)} className="absolute top-4 left-1/2 -translate-x-1/2 z-[210] action-btn bg-white">Close Studio ❌</button><CanvasDrawer fullScreen /></motion.div>}</AnimatePresence>
    <section className="px-3 py-6 md:py-10 space-y-8">
      <div className="grid lg:grid-cols-[1.25fr_.75fr] gap-6 items-stretch">
        <MagicCard className="p-6 md:p-8 overflow-hidden relative"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,.25),transparent_35%)]" /><div className="relative grid sm:grid-cols-[auto_1fr] gap-5 items-center"><motion.div animate={{ y: [0,-10,0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-8xl rounded-[2rem] bg-white/70 p-5 shadow-xl">{profile?.avatar || '🧒'}</motion.div><div><p className="text-lg font-black text-violet-600">AVSAR KIDS UNIVERSE</p><h1 className="text-4xl md:text-6xl font-black leading-tight">Welcome Back Explorer!</h1><div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 font-black"><span>Level {level.level} Explorer</span><span>⭐ {profile?.userScore ?? 0} Stars</span><span>🔥 {profile?.streak ?? 7} Day Streak</span><span>🏆 {profile?.badges?.length ?? 1} Achievements</span></div><div className="mt-5"><XPBar value={level.progress} label={`${xp} XP toward next level`} /></div><p className="mt-4 rounded-2xl bg-white/65 p-3 font-bold">Current mission: Help AVA unlock today’s treasure chest.</p></div></div></MagicCard>
        <AvaBubble><p className="text-xl">Hi, I’m AVA! Tap a magical world, listen carefully, and collect XP, stars, seeds, stickers, pets, and badges. 🌟</p></AvaBubble>
      </div>
      <div><h2 className="text-3xl font-black mb-4">Learning Universe</h2><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{locations.map((l) => l.to === '#art' ? <button key={l.title} onClick={() => { audioManager.playSound('click'); setShowCanvas(true); }} className="text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 rounded-[2rem]"><MagicCard className={`min-h-40 p-5 bg-gradient-to-br ${l.gradient}`}><div className="text-6xl">{l.emoji}</div><h3 className="mt-3 text-2xl font-black text-white">{l.title}</h3><p className="font-bold text-white/85">{l.subtitle}</p></MagicCard></button> : <UniverseLink key={l.title} {...l} />)}</div></div>
      <div className="grid lg:grid-cols-3 gap-4"><MagicCard className="p-5 lg:col-span-2"><h2 className="text-2xl font-black mb-4">Daily Missions</h2><div className="grid md:grid-cols-3 gap-3">{missions.map(m=><div key={m} className="rounded-2xl bg-white/70 p-4 font-black"><span className="text-2xl">✨</span><p>{m}</p><small>Reward: +50 XP · +10 Stars</small></div>)}</div></MagicCard><MagicCard className="p-5"><h2 className="text-2xl font-black mb-4">Continue Learning</h2><Link to="/math/lessons/1" className="block rounded-2xl bg-white/70 p-4 font-black hover:bg-yellow-100">🧮 Counting 1 to 5</Link><Link to="/english/games/letter-hunt" className="mt-3 block rounded-2xl bg-white/70 p-4 font-black hover:bg-yellow-100">🔤 Letter Hunt</Link></MagicCard></div>
    </section>
  </>;
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
        <Route path="/parents" element={<motion.div {...t}><ParentDashboard /></motion.div>} />

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
            <HomeIcon className="w-8 h-8 text-black dark:text-white" /> AVSAR Kids
          </Link>

          <div className="flex items-center gap-3">
            {profile && (
              <div className="flex items-center gap-2">
                <Link to="/trophies" className="p-3 rounded-full bg-yellow-400 text-slate-900 border-2 border-black dark:border-white shadow-sm hover:-translate-y-1 hover:bg-yellow-300 active:translate-y-1 transition-all" title="Trophy Room">
                  <Trophy className="w-6 h-6" />
                </Link>
                <Link to="/parents" className="p-3 rounded-full bg-sky-400 text-slate-900 border-2 border-black dark:border-white shadow-sm hover:-translate-y-1 transition-all" title="Parent Dashboard"><BarChart3 className="w-6 h-6" /></Link>
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
          AVSAR Kids &copy; 2025 · खेलो और सीखो! 🌟
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
