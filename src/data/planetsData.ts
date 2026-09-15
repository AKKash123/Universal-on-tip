export interface PlanetData {
  id: string;
  name: string;
  tagline: string;
  type: 'Star' | 'Terrestrial Planet' | 'Gas Giant' | 'Ice Giant' | 'Natural Satellite';
  radius: number; // scaled visual size
  distance: number; // scaled orbital distance from center
  orbitSpeed: number; // orbital angular velocity relative scale
  rotationSpeed: number; // axial rotation speed
  tilt: number; // axial tilt in degrees
  texture: string;
  bumpMap?: string;
  specularMap?: string;
  cloudsMap?: string;
  hasAtmosphere: boolean;
  atmosphereColor: string;
  atmosphereIntensity: number;
  hasRings?: boolean;
  ringInner?: number;
  ringOuter?: number;
  ringTexture?: string;
  color: string;
  orbitColor: string;
  // Zero-G floating parameters
  floatFreq: number;
  floatAmp: number;
  floatPhase: number;
  // NASA Scientific & Exploration Facts
  facts: {
    diameterKm: string;
    massKg: string;
    distanceFromSunKm: string;
    orbitalPeriod: string;
    rotationPeriod: string;
    surfaceGravity: string;
    avgTemp: string;
    moonsCount: number;
    atmosphericComposition: string[];
    description: string;
    explorationTrivia: string;
  };
}

export const PLANETS_DATA: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    tagline: 'The Swift, Sun-Scorched Messenger',
    type: 'Terrestrial Planet',
    radius: 0.6,
    distance: 14,
    orbitSpeed: 4.15,
    rotationSpeed: 0.005,
    tilt: 0.034,
    texture: '/textures/mercury.jpg',
    hasAtmosphere: false,
    atmosphereColor: '#a8a29e',
    atmosphereIntensity: 0.2,
    color: '#a3a3a3',
    orbitColor: '#78716c',
    floatFreq: 1.8,
    floatAmp: 0.45,
    floatPhase: 0.2,
    facts: {
      diameterKm: '4,879 km',
      massKg: '3.301 × 10^23 kg (0.055 Earths)',
      distanceFromSunKm: '57.9 million km (0.39 AU)',
      orbitalPeriod: '87.97 Earth days',
      rotationPeriod: '58.65 Earth days',
      surfaceGravity: '3.7 m/s² (0.38 g)',
      avgTemp: '167°C (Range: -180°C to 430°C)',
      moonsCount: 0,
      atmosphericComposition: ['Oxygen (42%)', 'Sodium (29%)', 'Hydrogen (22%)', 'Helium (6%)'],
      description: 'The smallest planet in our solar system and nearest to the Sun, Mercury is only slightly larger than Earth\'s Moon. Its surface is scarred by billions of years of impact craters and extreme temperature swings.',
      explorationTrivia: 'NASA\'s MESSENGER orbiter revealed that Mercury contains water ice at its permanently shadowed polar craters, despite daytime temperatures hot enough to melt lead.'
    }
  },
  {
    id: 'venus',
    name: 'Venus',
    tagline: 'Earth\'s Toxic Twin Under Runaway Greenhouse',
    type: 'Terrestrial Planet',
    radius: 1.1,
    distance: 21,
    orbitSpeed: 1.62,
    rotationSpeed: -0.002, // Retrograde rotation
    tilt: 177.3,
    texture: '/textures/venus.jpg',
    hasAtmosphere: true,
    atmosphereColor: '#f59e0b',
    atmosphereIntensity: 1.2,
    color: '#eab308',
    orbitColor: '#d97706',
    floatFreq: 1.3,
    floatAmp: 0.55,
    floatPhase: 1.1,
    facts: {
      diameterKm: '12,104 km',
      massKg: '4.867 × 10^24 kg (0.815 Earths)',
      distanceFromSunKm: '108.2 million km (0.72 AU)',
      orbitalPeriod: '224.7 Earth days',
      rotationPeriod: '243 Earth days (Retrograde)',
      surfaceGravity: '8.87 m/s² (0.90 g)',
      avgTemp: '464°C (Hottest planet)',
      moonsCount: 0,
      atmosphericComposition: ['Carbon Dioxide (96.5%)', 'Nitrogen (3.5%)', 'Sulfur Dioxide (0.015%)'],
      description: 'Spinning in the opposite direction to most planets, Venus is cloaked in a dense, suffocating blanket of carbon dioxide and clouds of sulfuric acid, generating the most extreme greenhouse effect in the solar system.',
      explorationTrivia: 'NASA\'s Magellan spacecraft mapped 98% of the surface using radar, revealing thousands of volcanoes, fracture zones, and pancake-shaped volcanic domes.'
    }
  },
  {
    id: 'earth',
    name: 'Earth',
    tagline: 'The Living Oasis of Liquid Water & Life',
    type: 'Terrestrial Planet',
    radius: 1.25,
    distance: 30,
    orbitSpeed: 1.0,
    rotationSpeed: 0.015,
    tilt: 23.44,
    texture: '/textures/earth_atmos.jpg',
    bumpMap: '/textures/earth_normal.jpg',
    specularMap: '/textures/earth_specular.jpg',
    cloudsMap: '/textures/earth_clouds.png',
    hasAtmosphere: true,
    atmosphereColor: '#38bdf8',
    atmosphereIntensity: 1.4,
    color: '#38bdf8',
    orbitColor: '#0284c7',
    floatFreq: 1.1,
    floatAmp: 0.6,
    floatPhase: 2.3,
    facts: {
      diameterKm: '12,742 km',
      massKg: '5.972 × 10^24 kg',
      distanceFromSunKm: '149.6 million km (1.00 AU)',
      orbitalPeriod: '365.25 Earth days',
      rotationPeriod: '23h 56m 4s',
      surfaceGravity: '9.807 m/s² (1.0 g)',
      avgTemp: '15°C',
      moonsCount: 1,
      atmosphericComposition: ['Nitrogen (78.1%)', 'Oxygen (20.9%)', 'Argon (0.93%)', 'Water Vapor / CO2 (0.04%)'],
      description: 'Our home planet is the only known celestial harbor of life, shielded by a robust magnetosphere, abundant liquid oceans covering 71% of its surface, and a protective oxygen-rich atmosphere.',
      explorationTrivia: 'NASA satellites continuously monitor Earth from low-Earth orbit, tracking global currents, ice-sheet dynamics, and atmospheric greenhouse gas concentrations.'
    }
  },
  {
    id: 'moon',
    name: 'The Moon',
    tagline: 'Earth\'s Tidal Anchor & Lunar Sentinel',
    type: 'Natural Satellite',
    radius: 0.35,
    distance: 3.2, // relative to Earth
    orbitSpeed: 5.0,
    rotationSpeed: 0.01,
    tilt: 6.68,
    texture: '/textures/moon.jpg',
    hasAtmosphere: false,
    atmosphereColor: '#94a3b8',
    atmosphereIntensity: 0.1,
    color: '#cbd5e1',
    orbitColor: '#64748b',
    floatFreq: 2.1,
    floatAmp: 0.25,
    floatPhase: 0.5,
    facts: {
      diameterKm: '3,474 km',
      massKg: '7.342 × 10^22 kg (0.012 Earths)',
      distanceFromSunKm: '149.6 million km (Orbital parent: Earth at 384,400 km)',
      orbitalPeriod: '27.3 Earth days (Tidally locked)',
      rotationPeriod: '27.3 Earth days',
      surfaceGravity: '1.62 m/s² (0.166 g)',
      avgTemp: '-20°C (Range: -130°C to 120°C)',
      moonsCount: 0,
      atmosphericComposition: ['Exosphere: Helium, Neon, Hydrogen (Trace)'],
      description: 'Earth\'s sole natural satellite stabilizes our planet\'s axial tilt and drives the ocean tides. Its ancient regolith records the turbulent bombardment epoch of the early solar system.',
      explorationTrivia: 'Twelve Apollo astronauts walked on the Moon between 1969 and 1972. NASA\'s upcoming Artemis program will establish the first permanent lunar base camp at the South Pole.'
    }
  },
  {
    id: 'mars',
    name: 'Mars',
    tagline: 'The Red Planet of Ancient Rivers & Canyons',
    type: 'Terrestrial Planet',
    radius: 0.8,
    distance: 40,
    orbitSpeed: 0.53,
    rotationSpeed: 0.014,
    tilt: 25.19,
    texture: '/textures/mars.jpg',
    hasAtmosphere: true,
    atmosphereColor: '#fb923c',
    atmosphereIntensity: 0.7,
    color: '#ef4444',
    orbitColor: '#b91c1c',
    floatFreq: 1.25,
    floatAmp: 0.5,
    floatPhase: 3.4,
    facts: {
      diameterKm: '6,779 km',
      massKg: '6.417 × 10^23 kg (0.107 Earths)',
      distanceFromSunKm: '227.9 million km (1.52 AU)',
      orbitalPeriod: '687 Earth days (1.88 Earth years)',
      rotationPeriod: '24h 37m 22s',
      surfaceGravity: '3.72 m/s² (0.38 g)',
      avgTemp: '-63°C (Range: -140°C to 20°C)',
      moonsCount: 2,
      atmosphericComposition: ['Carbon Dioxide (95.3%)', 'Nitrogen (2.6%)', 'Argon (1.9%)', 'Oxygen (0.13%)'],
      description: 'Home to Olympus Mons (the solar system\'s largest shield volcano) and Valles Marineris (a canyon system that dwarfs the Grand Canyon), Mars preserves clear geologic records of ancient rivers and lakes.',
      explorationTrivia: 'NASA\'s Perseverance rover and Ingenuity helicopter are actively searching for signs of ancient microbial biosignatures in Jezero Crater.'
    }
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    tagline: 'King of the Planets & Gravitational Guardian',
    type: 'Gas Giant',
    radius: 2.8,
    distance: 55,
    orbitSpeed: 0.28,
    rotationSpeed: 0.035,
    tilt: 3.13,
    texture: '/textures/jupiter.jpg',
    hasAtmosphere: true,
    atmosphereColor: '#fdba74',
    atmosphereIntensity: 1.5,
    color: '#f97316',
    orbitColor: '#c2410c',
    floatFreq: 0.8,
    floatAmp: 0.7,
    floatPhase: 4.2,
    facts: {
      diameterKm: '139,820 km (11 Earths across)',
      massKg: '1.898 × 10^27 kg (318 Earths)',
      distanceFromSunKm: '778.5 million km (5.20 AU)',
      orbitalPeriod: '11.86 Earth years',
      rotationPeriod: '9h 55m (Fastest planetary rotation)',
      surfaceGravity: '24.79 m/s² (2.53 g)',
      avgTemp: '-110°C',
      moonsCount: 95,
      atmosphericComposition: ['Hydrogen (89.8%)', 'Helium (10.2%)', 'Methane, Ammonia, Water (Trace)'],
      description: 'More than twice as massive as all other planets combined, Jupiter\'s swirling striped atmosphere is driven by internal heat and violent jet streams, featuring the centuries-old Great Red Spot storm.',
      explorationTrivia: 'NASA\'s Juno spacecraft orbits Jupiter in polar trajectories, peeling back layers of its intense radiation belts to measure its deep water abundance and fuzzy metallic-hydrogen core.'
    }
  },
  {
    id: 'saturn',
    name: 'Saturn',
    tagline: 'The Jewel of the Solar System with Splendid Icy Rings',
    type: 'Gas Giant',
    radius: 2.3,
    distance: 72,
    orbitSpeed: 0.18,
    rotationSpeed: 0.032,
    tilt: 26.73,
    texture: '/textures/saturn.jpg',
    hasAtmosphere: true,
    atmosphereColor: '#fde047',
    atmosphereIntensity: 1.3,
    hasRings: true,
    ringInner: 3.2,
    ringOuter: 5.8,
    ringTexture: '/textures/saturn_ring.png',
    color: '#eab308',
    orbitColor: '#ca8a04',
    floatFreq: 0.7,
    floatAmp: 0.75,
    floatPhase: 5.1,
    facts: {
      diameterKm: '116,460 km',
      massKg: '5.683 × 10^26 kg (95 Earths)',
      distanceFromSunKm: '1.43 billion km (9.58 AU)',
      orbitalPeriod: '29.45 Earth years',
      rotationPeriod: '10h 33m',
      surfaceGravity: '10.44 m/s² (1.06 g)',
      avgTemp: '-140°C',
      moonsCount: 146,
      atmosphericComposition: ['Hydrogen (96.3%)', 'Helium (3.25%)', 'Methane, Ammonia (Trace)'],
      description: 'Famous for its dazzling system of icy rings composed of billions of chunks of water ice and rock ranging from dust motes to mountain-sized boulders. Saturn is so low in average density that it would float in water.',
      explorationTrivia: 'NASA\'s Cassini spacecraft spent 13 years exploring Saturn, discovering erupting cryovolcanoes on Enceladus and methane lakes on Titan before making a planned grand finale plunge into Saturn\'s atmosphere in 2017.'
    }
  },
  {
    id: 'uranus',
    name: 'Uranus',
    tagline: 'The Tilted Cyan Ice Giant of Rolling Seasons',
    type: 'Ice Giant',
    radius: 1.7,
    distance: 88,
    orbitSpeed: 0.12,
    rotationSpeed: -0.02, // Retrograde & sideways
    tilt: 97.77, // Sideways orientation
    texture: '/textures/uranus.jpg',
    hasAtmosphere: true,
    atmosphereColor: '#67e8f9',
    atmosphereIntensity: 1.4,
    hasRings: true,
    ringInner: 2.1,
    ringOuter: 2.8,
    color: '#06b6d4',
    orbitColor: '#0891b2',
    floatFreq: 0.9,
    floatAmp: 0.65,
    floatPhase: 1.7,
    facts: {
      diameterKm: '50,724 km',
      massKg: '8.681 × 10^25 kg (14.5 Earths)',
      distanceFromSunKm: '2.87 billion km (19.2 AU)',
      orbitalPeriod: '84.02 Earth years',
      rotationPeriod: '17h 14m (Retrograde, rolling on its side)',
      surfaceGravity: '8.69 m/s² (0.89 g)',
      avgTemp: '-195°C',
      moonsCount: 28,
      atmosphericComposition: ['Hydrogen (82.5%)', 'Helium (15.2%)', 'Methane (2.3%)'],
      description: 'An ice giant dominated by icy water, methane, and ammonia mantles above a small rocky core. Methane gas in its upper atmosphere absorbs red light, giving Uranus its serene aquamarine cyan color. It rotates almost completely on its side.',
      explorationTrivia: 'NASA\'s Voyager 2 remains the only spacecraft to have visited Uranus (in January 1986), discovering 10 new moons and two previously unseen rings during its historic flyby.'
    }
  },
  {
    id: 'neptune',
    name: 'Neptune',
    tagline: 'The Supersonic Storm World of Deep Azure',
    type: 'Ice Giant',
    radius: 1.65,
    distance: 104,
    orbitSpeed: 0.08,
    rotationSpeed: 0.022,
    tilt: 28.32,
    texture: '/textures/neptune.jpg',
    hasAtmosphere: true,
    atmosphereColor: '#38bdf8',
    atmosphereIntensity: 1.6,
    color: '#3b82f6',
    orbitColor: '#1d4ed8',
    floatFreq: 0.85,
    floatAmp: 0.6,
    floatPhase: 3.1,
    facts: {
      diameterKm: '49,244 km',
      massKg: '1.024 × 10^26 kg (17.1 Earths)',
      distanceFromSunKm: '4.50 billion km (30.1 AU)',
      orbitalPeriod: '164.8 Earth years',
      rotationPeriod: '16h 6m',
      surfaceGravity: '11.15 m/s² (1.14 g)',
      avgTemp: '-201°C',
      moonsCount: 16,
      atmosphericComposition: ['Hydrogen (80.0%)', 'Helium (19.0%)', 'Methane (1.5%)'],
      description: 'Dark, cold, and whipped by supersonic winds reaching up to 2,100 km/h, Neptune is the most distant major planet in our solar system, with deep blue clouds and vivid high-altitude cirrus streaks.',
      explorationTrivia: 'Neptune was the first planet predicted mathematically by Urbain Le Verrier before it was visually observed in 1846. Voyager 2 revealed geysers erupting liquid nitrogen on its moon Triton.'
    }
  }
];

export const SUN_DATA = {
  id: 'sun',
  name: 'The Sun (Sol)',
  tagline: 'Yellow Dwarf Heart of the Solar System',
  type: 'Star' as const,
  radius: 6.5,
  distance: 0,
  rotationSpeed: 0.003,
  texture: '/textures/sun.jpg',
  color: '#fbbf24',
  facts: {
    diameterKm: '1,392,700 km (109 Earths)',
    massKg: '1.989 × 10^30 kg (333,000 Earths / 99.86% of Solar System mass)',
    distanceFromSunKm: '0 km (Center of gravity)',
    orbitalPeriod: '230 million Earth years (Milky Way Galactic Orbit)',
    rotationPeriod: '25 days (Equator) to 35 days (Poles)',
    surfaceGravity: '274 m/s² (28 g)',
    avgTemp: '5,500°C (Surface) / 15,000,000°C (Core)',
    moonsCount: 0,
    atmosphericComposition: ['Hydrogen (73.4%)', 'Helium (24.8%)', 'Oxygen, Carbon, Neon, Iron (Trace)'],
    description: 'A G-type main-sequence star whose thermonuclear fusion converts 600 million tons of hydrogen into helium every second, radiating the heat and photons essential for life on Earth.',
    explorationTrivia: 'NASA\'s Parker Solar Probe has swooped closer to the Sun than any spacecraft in history, directly sampling the solar corona at speeds exceeding 690,000 km/h.'
  }
};
export const COMET_DATA = {
  id: 'comet',
  name: '1P/Halley (Halley\'s Comet)',
  tagline: 'The Celestial Wanderer of Solar Wind and Ancient Returns',
  type: 'Comet (Periodic)' as const,
  radius: 0.3,
  distance: 65,
  orbitSpeed: 0.4,
  rotationSpeed: 0.05,
  tilt: 18.0,
  texture: '/textures/moon.jpg',
  color: '#38bdf8',
  orbitColor: '#0ea5e9',
  facts: {
    diameterKm: '15 × 8 km (Peanut-shaped dirty snowball)',
    massKg: '2.2 × 10^14 kg',
    distanceFromSunKm: '87.8 million km (Perihelion) to 5.25 billion km (Aphelion)',
    orbitalPeriod: '75 - 76 Earth years (Next perihelion: July 2061)',
    rotationPeriod: '52.8 hours (Tumbling chaotic rotation)',
    surfaceGravity: '0.001 m/s² (Micro-gravity)',
    avgTemp: '-200°C (Deep space) to +77°C (Sunlit perihelion)',
    moonsCount: 0,
    atmosphericComposition: ['Coma: Water Vapor (80%)', 'Carbon Monoxide (10%)', 'Methane & Ammonia (Trace)'],
    description: 'The most famous periodic comet in human history, Halley travels on a highly eccentric retrograde orbit inclined 18 degrees to the ecliptic. As it nears the Sun, solar radiation vaporizes volatile ices, releasing a luminous coma and sweeping a dual gas-ion and dust tail across millions of kilometers.',
    explorationTrivia: 'In 1986, an international armada of spacecraft—including ESA\'s Giotto probe—flew within 596 km of Halley\'s nucleus, providing humanity\'s very first close-up photographs of a cometary heart venting dark dust jets.'
  }
};
