'use client';

import React from 'react';
import {
  Rocket,
  Globe2,
  Moon,
  Compass,
  Disc,
  Flame,
  ChevronDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ScrollStoryOverlayProps {
  scrollProgress: number; // 0.0 to 1.0
  onJumpToProgress: (progress: number) => void;
  onEnterSandbox: () => void;
}

interface Milestone {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  description: string;
  telemetry: { label: string; value: string }[];
  icon: any;
}

const MILESTONES: Milestone[] = [
  {
    id: 'launch',
    title: 'STAGE 1: ATMOSPHERIC ASCENT',
    subtitle: 'T-Minus Zero to Solid Rocket Separation',
    progress: 0.05,
    description: 'Main engine ignition and liftoff from Kennedy Space Center Pad 39A. Twin Solid Rocket Boosters ignite with 5.3 million pounds of thrust, pushing through maximum aerodynamic pressure (Max-Q).',
    telemetry: [
      { label: 'Velocity', value: 'Mach 4.5 (5,500 km/h)' },
      { label: 'Altitude', value: '45 km (Stratosphere)' },
      { label: 'Thrust', value: '34,800 kN' }
    ],
    icon: Rocket
  },
  {
    id: 'leo',
    title: 'STAGE 2: LOW-EARTH ORBIT INSERTION',
    subtitle: 'Orbital Velocity Achieved • 28,000 km/h',
    progress: 0.20,
    description: 'External tank separation. Main orbital maneuvering engines circularize trajectory at 400 km altitude. Looking down at the brilliant day/night terminator with shimmering city lights and atmospheric airglow.',
    telemetry: [
      { label: 'Velocity', value: '7.8 km/s (Mach 25)' },
      { label: 'Altitude', value: '410 km (LEO)' },
      { label: 'Inclination', value: '28.5°' }
    ],
    icon: Globe2
  },
  {
    id: 'moon',
    title: 'STAGE 3: TRANSLUNAR SLINGSHOT',
    subtitle: 'Apollo & Artemis Gravity Assist Trajectory',
    progress: 0.36,
    description: 'Translunar injection burn fires. The spacecraft escapes Earth gravity well and swings past the Moon’s rugged lunar farside, stealing orbital momentum for the deep space interplanetary cruise.',
    telemetry: [
      { label: 'Target', value: 'The Moon (Luna)' },
      { label: 'Perilune', value: '110 km altitude' },
      { label: 'Earth Distance', value: '384,400 km' }
    ],
    icon: Moon
  },
  {
    id: 'mars',
    title: 'STAGE 4: THE RED FRONTIER',
    subtitle: 'Martian Aerocapture & Olympus Mons Flyby',
    progress: 0.52,
    description: 'Approaching Mars after 7 months of interplanetary cruise. The rust-colored Martian atmosphere and polar ice caps emerge into view as retrograde thrusters burn for orbital insertion.',
    telemetry: [
      { label: 'Target', value: 'Mars (Ares)' },
      { label: 'Sun Distance', value: '1.52 AU (228M km)' },
      { label: 'Local Surface G', value: '0.38 g' }
    ],
    icon: Compass
  },
  {
    id: 'asteroids',
    title: 'STAGE 5: MAIN ASTEROID BELT',
    subtitle: 'Navigating 1,200+ Tumbling 3D Space Rocks',
    progress: 0.68,
    description: 'Entering the vast debris field between Mars and Jupiter. Millions of ancient planetesimal remnants from the birth of the solar system drift in Keplerian harmony across 2.2 to 3.2 AU.',
    telemetry: [
      { label: 'Zone', value: 'Main Belt (Ceres/Vesta)' },
      { label: 'Rel. Velocity', value: '18 km/s' },
      { label: 'Rock Density', value: 'Sparse (Safe Transit)' }
    ],
    icon: Disc
  },
  {
    id: 'gasgiants',
    title: 'STAGE 6: JOVIAN & SATURNIAN REALM',
    subtitle: 'Great Red Spot & Splendid Icy Ring Plane',
    progress: 0.84,
    description: 'High-speed gravity assist through Jupiter’s radiation belts and sweeping alongside Saturn’s razor-thin icy rings. Witnessing Saturn’s shadow carve through the Cassini division in stark relief.',
    telemetry: [
      { label: 'Target', value: 'Jupiter & Saturn' },
      { label: 'Sun Distance', value: '5.2 - 9.5 AU' },
      { label: 'Atmosphere', value: 'Metallic Hydrogen / Helium' }
    ],
    icon: Sparkles
  },
  {
    id: 'sandbox',
    title: 'MISSION TERMINUS: 3D COSMIC ORRERY',
    subtitle: 'Full Interactive Free-Flight Command Mode',
    progress: 0.98,
    description: 'Interplanetary voyage complete. The entire Solar System opens into full interactive sandbox command mode. Rotate orbits, test Einstein spacetime curvature wells, inspect NASA telemetry, and command time.',
    telemetry: [
      { label: 'Status', value: 'Free Orbit Sandbox Active' },
      { label: 'Curvature', value: 'General Relativity ON' },
      { label: 'System Reach', value: '100+ AU (Heliosphere)' }
    ],
    icon: Flame
  }
];

export const ScrollStoryOverlay: React.FC<ScrollStoryOverlayProps> = ({
  scrollProgress,
  onJumpToProgress,
  onEnterSandbox
}) => {
  // Find current active milestone based on scroll progress
  let activeIndex = 0;
  if (scrollProgress >= 0.90) activeIndex = 6;
  else if (scrollProgress >= 0.76) activeIndex = 5;
  else if (scrollProgress >= 0.60) activeIndex = 4;
  else if (scrollProgress >= 0.44) activeIndex = 3;
  else if (scrollProgress >= 0.28) activeIndex = 2;
  else if (scrollProgress >= 0.12) activeIndex = 1;
  else activeIndex = 0;

  const current = MILESTONES[activeIndex];
  const Icon = current.icon;

  return (
    <>
      {/* Scroll Down Prompt (Visible at start) */}
      {scrollProgress < 0.08 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 text-cyan-400 font-mono animate-bounce">
          <span className="text-xs tracking-widest uppercase bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
            Scroll Down to Drive Shuttle Launch & Cosmic Voyage
          </span>
          <ChevronDown className="w-5 h-5" />
        </div>
      )}

      {/* Vertical Flight Timeline Waypoint Dots (Right Side) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-auto hidden md:flex flex-col items-center gap-3 bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 p-2.5 rounded-full shadow-2xl">
        {MILESTONES.map((m, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={m.id}
              onClick={() => onJumpToProgress(m.progress)}
              className={`w-3.5 h-3.5 rounded-full transition-all flex items-center justify-center relative group ${
                isActive
                  ? 'bg-cyan-400 scale-125 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                  : 'bg-slate-700 hover:bg-slate-400'
              }`}
              title={m.title}
            >
              {/* Tooltip on hover */}
              <span className="absolute right-7 font-mono text-[10px] whitespace-nowrap bg-slate-900 px-2 py-1 rounded border border-cyan-500/30 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                {m.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Floating Active Mission Briefing Card (Pinned Top-Right) */}
      <div className="fixed top-24 right-6 sm:right-16 z-20 pointer-events-none max-w-md w-[90vw] sm:w-[420px]">
        <div className="bg-slate-950/85 backdrop-blur-2xl border border-cyan-500/30 p-5 rounded-3xl shadow-2xl text-white transition-all duration-300">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest block uppercase">
                {current.title}
              </span>
              <h2 className="text-sm font-bold text-white tracking-tight">{current.subtitle}</h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">{current.description}</p>

          {/* Telemetry Chips */}
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono mb-4">
            {current.telemetry.map((t, i) => (
              <div key={i} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[9px] block uppercase">{t.label}</span>
                <span className="text-cyan-300 font-semibold truncate block">{t.value}</span>
              </div>
            ))}
          </div>

          {/* Interactive Action Button */}
          {activeIndex === 6 ? (
            <button
              onClick={onEnterSandbox}
              className="pointer-events-auto w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs uppercase font-mono tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-all"
            >
              <span>Enter 3D Orbit Sandbox Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Scroll to advance trajectory</span>
              <button
                onClick={onEnterSandbox}
                className="pointer-events-auto text-cyan-400 hover:text-cyan-300 underline font-semibold"
              >
                Skip to 3D Sandbox &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
