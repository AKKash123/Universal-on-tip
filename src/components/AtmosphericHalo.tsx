'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface AtmosphericHaloProps {
  radius: number;
  color: string;
  intensity?: number;
  scale?: number;
  power?: number;
}

export const AtmosphericHalo: React.FC<AtmosphericHaloProps> = ({
  radius,
  color,
  intensity = 1.0,
  scale = 1.18,
  power = 3.2
}) => {
  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  const shader = useMemo(() => {
    return {
      uniforms: {
        glowColor: { value: threeColor },
        c: { value: 0.8 },
        p: { value: power },
        intensity: { value: intensity }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float c;
        uniform float p;
        uniform float intensity;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          
          // Fresnel effect: bright along grazing rims, fading toward center
          float fresnel = 1.0 - max(0.0, dot(normal, viewDir));
          fresnel = pow(fresnel, p) * c * intensity;
          
          gl_FragColor = vec4(glowColor, fresnel);
        }
      `
    };
  }, [threeColor, power, intensity]);

  return (
    <mesh scale={[scale, scale, scale]}>
      <sphereGeometry args={[radius, 48, 48]} />
      <shaderMaterial
        vertexShader={shader.vertexShader}
        fragmentShader={shader.fragmentShader}
        uniforms={shader.uniforms}
        blending={THREE.AdditiveBlending}
        transparent={true}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
};
