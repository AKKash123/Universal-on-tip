import * as THREE from 'three';

/**
 * Creates a high-resolution 1D/2D radial texture for Saturn rings
 * featuring distinct ring bands, Cassini division (black gap), Encke division,
 * and icy particle transparency.
 */
export function createSaturnRingTexture(resolution = 1024): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture(null as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = 1; // 1D stripe for radial mapping or horizontal gradient
  const ctx = canvas.getContext('2d')!;

  // Create horizontal gradient across ring radius (0 = inner edge, 1 = outer edge)
  const grad = ctx.createLinearGradient(0, 0, resolution, 0);

  // Inner faint C Ring (Crepe Ring)
  grad.addColorStop(0.00, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.08, 'rgba(120, 110, 90, 0.25)');
  grad.addColorStop(0.20, 'rgba(160, 145, 120, 0.45)');

  // B Ring (Dense, bright, opaque golden/cream)
  grad.addColorStop(0.25, 'rgba(210, 195, 160, 0.95)');
  grad.addColorStop(0.40, 'rgba(235, 220, 185, 0.98)');
  grad.addColorStop(0.55, 'rgba(200, 180, 150, 0.90)');

  // Cassini Division (Prominent dark gap)
  grad.addColorStop(0.58, 'rgba(15, 12, 10, 0.08)');
  grad.addColorStop(0.64, 'rgba(5, 5, 5, 0.02)');
  grad.addColorStop(0.67, 'rgba(20, 18, 15, 0.12)');

  // A Ring (Medium brightness with Encke gap)
  grad.addColorStop(0.70, 'rgba(195, 180, 150, 0.85)');
  grad.addColorStop(0.85, 'rgba(180, 165, 135, 0.75)');
  // Encke division
  grad.addColorStop(0.88, 'rgba(30, 25, 20, 0.15)');
  grad.addColorStop(0.90, 'rgba(175, 160, 130, 0.70)');
  grad.addColorStop(0.97, 'rgba(140, 125, 100, 0.40)');
  grad.addColorStop(1.00, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, resolution, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a circular 2D ring texture for flat ring meshes if UV radial mapping isn't used
 */
export function createCircularRingTexture(size = 1024): THREE.CanvasTexture {
  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture(null as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const center = size / 2;

  ctx.clearRect(0, 0, size, size);

  const grad = ctx.createRadialGradient(center, center, center * 0.45, center, center, center * 0.95);
  grad.addColorStop(0.00, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.10, 'rgba(160, 140, 110, 0.4)');
  grad.addColorStop(0.28, 'rgba(225, 205, 170, 0.95)');
  grad.addColorStop(0.52, 'rgba(240, 225, 190, 0.98)');
  grad.addColorStop(0.58, 'rgba(10, 8, 5, 0.05)'); // Cassini
  grad.addColorStop(0.66, 'rgba(10, 8, 5, 0.05)');
  grad.addColorStop(0.70, 'rgba(200, 185, 150, 0.85)');
  grad.addColorStop(0.85, 'rgba(180, 165, 135, 0.8)');
  grad.addColorStop(0.89, 'rgba(20, 15, 10, 0.1)'); // Encke
  grad.addColorStop(0.92, 'rgba(170, 155, 125, 0.7)');
  grad.addColorStop(1.00, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(center, center, center * 0.95, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
