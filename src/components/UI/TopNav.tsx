'use client';

import React, { useState } from 'react';
import { PlanetData, SUN_DATA } from '@/data/planetsData';
import { PerspectiveMode } from '@/components/CameraController';
import {
  Globe2,
  Volume2,
  VolumeX,
  Eye,
  Grid3X3,
  Compass,
  Layers,
  Sparkles,
  ScrollText,
  Rotate3d,
  Rocket
} from 'lucide-react';

interface TopNavProps {
  planets: PlanetData[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  floatingEnabled: boolean;
  perspectiveMode: PerspectiveMode;
  setPerspectiveMode: (mode: PerspectiveMode) => void;
  isScrollyMode: boolean;
  setIsScrollyMode: (mode: boolean) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  planets,
  selectedId,
  onSelect,
  floatingEnabled,
  perspectiveMode,
  setPerspectiveMode,
  isScrollyMode,
  setIsScrollyMode
}) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const oscillatorRef = React.useRef<OscillatorNode | null>(null);
  const gainNodeRef = React.useRef<GainNode | null>(null);

  const toggleSound = () => {
    if (!soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, ctx.currentTime);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(110, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc2.start();

        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
        setSoundEnabled(true);
      } catch (err) {
        console.warn('Audio could not be initialized:', err);
      }
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setSoundEnabled(false);
    }
  };

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-40 pointer-events-auto max-w-7xl w-[96%] flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Brand & Mission Status */}
        <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-xl border border-cyan-500/30 px-3.5 py-2 rounded-2xl shadow-xl">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]">
            <Globe2 className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase font-mono">
                NASA COSMIC ORRERY
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40">
                SCROLL VOYAGE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Mode: {isScrollyMode ? 'SHUTTLE SCROLL EXPEDITION' : 'INTERACTIVE 3D SANDBOX'}
            </p>
          </div>
        </div>

        {/* Global Exploration Mode Switcher (Story vs Sandbox) */}
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-xl border border-cyan-500/30 p-1.5 rounded-2xl shadow-xl">
          <button
            onClick={() => setIsScrollyMode(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
              isScrollyMode
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Scroll through Shuttle Launch & Planetary Milestones"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Story Flight (Scroll)</span>
          </button>

          <button
            onClick={() => setIsScrollyMode(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
              !isScrollyMode
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Free Interactive 3D Orrery Sandbox"
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span>3D Sandbox Mode</span>
          </button>

          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border ml-1 transition-all ${
              soundEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Mute Cosmic Drone' : 'Play Cosmic Ambient Drone'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* When in Sandbox Mode: Show Perspective Selector & Celestial Jump Bar */}
      {!isScrollyMode && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Perspectives */}
          <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-xl border border-cyan-500/30 p-1.5 rounded-2xl shadow-xl">
            <span className="text-[10px] font-mono text-cyan-400 font-semibold px-2 uppercase hidden md:inline">
              Perspective:
            </span>

            <button
              onClick={() => setPerspectiveMode('gods_eye')}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                perspectiveMode === 'gods_eye'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>God&apos;s Eye</span>
            </button>

            <button
              onClick={() => setPerspectiveMode('spacetime')}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                perspectiveMode === 'spacetime'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Grid3X3 className="w-3 h-3" />
              <span>Spacetime</span>
            </button>

            <button
              onClick={() => setPerspectiveMode('horizon')}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                perspectiveMode === 'horizon'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Horizon</span>
            </button>

            <button
              onClick={() => setPerspectiveMode('ecliptic')}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                perspectiveMode === 'ecliptic'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Ecliptic</span>
            </button>
          </div>

          {/* Celestial Bodies */}
          <nav className="flex items-center gap-1.5 overflow-x-auto max-w-full p-1.5 bg-slate-950/85 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-xl custom-scrollbar">
            <button
              onClick={() => onSelect(null)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedId === null
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onSelect('sun')}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedId === 'sun'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60'
              }`}
            >
              Sun
            </button>
            {planets.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                  selectedId === p.id
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {p.name}
              </button>
            ))}
            <button
              onClick={() => onSelect('comet')}
              className={`px-2 py-1 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedId === 'comet'
                  ? 'bg-sky-400 text-black font-bold'
                  : 'text-sky-400 hover:text-sky-300 hover:bg-slate-800/60'
              }`}
            >
              Comet
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
