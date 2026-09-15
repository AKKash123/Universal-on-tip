'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createCircularRingTexture } from '@/utils/textureGenerator';

interface SaturnRingsProps {
  innerRadius: number;
  outerRadius: number;
  ringTexturePath?: string;
  saturnRadius?: number;
}

export const SaturnRings: React.FC<SaturnRingsProps> = ({
  innerRadius,
  outerRadius,
  ringTexturePath = '/textures/saturn_ring.png',
  saturnRadius = 2.3
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowMeshRef = useRef<THREE.Mesh>(null);

  // Procedural fallback ring texture
  const proceduralTexture = useMemo(() => {
    return createCircularRingTexture(1024);
  }, []);

  const ringTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    try {
      const tex = loader.load(
        ringTexturePath,
        () => {},
        undefined,
        () => {
          console.warn('Fallback to procedural ring texture');
        }
      );
      return tex;
    } catch {
      return proceduralTexture;
    }
  }, [ringTexturePath, proceduralTexture]);

  // Ring geometry with radial UV coordinates
  const ringGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 128, 4);
    const pos = geometry.attributes.position;
    const v3 = new THREE.Vector3();
    const uvs: number[] = [];

    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      const dist = v3.length();
      const u = (dist - innerRadius) / (outerRadius - innerRadius);
      const v = (Math.atan2(v3.y, v3.x) / (Math.PI * 2)) + 0.5;
      uvs.push(u, v);
    }
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    return geometry;
  }, [innerRadius, outerRadius]);

  // Custom Shader Material to cast realistic shadow of Saturn onto its rings
  const ringShader = useMemo(() => {
    return {
      uniforms: {
        ringTexture: { value: ringTexture || proceduralTexture },
        sunDirection: { value: new THREE.Vector3(1, 0, 0) },
        saturnRadius: { value: saturnRadius }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vLocalPos;
        void main() {
          vUv = uv;
          vLocalPos = position;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D ringTexture;
        uniform vec3 sunDirection;
        uniform float saturnRadius;
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vLocalPos;

        void main() {
          vec4 texColor = texture2D(ringTexture, vUv);
          if (texColor.a < 0.05) discard;

          // Planetary Umbra Shadow: points on the opposite side of Sun receive shadow
          // In Saturn local coordinate space, project point along sun direction
          vec3 sunDirNorm = normalize(sunDirection);
          
          // Distance along shadow axis
          float shadowAxis = dot(vWorldPos, sunDirNorm);
          
          // Perpendicular distance to shadow cylinder
          vec3 perpVec = vWorldPos - (sunDirNorm * shadowAxis);
          float perpDist = length(perpVec);

          // If on night-side and inside cylindrical shadow cone of Saturn
          float shadowFactor = 1.0;
          if (shadowAxis > 0.0 && perpDist < (saturnRadius * 1.05)) {
            float edgeSoftness = smoothstep(saturnRadius * 0.9, saturnRadius * 1.05, perpDist);
            shadowFactor = mix(0.08, 1.0, edgeSoftness);
          }

          gl_FragColor = vec4(texColor.rgb * shadowFactor, texColor.a * 0.92);
        }
      `
    };
  }, [ringTexture, proceduralTexture, saturnRadius]);

  // Update sun direction in shader based on Saturn's current orbital position
  useFrame(() => {
    if (meshRef.current) {
      const saturnWorldPos = new THREE.Vector3();
      meshRef.current.getWorldPosition(saturnWorldPos);
      // Vector pointing from Sun [0,0,0] to Saturn
      ringShader.uniforms.sunDirection.value.copy(saturnWorldPos.normalize());
    }
  });

  return (
    <group rotation={[-Math.PI / 2 + 0.1, 0, 0]}>
      {/* Primary Ring Mesh with realistic optical shadow */}
      <mesh ref={meshRef} geometry={ringGeometry}>
        <shaderMaterial
          vertexShader={ringShader.vertexShader}
          fragmentShader={ringShader.fragmentShader}
          uniforms={ringShader.uniforms}
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Subtle icy glow backscatter */}
      <mesh ref={glowMeshRef} geometry={ringGeometry} scale={[1.002, 1.002, 1.002]}>
        <meshBasicMaterial
          map={proceduralTexture}
          transparent={true}
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
