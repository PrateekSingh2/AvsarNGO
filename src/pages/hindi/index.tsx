import { SubjectWorld } from '../../components/kids/SubjectWorld';
import type { SubjectEntry } from '../../components/kids/SubjectWorld';
import { usePageAudio } from '../../hooks/usePageAudio';
const lessons: SubjectEntry[] = [
  { id: 'hindi-lesson-1', label: 'स्वर', sublabel: 'Swar Vowels', path: '/hindi/lessons/1', emoji: 'अ', type: 'lesson' },
  { id: 'hindi-lesson-2', label: 'व्यंजन', sublabel: 'Vyanjan Consonants', path: '/hindi/lessons/2', emoji: 'क', type: 'lesson' },
  { id: 'hindi-lesson-3', label: 'शब्द', sublabel: 'First Words', path: '/hindi/lessons/3', emoji: '🏠', type: 'lesson' },
];
const games: SubjectEntry[] = [
  { id: 'hindi-game-1', label: 'स्वर ग्रिड', sublabel: 'Swar Grid', path: '/hindi/games/swar-grid', emoji: '🎯', type: 'game' },
  { id: 'hindi-game-2', label: 'व्यंजन मिलाओ', sublabel: 'Vyanjan Match', path: '/hindi/games/vyasjan-match', emoji: '🃏', type: 'game' },
  { id: 'hindi-game-3', label: 'स्वर लिखो', sublabel: 'Swar Tracing', path: '/hindi/games/swar-tracing', emoji: '✍️', type: 'game' },
];
export default function HindiHub() { usePageAudio('hindi'); return <SubjectWorld title="Hindi Kingdom" subtitle="A calm, audio-rich path for स्वर, व्यंजन, first words, matching, and tracing." emoji="🕉️" scene="hindi" gradient="from-violet-400 to-fuchsia-500" lessons={lessons} games={games} />; }
