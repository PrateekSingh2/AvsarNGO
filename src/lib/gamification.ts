export const levelFromXp = (xp = 0) => {
  const thresholds = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600, 6000, 7800, 10000];
  let level = 1;
  for (let i = 1; i < thresholds.length; i += 1) if (xp >= thresholds[i]) level = i + 1;
  const current = thresholds[level - 1] ?? 0;
  const next = thresholds[level] ?? current + 2500;
  return { level, current, next, progress: Math.min(100, Math.round(((xp - current) / (next - current)) * 100)) };
};

export const achievements = [
  { id: 'first_lesson', title: 'First Lesson', emoji: '🎓', description: 'Started the learning journey' },
  { id: 'math_whiz', title: 'Math Champion', emoji: '🧮', description: 'Completed a math activity' },
  { id: 'word_master', title: 'Reading Explorer', emoji: '📖', description: 'Played with English words' },
  { id: 'hindi_hero', title: 'Hindi Hero', emoji: '🕉️', description: 'Practiced Hindi learning' },
  { id: 'artist', title: 'Drawing Master', emoji: '🎨', description: 'Created art in the studio' },
  { id: 'streak_7', title: '7 Day Streak', emoji: '🔥', description: 'Kept the learning flame alive' },
];
