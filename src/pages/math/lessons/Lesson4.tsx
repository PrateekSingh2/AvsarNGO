import { MiniLesson } from '../../../components/kids/MiniActivity';
export default function MathLesson4() { return <MiniLesson backTo="/math" backLabel="Math" title="Patterns" intro="Pattern Parade" rewardStars={12} unlockId="math-game-5" items={[
  { title: 'Red, Blue, Red, Blue', subtitle: 'A repeating color pattern', emoji: '🔴🔵🔴🔵', audio: 'Red, blue, red, blue. This pattern repeats.' },
  { title: 'Small, Big, Small, Big', subtitle: 'A size pattern', emoji: '⭐ 🌟 ⭐ 🌟', audio: 'Small, big, small, big. This is a size pattern.' },
  { title: 'Circle, Square, Circle', subtitle: 'A shape pattern', emoji: '⚪ ◼️ ⚪ ◼️', audio: 'Circle, square, circle, square. What comes next?' },
]} />; }
