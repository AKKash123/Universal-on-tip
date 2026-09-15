# Universal on Tip (Solar System Orrery & Scrollytelling Space Flight)

An immersive, interactive 3D solar system visualization and scrollytelling experience built with **Next.js 16**, **React 19**, **Three.js**, **React Three Fiber**, and **Tailwind CSS**.

---

## Features

- **Dual Exploration Modes**:
  - **Scrollytelling Mode**: Smooth flight narrative synchronized with space shuttle video playback and orbital checkpoints.
  - **Interactive 3D Sandbox**: Free navigation, orbit controls, zoom, pan, and real-time astronomical simulation.
- **Solar System Simulation**:
  - Central Sun with animated corona, surface glow shaders, and dynamic point lighting.
  - 8 realistic planets with high-resolution textures, surface normals, specular highlights, and axial rotation.
  - Earth system with night lights, cloud layer, atmospheric halo, and orbiting Moon.
  - Saturn with ring geometry and custom transparency shader.
  - Procedural Asteroid Belt and traveling Comet with particle tail.
  - Spacetime gravitational curvature grid.
- **Camera & Perspective Controls**:
  - Multiple perspective modes: God's Eye, Free Orbit, Celestial Body Tracking, and Cinematic Views.
  - Smooth camera transitions with target focus and auto-damping.
- **Telemetry & Controls**:
  - Live planetary telemetry drawer displaying radius, distance, orbital period, temperature, and planetary facts.
  - Time controls: Play/pause, simulation speed slider, toggle orbits, atmospheric halos, spacetime grid, and asteroid belt.
- **Standalone Prototype**:
  - Includes the original single-file vanilla Three.js prototype in `prototype/index.html`.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: React 19, TypeScript
- **3D Graphics**: [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `yarn` / `pnpm`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AKKash123/Universal-on-tip.git
   cd Universal-on-tip
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm run start
```

---

## Project Structure

```
Universal-on-tip/
├── public/
│   ├── textures/            # High-resolution celestial body textures
│   └── videos/              # Scrollytelling shuttle video
├── src/
│   ├── app/                 # Next.js App Router (layout, page, global styles)
│   ├── components/          # 3D canvas, camera controller, celestial bodies, effects
│   │   └── UI/              # Top navigation, telemetry drawer, time controls, story overlay
│   ├── data/                # Astronomical data and planetary configurations
│   ├── shaders/             # Custom GLSL shaders
│   └── utils/               # Procedural texture helpers
├── prototype/
│   └── index.html           # Original standalone single-file Three.js prototype
└── package.json
```

---

## License

MIT License — feel free to explore, modify, and build upon this cosmic journey.
