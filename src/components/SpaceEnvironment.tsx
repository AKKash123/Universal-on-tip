'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';

export const SpaceEnvironment: React.FC = () => {
  const dustGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (dustGroupRef.current) {
      // Gentle cosmic drift of the entire dust suspension
      dustGroupRef.current.rotation.y += 0.0008 * (delta * 60);
      dustGroupRef.current.rotation.x += 0.0004 * (delta * 60);
    }
  });

  return (
    <>
      {/* Background Starfield */}
      <Stars
        radius={250}
        depth={80}
        count={5000}
        factor={4}
        saturation={0.5}
        fade={true}
        speed={0.5}
      />

      {/* Floating Ambient Space Dust Particles inside Anti-Gravity Chamber */}
      <group ref={dustGroupRef}>
        {/* Fine gold/amber solar dust particles near inner system */}
        <Sparkles
          count={150}
          scale={[60, 20, 60]}
          size={3.2}
          speed={0.25}
          color="#fde047"
          opacity={0.65}
        />

        {/* Ethereal cyan/ice cosmic dust particles drifting throughout planetary disc */}
        <Sparkles
          count={250}
          scale={[180, 40, 180]}
          size={2.8}
          speed={0.15}
          color="#38bdf8"
          opacity={0.5}
        />

        {/* Distant white stardust speckles */}
        <Sparkles
          count={200}
          scale={[240, 50, 240]}
          size={2.0}
          speed={0.1}
          color="#ffffff"
          opacity={0.4}
        />
      </group>
    </>
  );
};
