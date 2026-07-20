import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

interface VoiceMicProps {
  onResult: (text: string) => void;
  lang?: string;
  expectedWord?: string; // Optional: helps with continuous listening if we want to stop early
}

export function VoiceMic({ onResult, lang = 'en-US', expectedWord }: VoiceMicProps) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as unknown as IWindow).SpeechRecognition || (window as unknown as IWindow).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Browser not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      setError("Could not hear you. Try again!");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [lang, onResult]);

  const toggleListening = () => {
    if (error === "Browser not supported") return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleListening}
        className={`p-6 rounded-full border-4 shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-colors
          ${isListening 
            ? 'bg-rose-500 border-black animate-pulse text-white' 
            : error && error !== "Browser not supported"
              ? 'bg-yellow-400 border-black text-black' 
              : error === "Browser not supported"
                ? 'bg-slate-300 border-slate-500 text-slate-500 cursor-not-allowed'
                : 'bg-white border-black text-slate-800 hover:bg-rose-100'
          }
        `}
      >
        {isListening ? (
          <Loader2 className="w-12 h-12 animate-spin" />
        ) : error === "Browser not supported" ? (
          <MicOff className="w-12 h-12" />
        ) : (
          <Mic className="w-12 h-12" />
        )}
      </motion.button>
      
      {isListening && (
        <span className="text-rose-500 font-bold animate-pulse">Listening... Speak now!</span>
      )}
      
      {error && !isListening && (
        <span className="text-amber-600 font-bold text-sm bg-yellow-100 px-3 py-1 rounded-full border-2 border-amber-300">
          {error}
        </span>
      )}
    </div>
  );
}
