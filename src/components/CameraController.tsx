'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { PlanetData } from '@/data/planetsData';

export type PerspectiveMode = 'gods_eye' | 'spacetime' | 'horizon' | 'ecliptic';

interface CameraControllerProps {
  selectedId: string | null;
  targetRegistry: React.MutableRefObject<Record<string, THREE.Object3D>>;
  planetsData: PlanetData[];
  sunRadius: number;
  perspectiveMode: PerspectiveMode;
  onWarpStart?: () => void;
  isScrollyMode?: boolean;
  scrollProgress?: number;
}

const DEFAULT_OVERVIEW_POS = new THREE.Vector3(0, 65, 120);
const SPACETIME_OVERVIEW_POS = new THREE.Vector3(0, 22, 135);
const ECLIPTIC_OVERVIEW_POS = new THREE.Vector3(0, 2, 140);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

export const CameraController: React.FC<CameraControllerProps> = ({
  selectedId,
  targetRegistry,
  planetsData,
  sunRadius,
  perspectiveMode,
  onWarpStart,
  isScrollyMode = false,
  scrollProgress = 0
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const tempWorldPos = useRef(new THREE.Vector3());
  const desiredCamPos = useRef(new THREE.Vector3(0, 65, 120));
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0));
  const isTracking = useRef(false);
  const prevSelectedId = useRef<string | null>(null);

  // Trigger hyperdrive warp on target switch in sandbox mode
  useEffect(() => {
    if (!isScrollyMode && prevSelectedId.current !== selectedId) {
      prevSelectedId.current = selectedId;
      isTracking.current = false;
      if (onWarpStart) {
        onWarpStart();
      }
    }
  }, [selectedId, isScrollyMode, onWarpStart]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // ==========================================
    // A. SCROLLYTELLING FLIGHT TRAJECTORY MODE
    // ==========================================
    if (isScrollyMode) {
      controlsRef.current.enabled = false; // Camera is driven by scroll position

      const earthObj = targetRegistry.current['earth'];
      const moonObj = targetRegistry.current['moon'];
      const marsObj = targetRegistry.current['mars'];
      const jupObj = targetRegistry.current['jupiter'];
      const satObj = targetRegistry.current['saturn'];

      const p = Math.min(Math.max(scrollProgress, 0), 1);

      if (p < 0.15) {
        // Stage 1: Earth Launch & Ascent through atmosphere
        const t = p / 0.15;
        if (earthObj) earthObj.getWorldPosition(tempWorldPos.current);
        else tempWorldPos.current.set(30, 0, 0);

        desiredTarget.current.set(
          tempWorldPos.current.x + 1.5,
          tempWorldPos.current.y + 0.8,
          tempWorldPos.current.z
        );
        desiredCamPos.current.set(
          tempWorldPos.current.x - (1.8 + t * 2.5),
          tempWorldPos.current.y + 0.5 + t * 1.5,
          tempWorldPos.current.z + (1.2 + t * 2.0)
        );
      } else if (p < 0.32) {
        // Stage 2: Low-Earth Orbit (LEO) Insertion
        const t = (p - 0.15) / 0.17;
        if (earthObj) earthObj.getWorldPosition(tempWorldPos.current);
        else tempWorldPos.current.set(30, 0, 0);

        desiredTarget.current.copy(tempWorldPos.current);
        desiredCamPos.current.set(
          tempWorldPos.current.x + 3.5 + t * 4.0,
          tempWorldPos.current.y + 2.0 + t * 3.0,
          tempWorldPos.current.z + 4.5 + t * 5.0
        );
      } else if (p < 0.48) {
        // Stage 3: Translunar Injection & Moon Slingshot
        const t = (p - 0.32) / 0.16;
        if (moonObj) moonObj.getWorldPosition(tempWorldPos.current);
        else tempWorldPos.current.set(33, 0, 0);

        desiredTarget.current.copy(tempWorldPos.current);
        desiredCamPos.current.set(
          tempWorldPos.current.x + 1.8 - t * 0.8,
          tempWorldPos.current.y + 0.9,
          tempWorldPos.current.z + 2.2 + t * 3.0
        );
      } else if (p < 0.64) {
        // Stage 4: Martian Approach & Orbit Insertion
        const t = (p - 0.48) / 0.16;
        if (marsObj) marsObj.getWorldPosition(tempWorldPos.current);
        else tempWorldPos.current.set(40, 0, 0);

        desiredTarget.current.copy(tempWorldPos.current);
        desiredCamPos.current.set(
          tempWorldPos.current.x + 3.2 - t * 1.0,
          tempWorldPos.current.y + 1.6 + t * 1.2,
          tempWorldPos.current.z + 3.8 + t * 2.0
        );
      } else if (p < 0.80) {
        // Stage 5: Main Asteroid Belt Crossing
        const t = (p - 0.64) / 0.16;
        desiredTarget.current.set(Math.cos(t * 1.5) * 47, 0, Math.sin(t * 1.5) * 47);
        desiredCamPos.current.set(
          Math.cos(t * 1.5) * 52,
          6.0 + t * 4.0,
          Math.sin(t * 1.5) * 52
        );
      } else if (p < 0.92) {
        // Stage 6: Jupiter & Saturn Gas Giant Flyby
        const t = (p - 0.80) / 0.12;
        if (satObj) satObj.getWorldPosition(tempWorldPos.current);
        else tempWorldPos.current.set(72, 0, 0);

        desiredTarget.current.copy(tempWorldPos.current);
        desiredCamPos.current.set(
          tempWorldPos.current.x + 8.0 - t * 2.0,
          tempWorldPos.current.y + 6.0 + t * 4.0,
          tempWorldPos.current.z + 12.0 + t * 10.0
        );
      } else {
        // Stage 7: Pull out to Full Solar System Cosmic Overview
        const t = (p - 0.92) / 0.08;
        desiredTarget.current.set(0, -2.0 * t, 0);
        desiredCamPos.current.lerpVectors(
          new THREE.Vector3(0, 30, 80),
          DEFAULT_OVERVIEW_POS,
          t
        );
      }

      controlsRef.current.target.lerp(desiredTarget.current, Math.min(delta * 5.0, 0.3));
      camera.position.lerp(desiredCamPos.current, Math.min(delta * 5.0, 0.3));
      controlsRef.current.update();
      return;
    }

    // ==========================================
    // B. FREE INTERACTIVE ORBIT SANDBOX MODE
    // ==========================================
    controlsRef.current.enabled = true;

    // 1. OVERVIEW MODES (No specific celestial body selected)
    if (!selectedId) {
      if (perspectiveMode === 'spacetime') {
        desiredTarget.current.set(0, -6, 0);
        desiredCamPos.current.copy(SPACETIME_OVERVIEW_POS);
      } else if (perspectiveMode === 'ecliptic') {
        desiredTarget.current.set(0, 0, 0);
        desiredCamPos.current.copy(ECLIPTIC_OVERVIEW_POS);
      } else if (perspectiveMode === 'horizon') {
        const earthObj = targetRegistry.current['earth'];
        if (earthObj) {
          earthObj.getWorldPosition(tempWorldPos.current);
          const earthRadius = 1.25;
          desiredTarget.current.set(
            tempWorldPos.current.x + 10,
            tempWorldPos.current.y + 0.5,
            tempWorldPos.current.z
          );
          desiredCamPos.current.set(
            tempWorldPos.current.x,
            tempWorldPos.current.y + earthRadius * 1.15,
            tempWorldPos.current.z + earthRadius * 0.4
          );
        }
      } else {
        desiredTarget.current.copy(DEFAULT_TARGET);
        desiredCamPos.current.copy(DEFAULT_OVERVIEW_POS);
      }

      controlsRef.current.target.lerp(desiredTarget.current, Math.min(delta * 2.8, 0.18));
      camera.position.lerp(desiredCamPos.current, Math.min(delta * 2.8, 0.18));
      controlsRef.current.maxDistance = 450;
      controlsRef.current.minDistance = 3;
      controlsRef.current.update();
      isTracking.current = false;
      return;
    }

    // 2. SUN FOCUS
    if (selectedId === 'sun') {
      desiredTarget.current.set(0, 0, 0);
      const camOffset = perspectiveMode === 'ecliptic'
        ? new THREE.Vector3(0, 0.5, sunRadius * 2.8)
        : new THREE.Vector3(0, sunRadius * 1.2, sunRadius * 2.8);
      desiredCamPos.current.copy(camOffset);

      controlsRef.current.target.lerp(desiredTarget.current, Math.min(delta * 3.5, 0.22));
      camera.position.lerp(desiredCamPos.current, Math.min(delta * 3.5, 0.22));
      controlsRef.current.minDistance = sunRadius * 1.3;
      controlsRef.current.maxDistance = 250;
      controlsRef.current.update();
      return;
    }

    // 3. TARGET PLANET / MOON / COMET FOCUS
    const targetObj = targetRegistry.current[selectedId];
    if (targetObj) {
      targetObj.getWorldPosition(tempWorldPos.current);
      const planet = planetsData.find((p) => p.id === selectedId);
      const radius = planet ? planet.radius : (selectedId === 'comet' ? 0.3 : 1.0);

      if (perspectiveMode === 'horizon') {
        desiredTarget.current.set(
          tempWorldPos.current.x + radius * 3.0,
          tempWorldPos.current.y + radius * 0.4,
          tempWorldPos.current.z
        );
        desiredCamPos.current.set(
          tempWorldPos.current.x,
          tempWorldPos.current.y + radius * 1.14,
          tempWorldPos.current.z + radius * 0.35
        );
      } else if (perspectiveMode === 'ecliptic') {
        desiredTarget.current.copy(tempWorldPos.current);
        const viewDist = radius * 3.5 + 2.0;
        desiredCamPos.current.set(
          tempWorldPos.current.x + viewDist,
          tempWorldPos.current.y + 0.1,
          tempWorldPos.current.z + 0.2
        );
      } else {
        desiredTarget.current.copy(tempWorldPos.current);
        const viewDistance = radius * 3.8 + 2.5;

        if (!isTracking.current) {
          desiredCamPos.current.set(
            tempWorldPos.current.x + viewDistance * 0.7,
            tempWorldPos.current.y + viewDistance * 0.45,
            tempWorldPos.current.z + viewDistance * 0.9
          );
        } else {
          const diff = tempWorldPos.current.clone().sub(controlsRef.current.target);
          camera.position.add(diff);
        }
      }

      controlsRef.current.target.lerp(desiredTarget.current, Math.min(delta * 4.5, 0.28));
      if (!isTracking.current) {
        camera.position.lerp(desiredCamPos.current, Math.min(delta * 4.5, 0.28));
        if (camera.position.distanceTo(desiredCamPos.current) < 0.3) {
          isTracking.current = true;
        }
      }

      controlsRef.current.minDistance = radius * 1.1;
      controlsRef.current.maxDistance = radius * 20;
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.06}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
      panSpeed={0.8}
      maxPolarAngle={Math.PI / 2 + 0.35}
    />
  );
};
