'use client';

import React from 'react';
import { PlanetData, SUN_DATA } from '@/data/planetsData';
import {
  X,
  Compass,
  Thermometer,
  RotateCw,
  Orbit,
  Weight,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Radio
} from 'lucide-react';

interface TelemetryDrawerProps {
  selectedPlanet: PlanetData | typeof SUN_DATA | null;
  onClose: () => void;
  onSelectPlanet: (id: string) => void;
  allPlanets: PlanetData[];
}

export const TelemetryDrawer: React.FC<TelemetryDrawerProps> = ({
  selectedPlanet,
  onClose,
  onSelectPlanet,
  allPlanets
}) => {
  if (!selectedPlanet) return null;

  const isSun = selectedPlanet.id === 'sun';

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-[440px] z-40 pointer-events-auto bg-slate-950/85 backdrop-blur-xl border-l border-cyan-500/30 text-white shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {/* Header Banner */}
      <div className="p-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/90 to-cyan-950/40 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-semibold">
              NASA TELEMETRY FEED
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
            title="Close Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">{selectedPlanet.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {selectedPlanet.type}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 italic">{selectedPlanet.tagline}</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 font-sans text-sm custom-scrollbar">
        {/* Physical Metrics Grid */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Planetary Specifications
          </h3>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Diameter</span>
              <span className="font-mono font-semibold text-slate-100">{selectedPlanet.facts.diameterKm}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                <Weight className="w-3 h-3 text-cyan-400" /> Mass
              </span>
              <span className="font-mono font-semibold text-slate-100">{selectedPlanet.facts.massKg}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                <Orbit className="w-3 h-3 text-cyan-400" /> Distance from Sun
              </span>
              <span className="font-mono font-semibold text-slate-100">{selectedPlanet.facts.distanceFromSunKm}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-amber-400" /> Avg Temperature
              </span>
              <span className="font-mono font-semibold text-slate-100">{selectedPlanet.facts.avgTemp}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                <RotateCw className="w-3 h-3 text-cyan-400" /> Orbital Period
              </span>
              <span className="font-mono font-semibold text-slate-100">{selectedPlanet.facts.orbitalPeriod}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Rotation Period</span>
              <span className="font-mono font-semibold text-slate-100">{selectedPlanet.facts.rotationPeriod}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Surface Gravity</span>
              <span className="font-mono font-semibold text-slate-100">{selectedPlanet.facts.surfaceGravity}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Known Moons</span>
              <span className="font-mono font-semibold text-cyan-300">
                {selectedPlanet.facts.moonsCount} {selectedPlanet.facts.moonsCount === 1 ? 'Moon' : 'Moons'}
              </span>
            </div>
          </div>
        </div>

        {/* Atmospheric Composition */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Atmospheric Composition
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {selectedPlanet.facts.atmosphericComposition.map((gas, index) => (
              <span
                key={index}
                className="text-xs px-2.5 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-200"
              >
                {gas}
              </span>
            ))}
          </div>
        </div>

        {/* Scientific Overview Description */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5" />
            Astrophysical Overview
          </h3>
          <p className="text-xs leading-relaxed text-slate-300">{selectedPlanet.facts.description}</p>
        </div>

        {/* NASA Exploration Highlights */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/30 to-slate-900/50 border border-cyan-500/20">
          <h3 className="text-xs font-mono uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            NASA Missions & Discovery Notes
          </h3>
          <p className="text-xs leading-relaxed text-slate-300">{selectedPlanet.facts.explorationTrivia}</p>
        </div>

        {/* Quick Celestial Body Switcher */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Orbit Neighbors
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => onSelectPlanet('sun')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedPlanet.id === 'sun'
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-400/50'
              }`}
            >
              The Sun
            </button>
            {allPlanets.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPlanet(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedPlanet.id === p.id
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-400/50'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
