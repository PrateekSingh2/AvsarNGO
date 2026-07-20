import { MiniQuizGame } from '../../../components/kids/MiniActivity';
export default function ShabdMatch() { return <MiniQuizGame backTo="/hindi" backLabel="हिंदी" title="शब्द मिलान" prompt="सही चित्र वाला शब्द चुनो।" rewardStars={18} questions={[
  { question: '🏠 का सही शब्द क्या है?', emoji: '🏠', answer: 'घर', options: ['जल','घर','फल','बस'], audio: 'घर', lang: 'hi-IN' },
  { question: '💧 का सही शब्द क्या है?', emoji: '💧', answer: 'जल', options: ['फल','बस','जल','घर'], audio: 'जल', lang: 'hi-IN' },
  { question: '🍎 का सही शब्द क्या है?', emoji: '🍎', answer: 'फल', options: ['घर','फल','जल','बस'], audio: 'फल', lang: 'hi-IN' },
]} />; }
