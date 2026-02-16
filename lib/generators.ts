// ============================================
// Stock Image Generator Engine
// 10 procedural Canvas generators targeting
// top Shutterstock keywords
// ============================================

export type GeneratorCategory =
  | "abstract"
  | "texture"
  | "wallpaper"
  | "floral"
  | "landscape"
  | "space"
  | "geometric"
  | "tropical"
  | "gradient"
  | "love";

export interface GeneratorConfig {
  id: GeneratorCategory;
  label: string;
  description: string;
  icon: string;
  keywords: string[];
}

export const GENERATOR_CATEGORIES: GeneratorConfig[] = [
  {
    id: "abstract",
    label: "Abstract Art",
    description: "Fluid shapes, layered gradients, flowing art",
    icon: "🎨",
    keywords: ["abstract", "art", "graphic", "modern", "creative"],
  },
  {
    id: "texture",
    label: "Textures & Surfaces",
    description: "Organic textures, grain, noise surfaces",
    icon: "🧱",
    keywords: ["texture", "surface", "material", "grunge", "rough"],
  },
  {
    id: "wallpaper",
    label: "Wallpaper Patterns",
    description: "Seamless repeating decorative patterns",
    icon: "🔲",
    keywords: ["wallpaper pattern", "wallpaper design", "seamless", "tile"],
  },
  {
    id: "floral",
    label: "Floral & Botanical",
    description: "Flowers, leaves, botanical compositions",
    icon: "🌸",
    keywords: ["flower", "flowers", "blossom", "leaf", "leaves", "botanical"],
  },
  {
    id: "landscape",
    label: "Landscape Scenes",
    description: "Mountains, forests, nature vistas",
    icon: "🏔️",
    keywords: [
      "landscape",
      "nature landscape",
      "forest",
      "mountains",
      "scenery",
    ],
  },
  {
    id: "space",
    label: "Space & Cosmic",
    description: "Nebulae, starfields, cosmic backgrounds",
    icon: "🌌",
    keywords: ["space", "galaxy", "cosmic", "nebula", "stars", "universe"],
  },
  {
    id: "geometric",
    label: "Geometric Minimal",
    description: "Clean geometry, sacred patterns, minimal art",
    icon: "📐",
    keywords: ["geometric", "minimal", "architecture", "line art", "modern"],
  },
  {
    id: "tropical",
    label: "Tropical Paradise",
    description: "Palm leaves, monstera, warm tropical vibes",
    icon: "🌴",
    keywords: ["tropical", "garden", "spring", "palm", "jungle", "exotic"],
  },
  {
    id: "gradient",
    label: "Gradient Backgrounds",
    description: "Smooth color blends, mesh gradients, aurora",
    icon: "🌈",
    keywords: [
      "gradient",
      "3d illustration",
      "3d background",
      "colorful",
      "blend",
    ],
  },
  {
    id: "love",
    label: "Love & Hearts",
    description: "Hearts, bokeh, romantic soft compositions",
    icon: "❤️",
    keywords: ["love", "heart", "romance", "valentine", "romantic"],
  },
];

// ============================================
// Utility functions
// ============================================

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hslToString(h: number, s: number, l: number, a = 1): string {
  return `hsla(${h % 360}, ${s}%, ${l}%, ${a})`;
}

function randomPalette(rand: () => number, count = 5): string[] {
  const baseHue = rand() * 360;
  const strategy = Math.floor(rand() * 4);
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    let h: number;
    switch (strategy) {
      case 0: // analogous
        h = baseHue + (i - 2) * 25;
        break;
      case 1: // complementary
        h = baseHue + (i % 2 === 0 ? 0 : 180) + i * 10;
        break;
      case 2: // triadic
        h = baseHue + i * 120;
        break;
      default: // split-complementary
        h = baseHue + [0, 150, 210, 30, 330][i % 5];
        break;
    }
    const s = 50 + rand() * 40;
    const l = 30 + rand() * 40;
    colors.push(hslToString(h, s, l));
  }
  return colors;
}

function noise2D(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(
  x: number,
  y: number,
  seed: number,
  scale: number,
): number {
  const sx = x / scale;
  const sy = y / scale;
  const ix = Math.floor(sx);
  const iy = Math.floor(sy);
  const fx = sx - ix;
  const fy = sy - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = noise2D(ix, iy, seed);
  const b = noise2D(ix + 1, iy, seed);
  const c = noise2D(ix, iy + 1, seed);
  const d = noise2D(ix + 1, iy + 1, seed);
  return (
    a * (1 - ux) * (1 - uy) +
    b * ux * (1 - uy) +
    c * (1 - ux) * uy +
    d * ux * uy
  );
}

function fbm(
  x: number,
  y: number,
  seed: number,
  octaves = 5,
  scale = 200,
): number {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    value += amp * smoothNoise(x * freq, y * freq, seed + i * 100, scale);
    amp *= 0.5;
    freq *= 2;
  }
  return value;
}

// ============================================
// Generator #1: Abstract Art
// ============================================
function generateAbstract(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
) {
  const rand = seededRandom(seed);
  const palette = randomPalette(rand, 6);
  const style = Math.floor(rand() * 4);

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, palette[0]);
  bgGrad.addColorStop(1, palette[1]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  if (style === 0) {
    // Flowing blobs
    for (let i = 0; i < 8 + rand() * 8; i++) {
      ctx.beginPath();
      const cx = rand() * w;
      const cy = rand() * h;
      const r = 100 + rand() * 400;
      const points = 6 + Math.floor(rand() * 6);
      for (let p = 0; p <= points; p++) {
        const angle = (p / points) * Math.PI * 2;
        const pr = r + Math.sin(angle * 3 + seed) * r * 0.4;
        const px = cx + Math.cos(angle) * pr;
        const py = cy + Math.sin(angle) * pr;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.globalAlpha = 0.15 + rand() * 0.3;
      ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
      ctx.fill();
    }
  } else if (style === 1) {
    // Layered circles
    for (let i = 0; i < 20 + rand() * 30; i++) {
      ctx.beginPath();
      ctx.arc(rand() * w, rand() * h, 50 + rand() * 300, 0, Math.PI * 2);
      ctx.globalAlpha = 0.08 + rand() * 0.15;
      ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
      ctx.fill();
    }
  } else if (style === 2) {
    // Wave lines
    ctx.globalAlpha = 1;
    for (let i = 0; i < 15 + rand() * 15; i++) {
      ctx.beginPath();
      const yOff = rand() * h;
      const amp = 20 + rand() * 100;
      const freq = 0.002 + rand() * 0.008;
      for (let x = 0; x <= w; x += 4) {
        const y = yOff + Math.sin(x * freq + i + seed) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = palette[Math.floor(rand() * palette.length)];
      ctx.lineWidth = 1 + rand() * 5;
      ctx.globalAlpha = 0.3 + rand() * 0.5;
      ctx.stroke();
    }
  } else {
    // Splatter
    for (let i = 0; i < 200 + rand() * 400; i++) {
      ctx.beginPath();
      ctx.arc(rand() * w, rand() * h, 2 + rand() * 40, 0, Math.PI * 2);
      ctx.globalAlpha = 0.1 + rand() * 0.4;
      ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

// ============================================
// Generator #2: Textures & Surfaces
// ============================================
function generateTexture(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
) {
  const rand = seededRandom(seed);
  const baseHue = rand() * 360;
  const style = Math.floor(rand() * 4);
  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      let val: number;

      if (style === 0) {
        // Stone/concrete
        val = fbm(x, y, seed, 6, 150) * 255;
        const r = val * 0.7 + 40;
        const g = val * 0.68 + 38;
        const b = val * 0.65 + 35;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
      } else if (style === 1) {
        // Wood grain
        const nx = fbm(x, y, seed, 4, 300);
        const ring = Math.sin((x * 0.01 + nx * 8) * 3.14);
        val = (ring * 0.5 + 0.5) * 200;
        data[idx] = val * 0.8 + 60;
        data[idx + 1] = val * 0.55 + 30;
        data[idx + 2] = val * 0.25 + 15;
      } else if (style === 2) {
        // Marble
        const nx = fbm(x, y, seed, 6, 200);
        const vein = Math.sin(x * 0.005 + y * 0.003 + nx * 6);
        val = (vein * 0.5 + 0.5) * 255;
        const hShift = baseHue;
        const saturation = 0.1 + rand() * 0.1;
        data[idx] = val * (1 - saturation) + Math.sin(hShift * 0.017) * 30;
        data[idx + 1] = val * (1 - saturation * 0.5);
        data[idx + 2] = val;
      } else {
        // Fabric/linen
        const n1 = noise2D(x * 0.5, y * 0.5, seed) * 0.5;
        const n2 = noise2D(x * 2, y * 2, seed + 42) * 0.3;
        const threadX = Math.sin(x * 0.8) * 0.1;
        const threadY = Math.sin(y * 0.8) * 0.1;
        val = (n1 + n2 + threadX + threadY + 0.5) * 200;
        const tint = baseHue / 360;
        data[idx] = val + tint * 30;
        data[idx + 1] = val + (1 - tint) * 20;
        data[idx + 2] = val;
      }
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

// ============================================
// Generator #3: Wallpaper Patterns
// ============================================
function generateWallpaper(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
) {
  const rand = seededRandom(seed);
  const palette = randomPalette(rand, 5);
  const style = Math.floor(rand() * 4);

  ctx.fillStyle = palette[0];
  ctx.fillRect(0, 0, w, h);

  const tileSize = 80 + Math.floor(rand() * 120);
  const cols = Math.ceil(w / tileSize) + 1;
  const rows = Math.ceil(h / tileSize) + 1;

  if (style === 0) {
    // Diamonds
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * tileSize + (r % 2 ? tileSize / 2 : 0);
        const cy = r * tileSize;
        ctx.beginPath();
        ctx.moveTo(cx, cy - tileSize / 3);
        ctx.lineTo(cx + tileSize / 3, cy);
        ctx.lineTo(cx, cy + tileSize / 3);
        ctx.lineTo(cx - tileSize / 3, cy);
        ctx.closePath();
        ctx.fillStyle = palette[1 + ((r + c) % 3)];
        ctx.globalAlpha = 0.6 + rand() * 0.3;
        ctx.fill();
        ctx.strokeStyle = palette[4];
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.stroke();
      }
    }
  } else if (style === 1) {
    // Circles grid
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * tileSize + tileSize / 2;
        const cy = r * tileSize + tileSize / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, tileSize * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = palette[1 + ((r * cols + c) % 3)];
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, tileSize * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = palette[(r + c + 2) % palette.length];
        ctx.globalAlpha = 0.7;
        ctx.fill();
      }
    }
  } else if (style === 2) {
    // Hexagons
    const hexH = tileSize * 0.866;
    for (let r = 0; r < rows + 2; r++) {
      for (let c = 0; c < cols + 2; c++) {
        const cx = c * tileSize * 1.5;
        const cy = r * hexH * 2 + (c % 2 ? hexH : 0);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i + Math.PI / 6;
          const px = cx + Math.cos(angle) * tileSize * 0.48;
          const py = cy + Math.sin(angle) * tileSize * 0.48;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = palette[1 + ((r + c) % 3)];
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.strokeStyle = palette[4];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4;
        ctx.stroke();
      }
    }
  } else {
    // Moroccan stars
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * tileSize + (r % 2 ? tileSize / 2 : 0);
        const cy = r * tileSize;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI / 4) * i;
          const radius = i % 2 === 0 ? tileSize * 0.4 : tileSize * 0.2;
          const px = cx + Math.cos(angle) * radius;
          const py = cy + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = palette[1 + ((r + c) % 3)];
        ctx.globalAlpha = 0.7;
        ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1;
}

// ============================================
// Generator #4: Floral & Botanical
// ============================================
function generateFloral(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
) {
  const rand = seededRandom(seed);
  const palette = randomPalette(rand, 6);
  const bgDark = rand() > 0.5;

  // Background
  ctx.fillStyle = bgDark ? "#0c1a0e" : "#faf5f0";
  ctx.fillRect(0, 0, w, h);

  const flowerCount = 8 + Math.floor(rand() * 15);

  for (let f = 0; f < flowerCount; f++) {
    const cx = rand() * w;
    const cy = rand() * h;
    const size = 40 + rand() * 150;
    const petalCount = 5 + Math.floor(rand() * 5);
    const petalColor = palette[Math.floor(rand() * palette.length)];
    const rotation = rand() * Math.PI * 2;

    // Petals
    for (let p = 0; p < petalCount; p++) {
      const angle = rotation + (p / petalCount) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(size * 0.5, 0, size * 0.5, size * 0.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = petalColor;
      ctx.globalAlpha = 0.5 + rand() * 0.4;
      ctx.fill();
      ctx.restore();
    }

    // Center
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = bgDark ? "#ffd700" : "#8B4513";
    ctx.globalAlpha = 0.8;
    ctx.fill();
  }

  // Leaves
  const leafCount = 15 + Math.floor(rand() * 20);
  for (let l = 0; l < leafCount; l++) {
    const lx = rand() * w;
    const ly = rand() * h;
    const lSize = 30 + rand() * 80;
    const lAngle = rand() * Math.PI * 2;
    const greenHue = 90 + rand() * 60;

    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(lAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, lSize, lSize * 0.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = hslToString(greenHue, 50 + rand() * 30, 25 + rand() * 25);
    ctx.globalAlpha = 0.4 + rand() * 0.4;
    ctx.fill();

    // Leaf vein
    ctx.beginPath();
    ctx.moveTo(-lSize, 0);
    ctx.lineTo(lSize, 0);
    ctx.strokeStyle = hslToString(greenHue, 40, 40, 0.5);
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

// ============================================
// Generator #5: Landscape Scenes
// ============================================
function generateLandscape(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
) {
  const rand = seededRandom(seed);
  const timeOfDay = Math.floor(rand() * 4); // 0: dawn, 1: day, 2: sunset, 3: night

  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
  if (timeOfDay === 0) {
    skyGrad.addColorStop(0, "#1a0530");
    skyGrad.addColorStop(0.4, "#e8456b");
    skyGrad.addColorStop(0.8, "#ffc373");
    skyGrad.addColorStop(1, "#ffe9b0");
  } else if (timeOfDay === 1) {
    skyGrad.addColorStop(0, "#0a3d7a");
    skyGrad.addColorStop(0.5, "#4a90d9");
    skyGrad.addColorStop(1, "#87ceeb");
  } else if (timeOfDay === 2) {
    skyGrad.addColorStop(0, "#1a0a2e");
    skyGrad.addColorStop(0.3, "#6b1d5e");
    skyGrad.addColorStop(0.6, "#e8456b");
    skyGrad.addColorStop(1, "#ff9a56");
  } else {
    skyGrad.addColorStop(0, "#000311");
    skyGrad.addColorStop(0.5, "#0a1628");
    skyGrad.addColorStop(1, "#132244");
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Stars for night
  if (timeOfDay === 3) {
    for (let i = 0; i < 300; i++) {
      ctx.beginPath();
      ctx.arc(rand() * w, rand() * h * 0.6, rand() * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.3 + rand() * 0.7})`;
      ctx.fill();
    }
  }

  // Mountains layers
  const layers = 3 + Math.floor(rand() * 3);
  for (let l = 0; l < layers; l++) {
    const baseY = h * (0.35 + l * 0.12);
    const darkness = l / layers;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) {
      const mountainNoise = fbm(x, l * 1000, seed + l * 50, 4, 300 - l * 50);
      const peakHeight = 100 + rand() * 200 - l * 30;
      const y = baseY - mountainNoise * peakHeight;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();

    const mHue = timeOfDay === 3 ? 220 : timeOfDay === 2 ? 280 : 200;
    ctx.fillStyle = hslToString(mHue + l * 10, 20 + l * 5, 15 + darkness * 25);
    ctx.fill();
  }

  // Ground
  const groundGrad = ctx.createLinearGradient(0, h * 0.75, 0, h);
  const groundHue = timeOfDay === 3 ? 220 : 120;
  groundGrad.addColorStop(0, hslToString(groundHue, 30, 20));
  groundGrad.addColorStop(1, hslToString(groundHue, 25, 10));
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, h * 0.78, w, h * 0.22);

  // Trees silhouettes
  const treeCount = 5 + Math.floor(rand() * 10);
  for (let t = 0; t < treeCount; t++) {
    const tx = rand() * w;
    const ty = h * (0.72 + rand() * 0.1);
    const treeH = 60 + rand() * 120;

    ctx.fillStyle = hslToString(groundHue + 20, 20, 8 + rand() * 10);
    // Trunk
    ctx.fillRect(tx - 3, ty, 6, treeH * 0.4);
    // Canopy
    ctx.beginPath();
    ctx.moveTo(tx, ty - treeH * 0.3);
    ctx.lineTo(tx + treeH * 0.3, ty + treeH * 0.1);
    ctx.lineTo(tx - treeH * 0.3, ty + treeH * 0.1);
    ctx.closePath();
    ctx.fill();
  }
}

// ============================================
// Generator #6: Space & Cosmic
// ============================================
function generateSpace(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
) {
  const rand = seededRandom(seed);

  // Deep space background
  ctx.fillStyle = "#000008";
  ctx.fillRect(0, 0, w, h);

  // Nebula clouds
  const nebulaColors = [
    [rand() * 360, 70, 40],
    [(rand() * 360 + 120) % 360, 80, 35],
    [(rand() * 360 + 240) % 360, 60, 30],
  ];

  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      let r = 0,
        g = 0,
        b = 0;

      for (const [nh, ns, nl] of nebulaColors) {
        const n = fbm(x, y, seed + nh, 5, 250);
        const intensity = Math.max(0, n - 0.35) * 3;
        const hRad = (nh * Math.PI) / 180;
        r += Math.cos(hRad) * intensity * nl * ns * 0.01;
        g += Math.cos(hRad - 2.094) * intensity * nl * ns * 0.01;
        b += Math.cos(hRad + 2.094) * intensity * nl * ns * 0.01;
      }

      data[idx] = Math.min(255, Math.max(0, r + 2));
      data[idx + 1] = Math.min(255, Math.max(0, g + 2));
      data[idx + 2] = Math.min(255, Math.max(0, b + 8));
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Stars
  for (let i = 0; i < 800 + rand() * 500; i++) {
    const sx = rand() * w;
    const sy = rand() * h;
    const size = rand() * 2.5;
    const brightness = 0.3 + rand() * 0.7;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${brightness})`;
    ctx.fill();
  }

  // Bright stars with glow
  for (let i = 0; i < 20 + rand() * 30; i++) {
    const sx = rand() * w;
    const sy = rand() * h;
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 8 + rand() * 12);
    glow.addColorStop(0, "rgba(255,255,255,0.8)");
    glow.addColorStop(0.3, "rgba(200,220,255,0.3)");
    glow.addColorStop(1, "rgba(100,150,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(sx - 20, sy - 20, 40, 40);
  }
}

// ============================================
// Generator #7: Geometric Minimal
// ============================================
function generateGeometric(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
) {
  const rand = seededRandom(seed);
  const palette = randomPalette(rand, 5);
  const style = Math.floor(rand() * 4);
  const bgLight = rand() > 0.5;

  ctx.fillStyle = bgLight ? "#f5f0eb" : "#0a0a12";
  ctx.fillRect(0, 0, w, h);

  if (style === 0) {
    // Concentric circles
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.max(w, h) * 0.6;
    const rings = 15 + Math.floor(rand() * 20);
    for (let i = rings; i >= 0; i--) {
      ctx.beginPath();
      ctx.arc(cx, cy, (i / rings) * maxR, 0, Math.PI * 2);
      ctx.strokeStyle = palette[i % palette.length];
      ctx.lineWidth = 2 + rand() * 3;
      ctx.globalAlpha = 0.5 + rand() * 0.4;
      ctx.stroke();
    }
  } else if (style === 1) {
    // Line grid
    const spacing = 30 + rand() * 40;
    const angle = rand() * Math.PI * 0.5;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(angle);
    ctx.translate(-w, -h);
    for (let x = -w; x < w * 2; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, -h);
      ctx.lineTo(x, h * 2);
      ctx.strokeStyle = palette[Math.floor(rand() * palette.length)];
      ctx.lineWidth = 1 + rand() * 2;
      ctx.globalAlpha = 0.3 + rand() * 0.4;
      ctx.stroke();
    }
    for (let y = -h; y < h * 2; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(-w, y);
      ctx.lineTo(w * 2, y);
      ctx.strokeStyle = palette[Math.floor(rand() * palette.length)];
      ctx.lineWidth = 1 + rand() * 2;
      ctx.globalAlpha = 0.2 + rand() * 0.3;
      ctx.stroke();
    }
    ctx.restore();
  } else if (style === 2) {
    // Triangles
    const size = 60 + rand() * 80;
    const triH = size * 0.866;
    for (let r = 0; r < h / triH + 1; r++) {
      for (let c = 0; c < w / size + 1; c++) {
        const x = c * size + (r % 2 ? size / 2 : 0);
        const y = r * triH;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size / 2, y + triH);
        ctx.lineTo(x - size / 2, y + triH);
        ctx.closePath();
        ctx.fillStyle = palette[(r + c) % palette.length];
        ctx.globalAlpha = 0.3 + rand() * 0.5;
        ctx.fill();
        ctx.strokeStyle = bgLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  } else {
    // Sacred geometry - flower of life
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * 0.08;
    const drawCircle = (px: number, py: number) => {
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.strokeStyle = palette[Math.floor(rand() * palette.length)];
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
    };
    for (let ring = 0; ring < 4; ring++) {
      const count = ring === 0 ? 1 : ring * 6;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const dist = ring * r;
        drawCircle(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist);
      }
    }
  }
  ctx.globalAlpha = 1;
}

// ============================================
// Generator #8: Tropical Paradise
// ============================================
function generateTropical(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
) {
  const rand = seededRandom(seed);
  const style = Math.floor(rand() * 3);

  // Warm tropical background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  if (style === 0) {
    bgGrad.addColorStop(0, "#1a3a2a");
    bgGrad.addColorStop(1, "#0d2818");
  } else if (style === 1) {
    bgGrad.addColorStop(0, "#ff9a56");
    bgGrad.addColorStop(1, "#ff6b8a");
  } else {
    bgGrad.addColorStop(0, "#0a2a1a");
    bgGrad.addColorStop(1, "#1a4a3a");
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Draw palm / monstera leaves
  const leafCount = 6 + Math.floor(rand() * 10);
  for (let l = 0; l < leafCount; l++) {
    const lx = rand() * w;
    const ly = rand() * h;
    const size = 100 + rand() * 300;
    const angle = rand() * Math.PI * 2;
    const leafType = Math.floor(rand() * 3);
    const greenHue = 100 + rand() * 60;
    const lightness = 20 + rand() * 30;

    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(angle);

    if (leafType === 0) {
      // Palm frond
      const segments = 8 + Math.floor(rand() * 6);
      for (let s = 0; s < segments; s++) {
        const sAngle = (s / segments - 0.5) * 1.2;
        ctx.save();
        ctx.rotate(sAngle);
        ctx.beginPath();
        ctx.ellipse(size * 0.4, 0, size * 0.4, size * 0.06, 0, 0, Math.PI * 2);
        ctx.fillStyle = hslToString(greenHue, 50 + rand() * 30, lightness, 0.6);
        ctx.fill();
        ctx.restore();
      }
      // Stem
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.1, 0);
      ctx.strokeStyle = hslToString(greenHue - 10, 40, lightness - 5);
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (leafType === 1) {
      // Monstera leaf
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.5, size * 0.35, 0, 0, Math.PI * 2);
      ctx.fillStyle = hslToString(greenHue, 55, lightness, 0.7);
      ctx.fill();
      // Holes in monstera
      for (let h2 = 0; h2 < 4; h2++) {
        const hAngle = (h2 / 4) * Math.PI * 2 + rand();
        const hDist = size * 0.2;
        ctx.beginPath();
        ctx.ellipse(
          Math.cos(hAngle) * hDist,
          Math.sin(hAngle) * hDist,
          size * 0.08,
          size * 0.06,
          hAngle,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = style === 1 ? "#ff8040" : "#0d2818";
        ctx.globalAlpha = 0.8;
        ctx.fill();
      }
    } else {
      // Banana leaf
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.6, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fillStyle = hslToString(greenHue, 60, lightness, 0.6);
      ctx.fill();
      // Center vein
      ctx.beginPath();
      ctx.moveTo(-size * 0.6, 0);
      ctx.lineTo(size * 0.6, 0);
      ctx.strokeStyle = hslToString(greenHue, 40, lightness + 15, 0.6);
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }

  // Tropical flowers
  const fCount = 3 + Math.floor(rand() * 5);
  for (let f = 0; f < fCount; f++) {
    const fx = rand() * w;
    const fy = rand() * h;
    const fSize = 20 + rand() * 50;
    const fHue = rand() > 0.5 ? 0 + rand() * 40 : 280 + rand() * 60;

    for (let p = 0; p < 5; p++) {
      const pAngle = (p / 5) * Math.PI * 2;
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(pAngle);
      ctx.beginPath();
      ctx.ellipse(fSize * 0.5, 0, fSize * 0.4, fSize * 0.15, 0, 0, Math.PI * 2);
      ctx.fillStyle = hslToString(fHue, 70, 55, 0.8);
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(fx, fy, fSize * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd700";
    ctx.globalAlpha = 0.9;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ============================================
// Generator #9: Gradient Backgrounds
// ============================================
function generateGradient(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
) {
  const rand = seededRandom(seed);
  const style = Math.floor(rand() * 5);
  const palette = randomPalette(rand, 5);

  if (style === 0) {
    // Mesh gradient (multiple radial gradients blended)
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 5 + rand() * 5; i++) {
      const gx = rand() * w;
      const gy = rand() * h;
      const gr = 300 + rand() * 600;
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      grad.addColorStop(0, palette[Math.floor(rand() * palette.length)]);
      grad.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.4 + rand() * 0.4;
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  } else if (style === 1) {
    // Aurora / Northern lights
    const aGrad = ctx.createLinearGradient(0, 0, 0, h);
    aGrad.addColorStop(0, "#000820");
    aGrad.addColorStop(1, "#001030");
    ctx.fillStyle = aGrad;
    ctx.fillRect(0, 0, w, h);

    for (let band = 0; band < 5; band++) {
      ctx.beginPath();
      const baseY = h * (0.2 + band * 0.1);
      ctx.moveTo(0, baseY);
      for (let x = 0; x <= w; x += 4) {
        const y =
          baseY +
          Math.sin(x * 0.003 + band + seed) * 80 +
          Math.sin(x * 0.007 + band * 2) * 40;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      const bGrad = ctx.createLinearGradient(0, baseY - 100, 0, baseY + 200);
      const hue = 120 + band * 30 + rand() * 30;
      bGrad.addColorStop(0, hslToString(hue, 80, 50, 0));
      bGrad.addColorStop(0.4, hslToString(hue, 80, 50, 0.3));
      bGrad.addColorStop(0.7, hslToString(hue, 70, 40, 0.1));
      bGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bGrad;
      ctx.globalAlpha = 0.5;
      ctx.fill();
    }
  } else if (style === 2) {
    // Diagonal split
    const colors = [palette[0], palette[1], palette[2], palette[3]];
    const grad = ctx.createLinearGradient(0, 0, w, h);
    colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (style === 3) {
    // Soft orbs
    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) {
      const ox = rand() * w;
      const oy = rand() * h;
      const or = 200 + rand() * 500;
      const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, or);
      grad.addColorStop(0, palette[i % palette.length]);
      grad.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.3 + rand() * 0.3;
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
    // Grain overlay
    ctx.globalAlpha = 0.03;
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        if (rand() > 0.5) {
          ctx.fillStyle = "#fff";
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  } else {
    // Glass morphism blurred shapes
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      const rx = rand() * w;
      const ry = rand() * h;
      const rw = 200 + rand() * 500;
      const rh2 = 200 + rand() * 500;
      ctx.ellipse(rx, ry, rw, rh2, rand() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
      ctx.globalAlpha = 0.2 + rand() * 0.3;
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

// ============================================
// Generator #10: Love & Hearts
// ============================================
function generateLove(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
) {
  const rand = seededRandom(seed);
  const style = Math.floor(rand() * 3);
  const pinkHue = 330 + rand() * 30;

  // Soft romantic background
  const bgGrad = ctx.createRadialGradient(
    w / 2,
    h / 2,
    0,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.7,
  );
  if (style === 0) {
    bgGrad.addColorStop(0, hslToString(pinkHue, 40, 25));
    bgGrad.addColorStop(1, hslToString(pinkHue + 20, 30, 10));
  } else if (style === 1) {
    bgGrad.addColorStop(0, "#fff0f5");
    bgGrad.addColorStop(1, "#ffe0ec");
  } else {
    bgGrad.addColorStop(0, hslToString(0, 60, 20));
    bgGrad.addColorStop(1, hslToString(340, 50, 8));
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Draw a heart shape
  const drawHeart = (cx: number, cy: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy + size * 0.3);
    ctx.bezierCurveTo(
      cx,
      cy,
      cx - size * 0.5,
      cy - size * 0.3,
      cx - size * 0.5,
      cy,
    );
    ctx.bezierCurveTo(
      cx - size * 0.5,
      cy + size * 0.3,
      cx,
      cy + size * 0.55,
      cx,
      cy + size * 0.6,
    );
    ctx.bezierCurveTo(
      cx,
      cy + size * 0.55,
      cx + size * 0.5,
      cy + size * 0.3,
      cx + size * 0.5,
      cy,
    );
    ctx.bezierCurveTo(
      cx + size * 0.5,
      cy - size * 0.3,
      cx,
      cy,
      cx,
      cy + size * 0.3,
    );
    ctx.closePath();
  };

  // Hearts
  const heartCount = 15 + Math.floor(rand() * 30);
  for (let i = 0; i < heartCount; i++) {
    const hx = rand() * w;
    const hy = rand() * h;
    const hs = 20 + rand() * 100;
    const hue = pinkHue + rand() * 40 - 20;

    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(rand() * 0.6 - 0.3);
    drawHeart(0, 0, hs);
    ctx.fillStyle = hslToString(
      hue,
      60 + rand() * 30,
      style === 1 ? 60 : 45,
      0.2 + rand() * 0.4,
    );
    ctx.fill();
    ctx.restore();
  }

  // Bokeh circles
  for (let i = 0; i < 30 + rand() * 40; i++) {
    const bx = rand() * w;
    const by = rand() * h;
    const br = 10 + rand() * 60;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fillStyle = hslToString(
      pinkHue + rand() * 50 - 25,
      50 + rand() * 30,
      60 + rand() * 20,
      0.05 + rand() * 0.12,
    );
    ctx.fill();
  }

  // Sparkles
  for (let i = 0; i < 50; i++) {
    const sx = rand() * w;
    const sy = rand() * h;
    const ss = 1 + rand() * 3;
    ctx.beginPath();
    ctx.arc(sx, sy, ss, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.3 + rand() * 0.5})`;
    ctx.fill();
  }
}

// ============================================
// Main dispatch
// ============================================

export type Resolution = {
  label: string;
  width: number;
  height: number;
};

export const RESOLUTIONS: Resolution[] = [
  { label: "HD (1920×1080)", width: 1920, height: 1080 },
  { label: "4K (3840×2160)", width: 3840, height: 2160 },
  { label: "Square 4K (4096×4096)", width: 4096, height: 4096 },
  { label: "Instagram (1080×1080)", width: 1080, height: 1080 },
  { label: "Portrait 4K (2160×3840)", width: 2160, height: 3840 },
];

const GENERATORS: Record<
  GeneratorCategory,
  (ctx: CanvasRenderingContext2D, w: number, h: number, seed: number) => void
> = {
  abstract: generateAbstract,
  texture: generateTexture,
  wallpaper: generateWallpaper,
  floral: generateFloral,
  landscape: generateLandscape,
  space: generateSpace,
  geometric: generateGeometric,
  tropical: generateTropical,
  gradient: generateGradient,
  love: generateLove,
};

export function generateImage(
  canvas: HTMLCanvasElement,
  category: GeneratorCategory,
  width: number,
  height: number,
  seed?: number,
): number {
  const actualSeed = seed ?? Math.floor(Math.random() * 2147483647);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  ctx.clearRect(0, 0, width, height);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";

  GENERATORS[category](ctx, width, height, actualSeed);

  return actualSeed;
}
