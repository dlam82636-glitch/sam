import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, TrendingUp, Sparkles, Layers, Search, CheckCircle2, ArrowUpRight } from 'lucide-react';

export interface HeroVisualCompositionProps {
  onSelectQuery?: (query: string) => void;
}

export const HeroVisualComposition: React.FC<HeroVisualCompositionProps> = ({ onSelectQuery }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate normalized -1 to 1 coordinates from center of container
      const x = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
      const y = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
      setMousePos({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setIsHovered(true));
      container.addEventListener('mouseleave', () => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      });
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Parallax offsets (smooth proportional multipliers)
  const fgX = mousePos.x * 18;
  const fgY = mousePos.y * 18;
  const mgX = mousePos.x * 10;
  const mgY = mousePos.y * 10;
  const bgX = mousePos.x * 5;
  const bgY = mousePos.y * 5;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[540px] sm:h-[600px] lg:h-[650px] flex items-center justify-center select-none"
      aria-label="Interactive Market Intelligence Visual Composition"
    >
      {/* 1. ATMOSPHERIC BACKGROUND DEPTH */}
      {/* Ambient glowing teal orb */}
      <div
        className="pointer-events-none absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full hero-orb-teal blur-3xl -z-10 animate-orb-breathe"
        style={{
          transform: `translate(${bgX * 1.5}px, ${bgY * 1.5}px)`,
          transition: 'transform 0.4s ease-out',
        }}
      />
      {/* Dark contrast aura */}
      <div
        className="pointer-events-none absolute -bottom-10 right-10 w-80 h-80 rounded-full hero-orb-dark blur-3xl -z-10"
        style={{
          transform: `translate(${bgX * 0.8}px, ${bgY * 0.8}px)`,
          transition: 'transform 0.5s ease-out',
        }}
      />

      {/* 2. 3D TRANSLUCENT GLASS CYLINDERS & REFRACTION SHAPES (Inspired by reference) */}
      {/* Background glass tube 1 */}
      <div
        className="pointer-events-none absolute top-12 right-16 sm:right-28 w-14 h-48 sm:w-18 sm:h-64 rounded-full glass-cylinder-teal -rotate-12 animate-float-4 z-0 opacity-80"
        style={{
          transform: `translate(${bgX}px, ${bgY}px) rotate(-12deg)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        <div className="absolute top-3 left-2 right-2 h-6 rounded-full bg-white/40 blur-[1px]" />
      </div>

      {/* Background clear glass tube 2 */}
      <div
        className="pointer-events-none absolute top-28 right-32 sm:right-52 w-12 h-36 sm:w-16 sm:h-52 rounded-full glass-cylinder-clear rotate-6 animate-float-2 z-0 opacity-70"
        style={{
          transform: `translate(${bgX * 0.7}px, ${bgY * 0.7}px) rotate(6deg)`,
          transition: 'transform 0.35s ease-out',
        }}
      >
        <div className="absolute top-2 left-2 right-2 h-5 rounded-full bg-white/50 blur-[1px]" />
      </div>

      {/* Floating 3D translucent glass disc / sphere */}
      <div
        className="pointer-events-none absolute bottom-24 right-4 sm:right-12 w-20 h-20 sm:w-28 sm:h-28 rounded-full glass-pill border-2 border-white/80 animate-float-5 z-20 flex items-center justify-center shadow-lg"
        style={{
          transform: `translate(${fgX * 1.2}px, ${fgY * 1.2}px)`,
          transition: 'transform 0.25s ease-out',
        }}
      >
        <div className="w-10 h-10 rounded-full bg-teal-400/20 blur-sm animate-pulse-subtle" />
      </div>

      {/* 3. CENTRAL FLOATING PRICERA TERMINAL / RESEARCH CARD (Midground Layer) */}
      <div
        className="absolute w-[320px] sm:w-[380px] lg:w-[410px] glass-panel-dark rounded-3xl p-6 text-white z-10 animate-float-1"
        style={{
          transform: `translate(${mgX}px, ${mgY}px) rotate(${mousePos.x * 1.5}deg)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-300 font-bold">
              PRICERA Intelligence Core
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-900/60 text-teal-200 border border-teal-500/30">
            Active Engine
          </span>
        </div>

        {/* Query & Target Breakdown */}
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Query Target</span>
              <span className="text-sm font-bold text-white tracking-tight">12mm Marine Plywood</span>
            </div>
            <span className="text-[10px] font-mono text-teal-300 bg-teal-500/20 px-2 py-1 rounded-lg">
              BS 1088 Grade
            </span>
          </div>

          {/* Futuristic Data Waves / Range Meter */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Market Spread Spectrum</span>
              <span className="text-teal-300 font-bold">Illustrative Range</span>
            </div>
            <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 rounded-full animate-pulse-subtle" />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
              <span>Low Tier</span>
              <span className="text-white font-semibold">Median Benchmark</span>
              <span>High Tier</span>
            </div>
          </div>
        </div>

        {/* Floating status pill inside card */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Zero Synthetic Quotes</span>
          </span>
          <span className="font-mono text-teal-300 text-[10px]">Verifiable Citations</span>
        </div>
      </div>

      {/* 4. FLOATING PRODUCT CARD (Foreground Left, Overlapping) */}
      <div
        className="absolute -left-2 sm:-left-6 lg:-left-10 top-16 sm:top-20 w-56 sm:w-64 glass-card-float rounded-2xl p-4 z-20 animate-float-3 cursor-pointer group hover:scale-[1.03] transition-transform duration-200"
        style={{
          transform: `translate(${fgX * 1.1}px, ${fgY * 1.1}px) rotate(${mousePos.x * -2}deg)`,
          transition: 'transform 0.25s ease-out',
        }}
        onClick={() => onSelectQuery?.('MacBook laptop')}
        role="button"
        tabIndex={0}
        aria-label="Inspect MacBook market research example"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/80">
            Hardware Example
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 transition-colors" />
        </div>

        {/* Product Image Stage */}
        <div className="h-28 w-full rounded-xl bg-slate-50/90 flex items-center justify-center p-2 mb-2.5 overflow-hidden border border-slate-100">
          <img
            src="/images/macbook_laptop.jpg"
            alt="MacBook Laptop"
            className="max-h-full max-w-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
            loading="lazy"
          />
        </div>

        <h4 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight truncate">
          MacBook Laptop
        </h4>
        <span className="text-[11px] text-slate-500 font-mono block">Computing · Unified Spec</span>
      </div>

      {/* 5. FLOATING PRICE BADGE (Foreground Right, Overlapping) */}
      {/* Prominently labeled 'Example market range' per user prompt requirement */}
      <div
        className="absolute -right-2 sm:-right-6 bottom-28 sm:bottom-36 glass-card-float rounded-2xl p-4 sm:p-5 z-20 animate-float-2 shadow-xl border border-white"
        style={{
          transform: `translate(${fgX * 1.3}px, ${fgY * 1.3}px) rotate(${mousePos.x * 2.5}deg)`,
          transition: 'transform 0.22s ease-out',
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-800 font-bold">
            Example Market Range
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
          ₦185,000 – ₦215,000
        </div>
        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
          Illustrative result · Verified units
        </span>
      </div>

      {/* 6. FLOATING SPECIFICATION CARD (Top Right) */}
      <div
        className="absolute top-4 right-10 sm:right-20 glass-pill rounded-xl px-3.5 py-2 z-15 animate-float-5 flex items-center gap-2"
        style={{
          transform: `translate(${mgX * 1.2}px, ${mgY * 1.2}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
        <span className="text-xs font-mono font-semibold text-slate-800">
          1220 × 2440 mm · Phenolic WBP
        </span>
      </div>

      {/* 7. FLOATING CONFIDENCE BADGE (Bottom Left) */}
      <div
        className="absolute bottom-10 left-12 sm:left-20 glass-pill rounded-full px-4 py-2 z-25 animate-float-4 flex items-center gap-2 shadow-md border border-white/90"
        style={{
          transform: `translate(${fgX * 0.9}px, ${fgY * 0.9}px)`,
          transition: 'transform 0.28s ease-out',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-xs font-bold text-slate-900 tracking-tight">
          Confidence: <span className="text-emerald-700 font-extrabold">High</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400">· Verifiable</span>
      </div>

      {/* 8. FLOATING SUPPLIER SOURCE CARD (Bottom Center-Left) */}
      <div
        className="absolute bottom-2 left-44 sm:left-64 glass-pill rounded-xl px-3.5 py-2 z-15 animate-drift hidden sm:flex items-center gap-2 opacity-90"
        style={{
          transform: `translate(${mgX * 0.8}px, ${mgY * 0.8}px)`,
          transition: 'transform 0.35s ease-out',
        }}
      >
        <Search className="w-3.5 h-3.5 text-teal-600" />
        <span className="text-[11px] font-medium text-slate-700">
          Supplier Catalog Quote
        </span>
        <span className="text-[10px] font-mono text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded">
          Verified
        </span>
      </div>
    </div>
  );
};
