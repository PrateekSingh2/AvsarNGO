import { SubjectWorld } from '../../components/kids/SubjectWorld';
import type { SubjectEntry } from '../../components/kids/SubjectWorld';
import { usePageAudio } from '../../hooks/usePageAudio';

const lessons: SubjectEntry[] = [
  { id: 'math-lesson-1', label: 'गिनती 1 से 5', sublabel: 'Count 1 to 5', path: '/math/lessons/1', emoji: '🔢', type: 'lesson' },
  { id: 'math-lesson-2', label: 'जोड़ना', sublabel: 'Addition Basics', path: '/math/lessons/2', emoji: '➕', type: 'lesson' },
  { id: 'math-lesson-3', label: 'आकार', sublabel: 'Shapes', path: '/math/lessons/3', emoji: '🔺', type: 'lesson' },
];
const games: SubjectEntry[] = [
  { id: 'math-game-1', label: 'गुब्बारे फोड़ो', sublabel: 'Balloon Pop', path: '/math/games/balloon-pop', emoji: '🎈', type: 'game' },
  { id: 'math-game-2', label: 'संख्या मिलाओ', sublabel: 'Number Match', path: '/math/games/number-match', emoji: '🃏', type: 'game' },
  { id: 'math-game-3', label: 'संख्या लिखो', sublabel: 'Number Tracing', path: '/math/games/number-tracing', emoji: '✍️', type: 'game' },
  { id: 'math-game-4', label: 'संख्या बोलो', sublabel: 'Say The Number', path: '/math/games/say-the-number', emoji: '🎙️', type: 'game' },
];
export default function MathHub() { usePageAudio('math'); return <SubjectWorld title="Number Island" subtitle="Adventure through counting, addition, shapes, tracing, and speaking challenges." emoji="🧮" scene="math" gradient="from-rose-400 to-orange-500" lessons={lessons} games={games} />; }
