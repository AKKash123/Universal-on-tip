'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SUN_DATA } from '@/data/planetsData';

interface SunProps {
  onSelect: (id: string) => void;
  isSelected: boolean;
  floatingEnabled?: boolean;
}

export const Sun: React.FC<SunProps> = ({
  onSelect,
  isSelected,
  floatingEnabled = true,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const prominenceGroupRef = useRef<THREE.Group>(null);

  // Load Sun texture
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(SUN_DATA.texture);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Procedural flare loops
  const flareAngles = useMemo(() => [0.4, 1.8, 3.2, 4.7, 5.6], []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Axial rotation of the solar photosphere
    if (meshRef.current) {
      meshRef.current.rotation.y += SUN_DATA.rotationSpeed * (delta * 60);

      if (floatingEnabled) {
        meshRef.current.position.y = Math.sin(t * 0.5) * 0.25;
      } else {
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, delta * 3);
      }
    }

    // Corona pulsation and turbulence
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= 0.003 * (delta * 60);
      coronaRef.current.rotation.z += 0.002 * (delta * 60);
      const pulse = 1 + Math.sin(t * 2.2) * 0.04 + Math.cos(t * 3.7) * 0.02;
      coronaRef.current.scale.set(pulse, pulse, pulse);
    }

    if (outerGlowRef.current) {
      const outerPulse = 1 + Math.cos(t * 1.1) * 0.03;
      outerGlowRef.current.scale.set(outerPulse, outerPulse, outerPulse);
    }

    // Dynamic solar prominences (erupting plasma loops)
    if (prominenceGroupRef.current) {
      prominenceGroupRef.current.rotation.z += 0.004 * (delta * 60);
      const loopScale = 1.0 + Math.sin(t * 1.8) * 0.08;
      prominenceGroupRef.current.scale.set(loopScale, loopScale, loopScale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Omnidirectional Solar Light */}
      <pointLight
        color="#fff5cc"
        intensity={16000}
        distance={400}
        decay={1.6}
      />
      <ambientLight intensity={0.12} />

      {/* Main Solar Sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(SUN_DATA.id);
        }}
        castShadow={false}
        receiveShadow={false}
      >
        <sphereGeometry args={[SUN_DATA.radius, 64, 64]} />
        <meshBasicMaterial
          map={texture}
          color="#ffffff"
        />

        {isSelected && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[SUN_DATA.radius * 1.25, SUN_DATA.radius * 1.28, 64]} />
            <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
          </mesh>
        )}
      </mesh>

      {/* Coronal Prominences (Plasma Loops) */}
      <group ref={prominenceGroupRef}>
        {flareAngles.map((angle, idx) => (
          <mesh
            key={idx}
            position={[
              Math.cos(angle) * (SUN_DATA.radius * 1.05),
              Math.sin(angle) * (SUN_DATA.radius * 1.05),
              0
            ]}
            rotation={[0, 0, angle + Math.PI / 2]}
          >
            <torusGeometry args={[SUN_DATA.radius * 0.16, 0.14, 16, 32, Math.PI]} />
            <meshBasicMaterial
              color="#ff4400"
              transparent={true}
              opacity={0.65}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Inner Corona Layer */}
      <mesh ref={coronaRef} scale={[1.12, 1.12, 1.12]}>
        <sphereGeometry args={[SUN_DATA.radius, 48, 48]} />
        <meshBasicMaterial
          color="#ff7700"
          transparent={true}
          opacity={0.38}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Flare Glow */}
      <mesh ref={outerGlowRef} scale={[1.3, 1.3, 1.3]}>
        <sphereGeometry args={[SUN_DATA.radius, 48, 48]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent={true}
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Distant Volumetric Stellar Radiance */}
      <mesh scale={[1.52, 1.52, 1.52]}>
        <sphereGeometry args={[SUN_DATA.radius, 32, 32]} />
        <meshBasicMaterial
          color="#ff3300"
          transparent={true}
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
