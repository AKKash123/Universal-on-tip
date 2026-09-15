'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CometProps {
  onSelect: (id: string) => void;
  isSelected: boolean;
  simulationSpeed: number;
  registerTarget: (id: string, ref: THREE.Object3D) => void;
}

export const Comet: React.FC<CometProps> = ({
  onSelect,
  isSelected,
  simulationSpeed,
  registerTarget
}) => {
  const cometGroupRef = useRef<THREE.Group>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const ionTailRef = useRef<THREE.Mesh>(null);
  const dustTailRef = useRef<THREE.Mesh>(null);

  const angleRef = useRef<number>(1.2);

  useEffect(() => {
    if (nucleusRef.current) {
      registerTarget('comet', nucleusRef.current);
    }
  }, [registerTarget]);

  // Elliptical orbital parameters for Halley-like comet
  // a = semi-major axis, e = eccentricity, i = inclination
  const a = 65.0;
  const e = 0.75;
  const b = a * Math.sqrt(1 - e * e); // semi-minor axis

  // Precomputed orbit line points
  const orbitGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * a - a * e;
      const z = Math.sin(theta) * b;
      const y = Math.sin(theta) * 12.0; // 18 degree inclination
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [a, b, e]);

  const lineObject = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.25,
      linewidth: 1
    });
    return new THREE.Line(orbitGeometry, mat);
  }, [orbitGeometry]);

  useFrame((_, delta) => {
    const dt = delta * simulationSpeed;
    // Kepler's second law approximation: moves much faster at perihelion
    const x = Math.cos(angleRef.current) * a - a * e;
    const z = Math.sin(angleRef.current) * b;
    const y = Math.sin(angleRef.current) * 12.0;

    const r = Math.sqrt(x * x + y * y + z * z);
    const angularSpeed = (25.0 / (r * r + 10.0)) * 0.4;
    angleRef.current -= angularSpeed * dt; // Retrograde motion

    if (cometGroupRef.current) {
      cometGroupRef.current.position.set(x, y, z);

      // Tail always points directly away from the Sun (origin [0, 0, 0])
      const fromSun = new THREE.Vector3(x, y, z).normalize();
      
      // Dynamic tail length: longer when closer to the Sun due to intense sublimation
      const tailLength = Math.max(3.0, (120.0 / (r + 5.0)) * 6.0);
      const tailOpacity = Math.min(0.85, (50.0 / (r + 10.0)));

      if (ionTailRef.current) {
        ionTailRef.current.lookAt(fromSun.clone().multiplyScalar(100).add(cometGroupRef.current.position));
        ionTailRef.current.scale.set(1.0, 1.0, tailLength);
        (ionTailRef.current.material as THREE.MeshBasicMaterial).opacity = tailOpacity;
      }

      if (dustTailRef.current) {
        dustTailRef.current.lookAt(fromSun.clone().multiplyScalar(100).add(cometGroupRef.current.position));
        dustTailRef.current.rotation.y += 0.25; // Slight orbital curve lag
        dustTailRef.current.scale.set(1.4, 1.4, tailLength * 0.8);
        (dustTailRef.current.material as THREE.MeshBasicMaterial).opacity = tailOpacity * 0.6;
      }
    }
  });

  return (
    <>
      <primitive object={lineObject} />

      <group ref={cometGroupRef}>
        {/* Icy Nucleus */}
        <mesh
          ref={nucleusRef}
          onClick={(e) => {
            e.stopPropagation();
            onSelect('comet');
          }}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
        </mesh>

        {/* Selected target ring */}
        {isSelected && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.6, 0.7, 32]} />
            <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Coma (Gaseous cloud surrounding nucleus) */}
        <mesh scale={[1.8, 1.8, 1.8]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial
            color="#67e8f9"
            transparent={true}
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Glowing Electric Blue Ion Tail */}
        <mesh ref={ionTailRef} position={[0, 0, 0]}>
          <coneGeometry args={[0.35, 1, 16]} />
          <meshBasicMaterial
            color="#0ea5e9"
            transparent={true}
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Soft Golden Dust Tail */}
        <mesh ref={dustTailRef} position={[0, 0, 0]}>
          <coneGeometry args={[0.6, 1, 16]} />
          <meshBasicMaterial
            color="#fed7aa"
            transparent={true}
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </>
  );
};
