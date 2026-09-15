'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface AsteroidBeltProps {
  count?: number;
  simulationSpeed?: number;
}

export const AsteroidBelt: React.FC<AsteroidBeltProps> = ({
  count = 1200,
  simulationSpeed = 1.0
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Precompute orbital parameters for each asteroid
  const asteroidsData = useMemo(() => {
    const data = [];
    const minRadius = 45.0;
    const maxRadius = 50.5;

    for (let i = 0; i < count; i++) {
      // Gaussian-like concentration around 47.5
      const r = minRadius + Math.random() * (maxRadius - minRadius);
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.4 + Math.random() * 0.2) * (45 / r);
      const yOffset = (Math.random() - 0.5) * 2.2;
      const scale = 0.04 + Math.random() * 0.12;
      const rotSpeedX = (Math.random() - 0.5) * 2.0;
      const rotSpeedY = (Math.random() - 0.5) * 2.0;

      data.push({
        radius: r,
        angle,
        speed,
        yOffset,
        scale,
        rotSpeedX,
        rotSpeedY,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI
      });
    }
    return data;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Irregular asteroid geometry (dodecahedron with slight jitter)
  const geometry = useMemo(() => {
    const geo = new THREE.DodecahedronGeometry(1, 1);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = 1 + (Math.random() - 0.5) * 0.35;
      pos.setXYZ(i, pos.getX(i) * u, pos.getY(i) * u, pos.getZ(i) * u);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const dt = delta * simulationSpeed;

    for (let i = 0; i < count; i++) {
      const ast = asteroidsData[i];
      ast.angle += ast.speed * 0.05 * dt;
      ast.rotX += ast.rotSpeedX * dt;
      ast.rotY += ast.rotSpeedY * dt;

      const x = Math.cos(ast.angle) * ast.radius;
      const z = Math.sin(ast.angle) * ast.radius;

      dummy.position.set(x, ast.yOffset, z);
      dummy.rotation.set(ast.rotX, ast.rotY, 0);
      dummy.scale.set(ast.scale, ast.scale, ast.scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined as any, count]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color="#78716c"
        roughness={0.9}
        metalness={0.2}
      />
    </instancedMesh>
  );
};
