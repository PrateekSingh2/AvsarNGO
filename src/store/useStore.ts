import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  userScore: number;
  unlockedLevels: string[];
  ownedPlants: string[];
  badges: string[];
  xp?: number;
  streak?: number;
  completedLessons?: number;
  gamesPlayed?: number;
  inventory?: string[];
}

const DEFAULT_LEVELS = ['math-lesson-1', 'english-lesson-1', 'hindi-lesson-1'];

interface AppState {
  profiles: Profile[];
  activeProfileId: string | null;
  addProfile: (name: string, avatar: string) => void;
  setActiveProfile: (id: string) => void;
  addScore: (points: number) => void;
  addXp: (points: number) => void;
  unlockLevel: (levelId: string) => void;
  buyPlant: (plantId: string, cost: number) => boolean;
  clearPlants: () => void;
  unlockBadge: (badgeId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,

      addProfile: (name, avatar) => set((state) => {
        const newProfile: Profile = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          avatar,
          userScore: 250, // Starting bonus!
          unlockedLevels: DEFAULT_LEVELS,
          ownedPlants: [],
          badges: ['first_lesson'],
          xp: 250,
          streak: 7,
          completedLessons: 3,
          gamesPlayed: 2,
          inventory: ['starter-cape', 'sunny-theme'],
        };
        return {
          profiles: [...state.profiles, newProfile],
          activeProfileId: newProfile.id,
        };
      }),

      setActiveProfile: (id) => set({ activeProfileId: id }),

      addScore: (points) => set((state) => {
        if (!state.activeProfileId) return state;
        return {
          profiles: state.profiles.map(p =>
            p.id === state.activeProfileId ? { ...p, userScore: p.userScore + points } : p
          )
        };
      }),

      addXp: (points) => set((state) => {
        if (!state.activeProfileId) return state;
        return { profiles: state.profiles.map(p => p.id === state.activeProfileId ? { ...p, xp: (p.xp || p.userScore || 0) + points } : p) };
      }),

      unlockLevel: (levelId) => set((state) => {
        if (!state.activeProfileId) return state;
        return {
          profiles: state.profiles.map(p =>
            p.id === state.activeProfileId && !p.unlockedLevels.includes(levelId)
              ? { ...p, unlockedLevels: [...p.unlockedLevels, levelId] } : p
          )
        };
      }),

      buyPlant: (plantId, cost) => {
        const state = get();
        if (!state.activeProfileId) return false;
        
        const active = state.profiles.find(p => p.id === state.activeProfileId);
        if (active && active.userScore >= cost && !active.ownedPlants.includes(plantId)) {
          set({
            profiles: state.profiles.map(p =>
              p.id === state.activeProfileId
                ? { ...p, userScore: p.userScore - cost, ownedPlants: [...p.ownedPlants, plantId] } : p
            )
          });
          return true;
        }
        return false;
      },
      clearPlants: () => set((state) => {
        if (!state.activeProfileId) return state;
        return {
          profiles: state.profiles.map(p =>
            p.id === state.activeProfileId ? { ...p, ownedPlants: [] } : p
          )
        };
      }),
      unlockBadge: (badgeId) => set((state) => {
        if (!state.activeProfileId) return state;
        return {
          profiles: state.profiles.map(p =>
            p.id === state.activeProfileId
              ? { ...p, badges: p.badges?.includes(badgeId) ? p.badges : [...(p.badges || []), badgeId] }
              : p
          )
        };
      })
    }),
    { name: 'eduplay-storage' }
  )
);

export const useActiveProfile = () => {
  const profiles = useStore(state => state.profiles);
  const activeId = useStore(state => state.activeProfileId);
  return profiles.find(p => p.id === activeId) || null;
};
