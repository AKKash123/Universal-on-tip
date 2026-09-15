'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PlanetData } from '@/data/planetsData';
import { AtmosphericHalo } from './AtmosphericHalo';
import { SaturnRings } from './SaturnRings';
import { OrbitTrail } from './OrbitTrail';

interface CelestialBodyProps {
  data: PlanetData;
  onSelect: (id: string) => void;
  isSelected: boolean;
  simulationSpeed: number;
  floatingEnabled: boolean;
  floatIntensity: number;
  showAtmospheres: boolean;
  showOrbits: boolean;
  registerTarget: (id: string, ref: THREE.Object3D) => void;
  moonData?: PlanetData;
  onSelectMoon?: (id: string) => void;
  isMoonSelected?: boolean;
}

export const CelestialBody: React.FC<CelestialBodyProps> = ({
  data,
  onSelect,
  isSelected,
  simulationSpeed,
  floatingEnabled,
  floatIntensity,
  showAtmospheres,
  showOrbits,
  registerTarget,
  moonData,
  onSelectMoon,
  isMoonSelected = false
}) => {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const bodyMeshRef = useRef<THREE.Mesh>(null);
  const cloudMeshRef = useRef<THREE.Mesh>(null);
  const moonOrbitGroupRef = useRef<THREE.Group>(null);
  const moonMeshRef = useRef<THREE.Mesh>(null);

  const orbitAngle = useRef<number>(Math.random() * Math.PI * 2);
  const moonOrbitAngle = useRef<number>(0);

  // Load textures
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const map = loader.load(data.texture);
    map.colorSpace = THREE.SRGBColorSpace;

    let normalMap: THREE.Texture | undefined;
    if (data.bumpMap) {
      normalMap = loader.load(data.bumpMap);
    }

    let roughnessMap: THREE.Texture | undefined;
    if (data.specularMap) {
      roughnessMap = loader.load(data.specularMap);
    }

    let cloudsMap: THREE.Texture | undefined;
    if (data.cloudsMap) {
      cloudsMap = loader.load(data.cloudsMap);
    }

    let nightMap: THREE.Texture | undefined;
    if (data.id === 'earth') {
      nightMap = loader.load('/textures/earth_lights.png');
      nightMap.colorSpace = THREE.SRGBColorSpace;
    }

    return { map, normalMap, roughnessMap, cloudsMap, nightMap };
  }, [data]);

  // Load Moon texture
  const moonTexture = useMemo(() => {
    if (!moonData) return null;
    const loader = new THREE.TextureLoader();
    const map = loader.load(moonData.texture);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, [moonData]);

  // Dynamic Earth Day/Night Terminator Shader
  const earthShader = useMemo(() => {
    if (data.id !== 'earth') return null;

    return {
      uniforms: {
        dayTexture: { value: textures.map },
        nightTexture: { value: textures.nightMap },
        sunDirection: { value: new THREE.Vector3(1, 0, 0) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormalWorld;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vNormalWorld = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        varying vec2 vUv;
        varying vec3 vNormalWorld;
        varying vec3 vWorldPos;

        void main() {
          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);

          // Vector pointing towards Sun [0, 0, 0]
          vec3 toSun = normalize(-vWorldPos);
          float sunDot = dot(vNormalWorld, toSun);

          // Smooth terminator transition
          float dayFactor = smoothstep(-0.15, 0.15, sunDot);

          // Atmospheric twilight red-orange sunset glow along terminator
          float twilight = smoothstep(0.2, 0.0, abs(sunDot)) * 0.35;
          vec3 twilightColor = vec3(1.0, 0.45, 0.15) * twilight;

          // Night city lights boosted for vibrant contrast
          vec3 nightGlow = nightColor.rgb * 1.8;

          vec3 finalRgb = mix(nightGlow, dayColor.rgb, dayFactor) + twilightColor;
          gl_FragColor = vec4(finalRgb, 1.0);
        }
      `
    };
  }, [data.id, textures]);

  // Register objects for camera tracking
  useEffect(() => {
    if (bodyMeshRef.current) {
      registerTarget(data.id, bodyMeshRef.current);
    }
  }, [data.id, registerTarget]);

  useEffect(() => {
    if (moonMeshRef.current && moonData) {
      registerTarget(moonData.id, moonMeshRef.current);
    }
  }, [moonData, registerTarget]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const dt = delta * simulationSpeed;

    // 1. Orbital position around Sun
    orbitAngle.current += (data.orbitSpeed * 0.05) * dt;
    const currentX = Math.cos(orbitAngle.current) * data.distance;
    const currentZ = Math.sin(orbitAngle.current) * data.distance;

    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = currentX;
      orbitGroupRef.current.position.z = currentZ;
    }

    // 2. Axial Rotation
    if (bodyMeshRef.current) {
      bodyMeshRef.current.rotation.y += data.rotationSpeed * (delta * 60);

      // 3. Anti-Gravity Zero-G Floating Mechanics
      if (floatingEnabled) {
        const sineY = Math.sin(elapsed * data.floatFreq + data.floatPhase) * (data.floatAmp * floatIntensity);
        const harmonicY = Math.cos(elapsed * (data.floatFreq * 0.73) + data.floatPhase) * (data.floatAmp * 0.3 * floatIntensity);
        bodyMeshRef.current.position.y = sineY + harmonicY;
      } else {
        bodyMeshRef.current.position.y = THREE.MathUtils.lerp(bodyMeshRef.current.position.y, 0, delta * 4);
      }
    }

    // 4. Clouds rotation
    if (cloudMeshRef.current && bodyMeshRef.current) {
      cloudMeshRef.current.rotation.y += (data.rotationSpeed * 1.25) * (delta * 60);
      cloudMeshRef.current.position.y = bodyMeshRef.current.position.y;
    }

    // 5. Moon Orbit around Earth
    if (moonOrbitGroupRef.current && moonMeshRef.current && moonData) {
      moonOrbitAngle.current += (moonData.orbitSpeed * 0.2) * dt;
      moonOrbitGroupRef.current.position.x = Math.cos(moonOrbitAngle.current) * moonData.distance;
      moonOrbitGroupRef.current.position.z = Math.sin(moonOrbitAngle.current) * moonData.distance;

      moonMeshRef.current.rotation.y += moonData.rotationSpeed * (delta * 60);

      if (floatingEnabled) {
        moonMeshRef.current.position.y = Math.sin(elapsed * moonData.floatFreq + moonData.floatPhase) * (moonData.floatAmp * floatIntensity);
      } else {
        moonMeshRef.current.position.y = THREE.MathUtils.lerp(moonMeshRef.current.position.y, 0, delta * 4);
      }
    }
  });

  return (
    <>
      {/* Orbital Trajectory */}
      {showOrbits && (
        <OrbitTrail
          radius={data.distance}
          color={data.orbitColor}
          opacity={isSelected ? 0.65 : 0.22}
        />
      )}

      {/* Main Orbit Group */}
      <group ref={orbitGroupRef}>
        {/* Planet Axial Tilt */}
        <group rotation={[0, 0, (data.tilt * Math.PI) / 180]}>
          <mesh
            ref={bodyMeshRef}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(data.id);
            }}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[data.radius, 64, 64]} />

            {/* Earth Day/Night Terminator Material */}
            {earthShader ? (
              <shaderMaterial
                vertexShader={earthShader.vertexShader}
                fragmentShader={earthShader.fragmentShader}
                uniforms={earthShader.uniforms}
              />
            ) : (
              <meshStandardMaterial
                map={textures.map}
                normalMap={textures.normalMap}
                roughnessMap={textures.roughnessMap}
                roughness={data.type === 'Gas Giant' || data.type === 'Ice Giant' ? 0.9 : 0.6}
                metalness={0.05}
              />
            )}

            {/* Selected Hologram Ring */}
            {isSelected && (
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[data.radius * 1.35, data.radius * 1.4, 64]} />
                <meshBasicMaterial
                  color="#38bdf8"
                  side={THREE.DoubleSide}
                  transparent={true}
                  opacity={0.8}
                />
              </mesh>
            )}

            {/* Atmospheric Halo Mesh with Soft Fresnel Rim Glow */}
            {showAtmospheres && data.hasAtmosphere && (
              <AtmosphericHalo
                radius={data.radius}
                color={data.atmosphereColor}
                intensity={data.atmosphereIntensity}
                scale={data.type === 'Gas Giant' || data.type === 'Ice Giant' ? 1.12 : 1.18}
                power={data.type === 'Gas Giant' ? 2.6 : 3.4}
              />
            )}

            {/* Earth Rotating Cloud Layer */}
            {textures.cloudsMap && (
              <mesh ref={cloudMeshRef} scale={[1.025, 1.025, 1.025]}>
                <sphereGeometry args={[data.radius, 48, 48]} />
                <meshStandardMaterial
                  map={textures.cloudsMap}
                  transparent={true}
                  opacity={0.55}
                  blending={THREE.NormalBlending}
                  depthWrite={false}
                />
              </mesh>
            )}

            {/* Saturn Ring System with Dynamic Planet Shadow */}
            {data.hasRings && data.ringInner && data.ringOuter && (
              <SaturnRings
                innerRadius={data.ringInner}
                outerRadius={data.ringOuter}
                ringTexturePath={data.ringTexture}
                saturnRadius={data.radius}
              />
            )}
          </mesh>
        </group>

        {/* Earth's Moon */}
        {moonData && (
          <>
            {showOrbits && (
              <OrbitTrail
                radius={moonData.distance}
                color="#94a3b8"
                opacity={isMoonSelected ? 0.5 : 0.15}
                segments={64}
              />
            )}

            <group ref={moonOrbitGroupRef}>
              <mesh
                ref={moonMeshRef}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectMoon) onSelectMoon(moonData.id);
                }}
              >
                <sphereGeometry args={[moonData.radius, 32, 32]} />
                <meshStandardMaterial
                  map={moonTexture || undefined}
                  roughness={0.9}
                  metalness={0.0}
                  color={moonTexture ? '#ffffff' : '#94a3b8'}
                />

                {isMoonSelected && (
                  <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[moonData.radius * 1.4, moonData.radius * 1.5, 32]} />
                    <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
                  </mesh>
                )}
              </mesh>
            </group>
          </>
        )}
      </group>
    </>
  );
};
