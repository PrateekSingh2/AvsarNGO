import { useRef, useEffect, useState } from 'react';
import { Download, RefreshCcw, RotateCcw, RotateCw, Circle, Square } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';
import { audioManager } from '../lib/audioManager';

interface CanvasDrawerProps { bgImage?: string; bgText?: string; onDrawStart?: () => void; onClear?: () => void; fullScreen?: boolean; }
const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#111827'];
const stickers = ['⭐', '🌈', '🦋', '🌻', '🚀', '🐣'];

export function CanvasDrawer({ bgImage, bgText, onDrawStart, onClear, onSave, fullScreen = false }: CanvasDrawerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const history = useRef<string[]>([]);
  const redo = useRef<string[]>([]);
  const stickerIndex = useRef(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(colors[1]);
  const [brush, setBrush] = useState(18);
  const { playBoop } = useAudio();

  const snapshot = () => { const c = canvasRef.current; if (c) { history.current.push(c.toDataURL()); redo.current = []; } };
  const restore = (data?: string) => { const c = canvasRef.current, ctx = c?.getContext('2d'); if (!c || !ctx || !data) return; const img = new Image(); img.onload = () => { ctx.clearRect(0,0,c.width,c.height); ctx.drawImage(img,0,0); }; img.src = data; };
  const initCanvas = () => { const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return; const old = canvas.toDataURL?.(); const rect = canvas.getBoundingClientRect(); canvas.width = rect.width * 2; canvas.height = rect.height * 2; ctx.scale(2, 2); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (old) restore(old); };
  useEffect(() => { initCanvas(); window.addEventListener('resize', initCanvas); return () => window.removeEventListener('resize', initCanvas); }, []);
  useEffect(() => { audioManager.playMusic('drawing'); return () => audioManager.stopMusic(); }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => { const canvas = canvasRef.current; if (!canvas) return { x: 0, y: 0 }; const rect = canvas.getBoundingClientRect(); if ('touches' in e) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }; return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top }; };
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => { snapshot(); const { x, y } = getCoordinates(e); const ctx = canvasRef.current?.getContext('2d'); if (ctx) { ctx.beginPath(); ctx.moveTo(x, y); ctx.strokeStyle = color; ctx.lineWidth = brush; setIsDrawing(true); onDrawStart?.(); } };
  const draw = (e: React.MouseEvent | React.TouchEvent) => { if (!isDrawing) return; e.preventDefault(); const { x, y } = getCoordinates(e); const ctx = canvasRef.current?.getContext('2d'); if (ctx) { ctx.lineTo(x, y); ctx.stroke(); } };
  const stopDrawing = () => { canvasRef.current?.getContext('2d')?.closePath(); setIsDrawing(false); };
  const clearCanvas = () => { const c = canvasRef.current, ctx = c?.getContext('2d'); if (c && ctx) { snapshot(); ctx.clearRect(0,0,c.width,c.height); playBoop(); onClear?.(); } };
  const undo = () => { const last = history.current.pop(); if (last) { const c = canvasRef.current; if (c) redo.current.push(c.toDataURL()); restore(last); } };
  const redoDraw = () => { const next = redo.current.pop(); if (next) { snapshot(); restore(next); } };
  const save = () => { const a = document.createElement('a'); a.download = 'avsar-art.png'; a.href = canvasRef.current?.toDataURL('image/png') || ''; a.click(); audioManager.playSound('reward'); };
  const addSticker = (emoji: string) => { const c = canvasRef.current, ctx = c?.getContext('2d'); if (!c || !ctx) return; snapshot(); ctx.font = '64px serif'; const i = stickerIndex.current++; ctx.fillText(emoji, 60 + (i * 83) % Math.max(120, c.width / 2 - 120), 120 + (i * 61) % Math.max(120, c.height / 2 - 160)); };
  const shape = (kind: 'circle'|'square') => { const ctx = canvasRef.current?.getContext('2d'); if (!ctx) return; snapshot(); ctx.strokeStyle = color; ctx.lineWidth = brush/2; kind === 'circle' ? ctx.stroke(new Path2D('M120 80 a60 60 0 1 0 1 0')) : ctx.strokeRect(80, 60, 110, 110); };
  const containerClass = fullScreen ? 'absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 to-indigo-950' : 'relative w-full aspect-square md:aspect-video max-w-2xl mx-auto rounded-[2rem] overflow-hidden shadow-xl border-4 border-black dark:border-white bg-slate-900 dark:bg-white';
  return <div className={containerClass}><div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap gap-2 rounded-3xl bg-white/80 p-2 shadow-xl backdrop-blur"><button onClick={undo} className="tap-target rounded-full bg-slate-100 p-2"><RotateCcw /></button><button onClick={redoDraw} className="tap-target rounded-full bg-slate-100 p-2"><RotateCw /></button>{colors.map(c=><button key={c} aria-label={`Brush ${c}`} onClick={()=>setColor(c)} className="tap-target rounded-full border-2" style={{background:c, outline: color===c?'4px solid #facc15':''}} />)}<input aria-label="Brush size" type="range" min="6" max="42" value={brush} onChange={e=>setBrush(Number(e.target.value))} />{stickers.map(s=><button key={s} onClick={()=>addSticker(s)} className="tap-target text-2xl">{s}</button>)}<button onClick={()=>shape('circle')} className="tap-target rounded-full bg-slate-100 p-2"><Circle /></button><button onClick={()=>shape('square')} className="tap-target rounded-full bg-slate-100 p-2"><Square /></button><button onClick={save} className="tap-target rounded-full bg-emerald-100 p-2"><Download /></button><button onClick={clearCanvas} className="tap-target rounded-full bg-rose-100 p-2"><RefreshCcw /></button></div><div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">{bgImage ? <img src={bgImage} alt="guide" className="w-full h-full object-contain p-8 invert dark:invert-0" /> : bgText ? <span className="text-[200px] md:text-[300px] font-black text-white dark:text-slate-900 leading-none">{bgText}</span> : null}</div><canvas ref={canvasRef} className="w-full h-full cursor-crosshair touch-none" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} style={{ touchAction: 'none' }} /></div>;
}
