import { MiniQuizGame } from '../../../components/kids/MiniActivity';
export default function ShapeSort() { return <MiniQuizGame backTo="/math" backLabel="Math" title="Shape Sort" prompt="Sort the shape into the right family." rewardStars={18} questions={[
  { question: 'Which shape has three sides?', emoji: '🔺', answer: 'Triangle', options: ['Circle','Triangle','Square','Star'], audio: 'Which shape has three sides?' },
  { question: 'Which one is round?', emoji: '⚪', answer: 'Circle', options: ['Circle','Rectangle','Triangle','Diamond'], audio: 'Which shape is round?' },
  { question: 'Which shape looks like a box?', emoji: '🟦', answer: 'Square', options: ['Oval','Star','Square','Circle'], audio: 'Which shape looks like a box?' },
]} />; }
