'use client';

import React, { useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { PLANETS_DATA, SUN_DATA, PlanetData } from '@/data/planetsData';
import { Sun } from './Sun';
import { CelestialBody } from './CelestialBody';
import { SpaceEnvironment } from './SpaceEnvironment';
import { CameraController, PerspectiveMode } from './CameraController';
import { SpacetimeGrid } from './SpacetimeGrid';
import { AsteroidBelt } from './AsteroidBelt';
import { Comet } from './Comet';
import { HyperdriveWarp } from './HyperdriveWarp';

interface SolarSystemCanvasProps {
  selectedId: string | null;
  onSelectPlanet: (id: string | null) => void;
  simulationSpeed: number;
  floatingEnabled: boolean;
  floatIntensity: number;
  showAtmospheres: boolean;
  showOrbits: boolean;
  perspectiveMode: PerspectiveMode;
  showSpacetimeGrid: boolean;
  showAsteroidBelt: boolean;
  showComet: boolean;
  isScrollyMode?: boolean;
  scrollProgress?: number;
}

export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({
  selectedId,
  onSelectPlanet,
  simulationSpeed,
  floatingEnabled,
  floatIntensity,
  showAtmospheres,
  showOrbits,
  perspectiveMode,
  showSpacetimeGrid,
  showAsteroidBelt,
  showComet,
  isScrollyMode = false,
  scrollProgress = 0
}) => {
  const targetRegistry = useRef<Record<string, THREE.Object3D>>({});
  const [isWarping, setIsWarping] = useState(false);

  const registerTarget = useCallback((id: string, obj: THREE.Object3D) => {
    targetRegistry.current[id] = obj;
  }, []);

  const handleWarpStart = useCallback(() => {
    setIsWarping(true);
    setTimeout(() => {
      setIsWarping(false);
    }, 1200);
  }, []);

  const moonData = useMemo(() => PLANETS_DATA.find((p) => p.id === 'moon'), []);
  const orbitalPlanets = useMemo(() => PLANETS_DATA.filter((p) => p.id !== 'moon'), []);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{
          position: [0, 65, 120],
          fov: 45,
          near: 0.1,
          far: 2500
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
        onPointerMissed={(e) => {
          if (e.type === 'click' && !isScrollyMode) {
            onSelectPlanet(null);
          }
        }}
      >
        <ambientLight intensity={0.15} />

        {/* Hyperdrive Warp Star-Streak Acceleration */}
        <HyperdriveWarp isWarping={isWarping} />

        {/* Deep Space Starfield & Ambient Dust Particles */}
        <SpaceEnvironment />

        {/* Einsteinian Gravitational Curvature Spacetime Fabric */}
        {showSpacetimeGrid && (
          <SpacetimeGrid
            targetRegistry={targetRegistry}
            planets={PLANETS_DATA}
            depthScale={1.2}
          />
        )}

        {/* Main Asteroid Belt (1,200+ Instanced Tumbling 3D Asteroids) */}
        {showAsteroidBelt && (
          <AsteroidBelt
            count={1200}
            simulationSpeed={simulationSpeed}
          />
        )}

        {/* Central Solar Body with Dynamic Corona Flares */}
        <Sun
          onSelect={onSelectPlanet}
          isSelected={selectedId === 'sun'}
          floatingEnabled={floatingEnabled}
        />

        {/* Planetary Systems */}
        {orbitalPlanets.map((planet) => (
          <CelestialBody
            key={planet.id}
            data={planet}
            onSelect={onSelectPlanet}
            isSelected={selectedId === planet.id}
            simulationSpeed={simulationSpeed}
            floatingEnabled={floatingEnabled}
            floatIntensity={floatIntensity}
            showAtmospheres={showAtmospheres}
            showOrbits={showOrbits}
            registerTarget={registerTarget}
            moonData={planet.id === 'earth' ? moonData : undefined}
            onSelectMoon={onSelectPlanet}
            isMoonSelected={selectedId === 'moon'}
          />
        ))}

        {/* Halley's Comet with Solar Wind Tail */}
        {showComet && (
          <Comet
            onSelect={onSelectPlanet}
            isSelected={selectedId === 'comet'}
            simulationSpeed={simulationSpeed}
            registerTarget={registerTarget}
          />
        )}

        {/* Camera Controller with Scroll Sync and Interactive Orbit Controls */}
        <CameraController
          selectedId={selectedId}
          targetRegistry={targetRegistry}
          planetsData={PLANETS_DATA}
          sunRadius={SUN_DATA.radius}
          perspectiveMode={perspectiveMode}
          onWarpStart={handleWarpStart}
          isScrollyMode={isScrollyMode}
          scrollProgress={scrollProgress}
        />
      </Canvas>
    </div>
  );
};
