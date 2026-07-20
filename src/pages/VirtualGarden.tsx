import { useState } from 'react';
import { useStore, useActiveProfile } from '../store/useStore';
import { useAudio } from '../hooks/useAudio';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Sprout, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const realisticFarmBg = '/farm_bg.png';

const SHOP_ITEMS = [
  { id: 'sunflower', name: 'Sunflower', cost: 50, emoji: '🌻' },
  { id: 'tulip', name: 'Tulip', cost: 80, emoji: '🌷' },
  { id: 'cactus', name: 'Cactus', cost: 100, emoji: '🌵' },
  { id: 'mushroom', name: 'Mushroom', cost: 120, emoji: '🍄' },
  { id: 'rose', name: 'Rose', cost: 150, emoji: '🌹' },
  { id: 'tree', name: 'Apple Tree', cost: 300, emoji: '🍎' },
  { id: 'orange', name: 'Orange Tree', cost: 350, emoji: '🍊' },
  { id: 'evergreen', name: 'Pine Tree', cost: 500, emoji: '🌲' },
];

export default function VirtualGarden() {
  const { buyPlant, clearPlants } = useStore();
  const profile = useActiveProfile();
  const userScore = profile?.userScore || 0;
  const ownedPlants = profile?.ownedPlants || [];
  const { playCheer, playBoop, speak } = useAudio();
  const [showError, setShowError] = useState(false);

  const handleBuy = (item: typeof SHOP_ITEMS[0]) => {
    const success = buyPlant(item.id, item.cost);
    if (success) {
      playCheer();
      speak(`You planted a ${item.name}!`);
    } else {
      playBoop();
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  return (
    <div className="p-2 md:p-4 min-h-[80vh] flex flex-col items-center">
      <div className="w-full max-w-[1600px] flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <Link to="/" className="back-btn shrink-0">
          <ArrowLeft className="w-5 h-5" /> Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700 text-center flex-1">
          My Virtual Garden
        </h1>

        <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/50 px-6 py-3 rounded-[2rem] border-2 border-black dark:border-white shadow-sm shrink-0">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-400" />
          <span className="text-2xl font-black text-amber-700 dark:text-yellow-300">{userScore}</span>
        </div>
      </div>

      <div className="w-full max-w-[1600px] flex flex-col md:flex-row gap-4 lg:gap-6 mb-12 px-2 md:px-0">
        {/* Left Shop Panel */}
        <div className="flex flex-col gap-2 md:gap-3 w-full md:w-28 lg:w-36 shrink-0 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-3 rounded-3xl border-2 border-white/60 dark:border-white/10 shadow-lg justify-start h-fit">
          {SHOP_ITEMS.slice(0, 4).map((item) => (
            <ShopButton key={item.id} item={item} ownedPlants={ownedPlants} userScore={userScore} onBuy={handleBuy} />
          ))}
        </div>

        {/* The Garden Area */}
        <div 
          className="flex-1 rounded-3xl min-h-[500px] border-4 border-black dark:border-white shadow-lg relative overflow-hidden flex flex-col justify-end bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${realisticFarmBg})` }}
        >
          {/* Subtle dark overlay to ensure emojis pop */}
          <div className="absolute inset-0 bg-black/15 z-0"></div>

          {/* Clear Button */}
          {ownedPlants.length > 0 && (
            <button 
              onClick={() => { clearPlants(); playBoop(); }} 
              className="absolute top-4 left-4 z-20 bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-full border-2 border-black shadow-sm"
            >
              🧹 Clear Field
            </button>
          )}
          
          {ownedPlants.length === 0 ? (
            <div className="text-white font-black text-2xl flex flex-col items-center z-10 opacity-90 drop-shadow-md pb-12 w-full absolute top-1/2 -translate-y-1/2">
              <Sprout className="w-20 h-20 mb-2 drop-shadow-lg" />
              Your field is empty. Buy seeds!
            </div>
          ) : (
            <div className="absolute bottom-[10%] left-0 right-0 flex flex-wrap-reverse content-end items-end justify-center gap-4 w-full z-10 px-8">
              <AnimatePresence>
                {ownedPlants.map((plantId, index) => {
                  const plant = SHOP_ITEMS.find(p => p.id === plantId);
                  return plant ? (
                    <motion.div
                      key={`${plantId}-${index}`}
                      initial={{ scale: 0, y: 50 }}
                      animate={{ scale: 1, y: 0 }}
                      className="text-4xl sm:text-5xl drop-shadow-2xl translate-y-4 shrink-0"
                      whileHover={{ scale: 1.15, rotate: [-5, 5, -5, 0] }}
                    >
                      {plant.emoji}
                    </motion.div>
                  ) : null;
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right Shop Panel */}
        <div className="flex flex-col gap-2 md:gap-3 w-full md:w-28 lg:w-36 shrink-0 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-3 rounded-3xl border-2 border-white/60 dark:border-white/10 shadow-lg justify-start h-fit">
          {SHOP_ITEMS.slice(4, 8).map((item) => (
            <ShopButton key={item.id} item={item} ownedPlants={ownedPlants} userScore={userScore} onBuy={handleBuy} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-8 right-8 z-[100] bg-rose-500 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
          >
            <ShieldAlert className="w-5 h-5" /> Not enough Stars!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ShopButton Subcomponent
function ShopButton({ item, ownedPlants, userScore, onBuy }: any) {
  const isOwned = ownedPlants.includes(item.id);
  const canAfford = userScore >= item.cost;
  
  return (
    <motion.button
      whileHover={!isOwned ? { scale: 1.05 } : {}}
      whileTap={!isOwned ? { scale: 0.95 } : {}}
      onClick={() => !isOwned && onBuy(item)}
      disabled={isOwned}
      className={`
        flex flex-col items-center p-2 rounded-2xl border-2 transition-all shadow-sm
        ${isOwned 
          ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed' 
          : canAfford 
            ? 'bg-white border-black dark:border-white hover:shadow-md cursor-pointer' 
            : 'bg-white border-slate-200 opacity-80 cursor-pointer'
        }
      `}
    >
      <span className="text-3xl mb-1">{item.emoji}</span>
      <span className="font-bold text-slate-700 text-xs mb-1 text-center leading-tight">{item.name}</span>
      <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-[10px] shrink-0">
        <Star className={`w-3 h-3 ${isOwned ? 'text-slate-400' : canAfford ? 'text-yellow-500 fill-yellow-400' : 'text-slate-300'}`} />
        <span className={`font-bold ${isOwned ? 'text-slate-500' : canAfford ? 'text-amber-600' : 'text-slate-400'}`}>
          {isOwned ? 'Owned' : item.cost}
        </span>
      </div>
    </motion.button>
  );
}
