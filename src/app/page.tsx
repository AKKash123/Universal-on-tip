'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { PLANETS_DATA, SUN_DATA, COMET_DATA } from '@/data/planetsData';
import { TopNav } from '@/components/UI/TopNav';
import { TimeControls } from '@/components/UI/TimeControls';
import { TelemetryDrawer } from '@/components/UI/TelemetryDrawer';
import { PerspectiveMode } from '@/components/CameraController';
import { ScrollyVideo } from '@/components/ScrollyVideo';
import { ScrollStoryOverlay } from '@/components/UI/ScrollStoryOverlay';

const SolarSystemCanvas = dynamic(
  () => import('@/components/SolarSystemCanvas').then((mod) => mod.SolarSystemCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-950 text-cyan-400 font-mono gap-3">
        <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm tracking-widest uppercase">Initializing Cosmic Scrolly Engine...</span>
      </div>
    ),
  }
);

export default function Home() {
  // Global Mode: Scrollytelling Flight vs Free Interactive 3D Sandbox
  const [isScrollyMode, setIsScrollyMode] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // 3D Canvas & Simulation States
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1.0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [floatingEnabled, setFloatingEnabled] = useState<boolean>(true);
  const [floatIntensity, setFloatIntensity] = useState<number>(1.0);
  const [showAtmospheres, setShowAtmospheres] = useState<boolean>(true);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);

  // Dynamic Realism States
  const [perspectiveMode, setPerspectiveMode] = useState<PerspectiveMode>('gods_eye');
  const [showSpacetimeGrid, setShowSpacetimeGrid] = useState<boolean>(true);
  const [showAsteroidBelt, setShowAsteroidBelt] = useState<boolean>(true);
  const [showComet, setShowComet] = useState<boolean>(true);

  // Window scroll listener for Scrollytelling Mode
  useEffect(() => {
    if (!isScrollyMode) {
      document.body.style.overflow = 'hidden';
      return;
    }

    document.body.style.overflow = 'auto';

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrollyMode]);

  // Jump to specific scroll progress
  const handleJumpToProgress = useCallback((targetProgress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetProgress * maxScroll,
      behavior: 'smooth'
    });
  }, []);

  // Enter Sandbox Mode
  const handleEnterSandbox = useCallback(() => {
    setIsScrollyMode(false);
    setSelectedId(null);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'm' || e.key === 'M') {
        setIsScrollyMode((prev) => !prev);
      }
      if (!isScrollyMode) {
        if (e.key === '1') setPerspectiveMode('gods_eye');
        if (e.key === '2') setPerspectiveMode('spacetime');
        if (e.key === '3') setPerspectiveMode('horizon');
        if (e.key === '4') setPerspectiveMode('ecliptic');
        if (e.key === ' ') {
          e.preventDefault();
          setIsPaused((prev) => !prev);
        }
        if (e.key === 'Escape') {
          setSelectedId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScrollyMode]);

  // Selected planet, sun, or comet entity for telemetry drawer
  const selectedEntity = useMemo(() => {
    if (!selectedId) return null;
    if (selectedId === 'sun') return SUN_DATA;
    if (selectedId === 'comet') return COMET_DATA as any;
    return PLANETS_DATA.find((p) => p.id === selectedId) || null;
  }, [selectedId]);

  return (
    <div className={`relative w-full bg-slate-950 ${isScrollyMode ? 'min-h-[700vh]' : 'h-screen overflow-hidden'}`}>
      {/* Sticky Fullscreen 3D Canvas Viewport */}
      <div className="fixed inset-0 w-screen h-screen z-0">
        <SolarSystemCanvas
          selectedId={selectedId}
          onSelectPlanet={setSelectedId}
          simulationSpeed={isPaused ? 0 : simulationSpeed}
          floatingEnabled={floatingEnabled}
          floatIntensity={floatIntensity}
          showAtmospheres={showAtmospheres}
          showOrbits={showOrbits}
          perspectiveMode={perspectiveMode}
          showSpacetimeGrid={showSpacetimeGrid}
          showAsteroidBelt={showAsteroidBelt}
          showComet={showComet}
          isScrollyMode={isScrollyMode}
          scrollProgress={scrollProgress}
        />
      </div>

      {/* Top Navigation & Global Mode Switcher */}
      <TopNav
        planets={PLANETS_DATA}
        selectedId={selectedId}
        onSelect={setSelectedId}
        floatingEnabled={floatingEnabled}
        perspectiveMode={perspectiveMode}
        setPerspectiveMode={setPerspectiveMode}
        isScrollyMode={isScrollyMode}
        setIsScrollyMode={setIsScrollyMode}
      />

      {/* Shuttle Video Scroll Scrubbing Portal (Visible in Story Mode, or minimizable) */}
      <ScrollyVideo
        scrollProgress={scrollProgress}
        isScrollyMode={isScrollyMode}
      />

      {/* Scrollytelling Story Overlays & Milestones (When in Story Flight Mode) */}
      {isScrollyMode && (
        <ScrollStoryOverlay
          scrollProgress={scrollProgress}
          onJumpToProgress={handleJumpToProgress}
          onEnterSandbox={handleEnterSandbox}
        />
      )}

      {/* Sandbox Controls Toolbar (When in 3D Sandbox Mode) */}
      {!isScrollyMode && (
        <>
          <TimeControls
            simulationSpeed={simulationSpeed}
            setSimulationSpeed={setSimulationSpeed}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            floatingEnabled={floatingEnabled}
            setFloatingEnabled={setFloatingEnabled}
            floatIntensity={floatIntensity}
            setFloatIntensity={setFloatIntensity}
            showAtmospheres={showAtmospheres}
            setShowAtmospheres={setShowAtmospheres}
            showOrbits={showOrbits}
            setShowOrbits={setShowOrbits}
            showSpacetimeGrid={showSpacetimeGrid}
            setShowSpacetimeGrid={setShowSpacetimeGrid}
            showAsteroidBelt={showAsteroidBelt}
            setShowAsteroidBelt={setShowAsteroidBelt}
            showComet={showComet}
            setShowComet={setShowComet}
            onResetView={() => setSelectedId(null)}
          />

          {/* Slide-out NASA Telemetry Panel */}
          <TelemetryDrawer
            selectedPlanet={selectedEntity}
            onClose={() => setSelectedId(null)}
            onSelectPlanet={setSelectedId}
            allPlanets={PLANETS_DATA}
          />
        </>
      )}
    </div>
  );
}
