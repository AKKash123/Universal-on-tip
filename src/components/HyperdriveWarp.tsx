'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface HyperdriveWarpProps {
  isWarping: boolean;
}

export const HyperdriveWarp: React.FC<HyperdriveWarpProps> = ({ isWarping }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();
  const count = 400;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Cylinder distribution around camera
      const theta = Math.random() * Math.PI * 2;
      const r = 2.0 + Math.random() * 25.0;
      pos[i3] = Math.cos(theta) * r;
      pos[i3 + 1] = Math.sin(theta) * r;
      pos[i3 + 2] = (Math.random() - 0.5) * 80.0;

      vel[i3 + 2] = 40.0 + Math.random() * 60.0;
    }
    return [pos, vel];
  }, [count]);

  const opacityRef = useRef(0);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    // Smoothly fade in/out warp streak opacity
    const targetOpacity = isWarping ? 0.9 : 0.0;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, delta * 6.0);
    (pointsRef.current.material as THREE.PointsMaterial).opacity = opacityRef.current;

    if (opacityRef.current < 0.01) return;

    // Keep warp streaks centered on camera position
    pointsRef.current.position.copy(camera.position);
    pointsRef.current.quaternion.copy(camera.quaternion);

    const posAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let z = posAttr.getZ(i);
      z += velocities[i3 + 2] * delta;
      if (z > 40) z = -40;
      posAttr.setZ(i, z);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#38bdf8"
        size={1.4}
        transparent={true}
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
