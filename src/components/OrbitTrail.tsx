'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface OrbitTrailProps {
  radius: number;
  color?: string;
  opacity?: number;
  segments?: number;
}

export const OrbitTrail: React.FC<OrbitTrailProps> = ({
  radius,
  color = '#38bdf8',
  opacity = 0.25,
  segments = 128
}) => {
  const lineObject = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      linewidth: 1
    });
    return new THREE.Line(geometry, material);
  }, [radius, segments, color, opacity]);

  return <primitive object={lineObject} />;
};
