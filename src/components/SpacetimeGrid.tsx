'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PlanetData, SUN_DATA } from '@/data/planetsData';

interface SpacetimeGridProps {
  targetRegistry: React.MutableRefObject<Record<string, THREE.Object3D>>;
  planets: PlanetData[];
  depthScale?: number;
}

export const SpacetimeGrid: React.FC<SpacetimeGridProps> = ({
  targetRegistry,
  planets,
  depthScale = 1.0
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const size = 260;
  const segments = 120;

  // Base plane geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2); // Lay flat on X-Z plane
    return geo;
  }, [size, segments]);

  // Planet masses for gravitational potential calculation
  const planetMasses = useMemo(() => {
    const map: Record<string, number> = {
      mercury: 1.5,
      venus: 3.5,
      earth: 4.0,
      mars: 2.2,
      jupiter: 16.0,
      saturn: 11.0,
      uranus: 7.0,
      neptune: 6.8,
      moon: 0.8
    };
    return map;
  }, []);

  const tempPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const vertexCount = posAttr.count;

    // Cache active planet positions
    const activePositions: { x: number; z: number; mass: number }[] = [];
    for (const p of planets) {
      const obj = targetRegistry.current[p.id];
      if (obj) {
        obj.getWorldPosition(tempPos);
        activePositions.push({
          x: tempPos.x,
          z: tempPos.z,
          mass: (planetMasses[p.id] || 3.0) * depthScale
        });
      }
    }

    const sunMass = 45.0 * depthScale;

    // Update Y coordinates based on Einsteinian General Relativity gravitational well formula
    for (let i = 0; i < vertexCount; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);

      // 1. Solar Gravitational Singularity Well
      const distSunSq = vx * vx + vz * vz;
      let yDisp = -sunMass / (Math.sqrt(distSunSq) + 6.0);

      // 2. Orbital Planet Gravitational Depressions
      for (let j = 0; j < activePositions.length; j++) {
        const dx = vx - activePositions[j].x;
        const dz = vz - activePositions[j].z;
        const distSq = dx * dx + dz * dz;
        yDisp -= activePositions[j].mass / (Math.sqrt(distSq) + 2.5);
      }

      posAttr.setY(i, yDisp);
    }

    posAttr.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <group position={[0, -2.5, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial
          color="#06b6d4"
          wireframe={true}
          transparent={true}
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
