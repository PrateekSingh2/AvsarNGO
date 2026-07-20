import { SubjectWorld } from '../../components/kids/SubjectWorld';
import type { SubjectEntry } from '../../components/kids/SubjectWorld';
import { usePageAudio } from '../../hooks/usePageAudio';
const lessons: SubjectEntry[] = [
  { id: 'english-lesson-1', label: 'A से Z तक', sublabel: 'Alphabet A to Z', path: '/english/lessons/1', emoji: '🔤', type: 'lesson' },
  { id: 'english-lesson-2', label: 'रंगों के नाम', sublabel: 'Colors in English', path: '/english/lessons/2', emoji: '🎨', type: 'lesson' },
  { id: 'english-lesson-3', label: 'जानवर', sublabel: 'Animals', path: '/english/lessons/3', emoji: '🦁', type: 'lesson' },
  { id: 'english-lesson-4', label: 'आसान शब्द', sublabel: 'Sight Words', path: '/english/lessons/4', emoji: '👀', type: 'lesson' },
];
const games: SubjectEntry[] = [
  { id: 'english-game-1', label: 'शब्द बनाओ', sublabel: 'Word Builder', path: '/english/games/word-builder', emoji: '🐱', type: 'game' },
  { id: 'english-game-2', label: 'अक्षर खोजो', sublabel: 'Letter Hunt', path: '/english/games/letter-hunt', emoji: '🔍', type: 'game' },
  { id: 'english-game-3', label: 'अक्षर लिखो', sublabel: 'Letter Tracing', path: '/english/games/letter-tracing', emoji: '✍️', type: 'game' },
  { id: 'english-game-4', label: 'जानवर बोलो', sublabel: 'Speak the Animal', path: '/english/games/speak-the-animal', emoji: '🎙️', type: 'game' },
  { id: 'english-game-5', label: 'तुक मिलाओ', sublabel: 'Rhyme Time', path: '/english/games/rhyme-time', emoji: '🎵', type: 'game' },
];
export default function EnglishHub() { usePageAudio('english'); return <SubjectWorld title="Alphabet Forest" subtitle="Listen, speak, trace, hunt letters, build words, and discover animal sounds." emoji="🔤" scene="english" gradient="from-emerald-400 to-teal-500" lessons={lessons} games={games} />; }
