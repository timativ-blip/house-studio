import * as THREE from "three";

/**
 * Процедурная текстура травы: до появления реального пайплайна текстур
 * (SPEC.md, раздел 19) плоский цвет земли выглядит слишком искусственно.
 * Генерируется один раз и переиспользуется всеми потребителями.
 */
let grassTexture: THREE.CanvasTexture | null = null;

export function getGrassTexture(): THREE.CanvasTexture {
  if (grassTexture) return grassTexture;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    grassTexture = new THREE.CanvasTexture(canvas);
    return grassTexture;
  }

  ctx.fillStyle = "#6f9e63";
  ctx.fillRect(0, 0, size, size);

  // Псевдослучайные пятна разных оттенков зелёного создают ощущение
  // травяного покрова вместо плоской заливки.
  let seed = 1337;
  const random = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const shades = ["#5f8f54", "#7aab6c", "#68985c", "#84b678"];
  for (let i = 0; i < 900; i++) {
    const x = random() * size;
    const y = random() * size;
    const radius = 1 + random() * 2.5;
    ctx.fillStyle = shades[Math.floor(random() * shades.length)];
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  grassTexture = texture;
  return texture;
}
