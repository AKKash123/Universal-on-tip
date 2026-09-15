'use client';

import React from 'react';
import {
  Play,
  Pause,
  Waves,
  Orbit,
  Sparkles,
  Grid3X3,
  Maximize2,
  Disc,
  Flame
} from 'lucide-react';

interface TimeControlsProps {
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  floatingEnabled: boolean;
  setFloatingEnabled: (enabled: boolean) => void;
  floatIntensity: number;
  setFloatIntensity: (intensity: number) => void;
  showAtmospheres: boolean;
  setShowAtmospheres: (show: boolean) => void;
  showOrbits: boolean;
  setShowOrbits: (show: boolean) => void;
  showSpacetimeGrid: boolean;
  setShowSpacetimeGrid: (show: boolean) => void;
  showAsteroidBelt: boolean;
  setShowAsteroidBelt: (show: boolean) => void;
  showComet: boolean;
  setShowComet: (show: boolean) => void;
  onResetView: () => void;
}

export const TimeControls: React.FC<TimeControlsProps> = ({
  simulationSpeed,
  setSimulationSpeed,
  isPaused,
  setIsPaused,
  floatingEnabled,
  setFloatingEnabled,
  floatIntensity,
  setFloatIntensity,
  showAtmospheres,
  setShowAtmospheres,
  showOrbits,
  setShowOrbits,
  showSpacetimeGrid,
  setShowSpacetimeGrid,
  showAsteroidBelt,
  setShowAsteroidBelt,
  showComet,
  setShowComet,
  onResetView
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-5xl w-[96%] sm:w-auto">
      <div className="bg-slate-950/85 backdrop-blur-xl border border-cyan-500/30 px-4 py-3 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3.5 text-white">
        {/* Playback Controls & Speed */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
              isPaused
                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black font-bold'
            }`}
            title={isPaused ? 'Resume Simulation' : 'Pause Simulation'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 min-w-[50px]">
              {isPaused ? 'PAUSED' : `${simulationSpeed.toFixed(1)}x Speed`}
            </span>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
              className="w-20 sm:w-28 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        <div className="hidden sm:block h-6 w-px bg-slate-800" />

        {/* Anti-Gravity Zero-G Floating */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setFloatingEnabled(!floatingEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
              floatingEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Anti-Gravity Zero-G Oscillation"
          >
            <Waves className={`w-3.5 h-3.5 ${floatingEnabled ? 'animate-pulse text-cyan-400' : ''}`} />
            <span>Zero-G {floatingEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {floatingEnabled && (
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400">Amp</span>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={floatIntensity}
                onChange={(e) => setFloatIntensity(parseFloat(e.target.value))}
                className="w-14 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                title="Floating amplitude"
              />
            </div>
          )}
        </div>

        <div className="hidden sm:block h-6 w-px bg-slate-800" />

        {/* Dynamic Simulation Feature Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Spacetime Grid */}
          <button
            onClick={() => setShowSpacetimeGrid(!showSpacetimeGrid)}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 border transition-all ${
              showSpacetimeGrid
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
            title="Toggle Einstein Spacetime Gravity Wells"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Spacetime</span>
          </button>

          {/* Asteroid Belt */}
          <button
            onClick={() => setShowAsteroidBelt(!showAsteroidBelt)}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 border transition-all ${
              showAsteroidBelt
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
            title="Toggle Main Asteroid Belt (1200+ Rocks)"
          >
            <Disc className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Asteroids</span>
          </button>

          {/* Halley's Comet */}
          <button
            onClick={() => setShowComet(!showComet)}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 border transition-all ${
              showComet
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
            title="Toggle Halley's Comet"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Comet</span>
          </button>

          {/* Atmospheres */}
          <button
            onClick={() => setShowAtmospheres(!showAtmospheres)}
            className={`p-1.5 rounded-xl text-xs border transition-all ${
              showAtmospheres
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
            title="Atmospheric Halos"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Orbits */}
          <button
            onClick={() => setShowOrbits(!showOrbits)}
            className={`p-1.5 rounded-xl text-xs border transition-all ${
              showOrbits
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
            title="Orbit Lines"
          >
            <Orbit className="w-3.5 h-3.5" />
          </button>

          {/* Reset Overview */}
          <button
            onClick={onResetView}
            className="p-1.5 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all ml-1"
            title="Reset to Full Overview"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
