import { useRef, useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

interface CanvasDrawerProps {
  bgImage?: string;
  bgText?: string;
  onDrawStart?: () => void;
  onClear?: () => void;
  fullScreen?: boolean;
}

export function CanvasDrawer({ bgImage, bgText, onDrawStart, onClear, fullScreen = false }: CanvasDrawerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { playBoop } = useAudio();

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set internal resolution higher for smooth lines
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 24; // Thick marker for kids
    
    // Pick a random fun color
    const colors = ['#FF4B4B', '#4B9FFF', '#4CAF50', '#FFC107', '#9C27B0', '#FF9800'];
    ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
      if (onDrawStart) onDrawStart();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault(); // Prevent scrolling on mobile
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      playBoop();
      if (onClear) onClear();
    }
  };

  const containerClass = fullScreen
    ? "absolute inset-0 w-full h-full bg-slate-900 dark:bg-white"
    : "relative w-full aspect-square md:aspect-video max-w-2xl mx-auto rounded-[25px_225px_15px_255px/255px_15px_225px_15px] overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,1)] border-4 border-black dark:border-white bg-slate-900 dark:bg-white";

  return (
    <div className={containerClass}>
      {/* Background Guide */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
        {bgImage ? (
          <img src={bgImage} alt="guide" className="w-full h-full object-contain p-8 invert dark:invert-0" />
        ) : bgText ? (
          <span className="text-[200px] md:text-[300px] font-black text-white dark:text-slate-900 leading-none" style={{ fontFamily: 'sans-serif' }}>
            {bgText}
          </span>
        ) : null}
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{ touchAction: 'none' }} // Crucial for mobile drawing
      />

      <button
        onClick={clearCanvas}
        className="absolute top-6 right-6 p-4 bg-white dark:bg-slate-900 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] shadow-[4px_4px_0px_rgba(0,0,0,1)] border-4 border-black dark:border-white text-black dark:text-white hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-all active:translate-y-1"
      >
        <RefreshCcw className="w-8 h-8" />
      </button>
    </div>
  );
}
