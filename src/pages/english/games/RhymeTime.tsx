import { MiniQuizGame } from '../../../components/kids/MiniActivity';
export default function RhymeTime() { return <MiniQuizGame backTo="/english" backLabel="English" title="Rhyme Time" prompt="Pick the word that sounds the same at the end." rewardStars={18} questions={[
  { question: 'What rhymes with cat?', emoji: '🐱', answer: 'hat', options: ['sun','hat','dog','pen'], audio: 'What rhymes with cat?' },
  { question: 'What rhymes with bee?', emoji: '🐝', answer: 'tree', options: ['tree','ball','fish','cup'], audio: 'What rhymes with bee?' },
  { question: 'What rhymes with star?', emoji: '⭐', answer: 'car', options: ['book','car','moon','apple'], audio: 'What rhymes with star?' },
]} />; }
