// Easing and helper math shared by the section renderers

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Cubic in-out
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Cubic out
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// Progress through the sub-range [a, b] of p, clamped to 0–1
export const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);

// Stable pseudo-random value in [0, 1) for item i and channel k
export const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// easeOutBounce
export const bounce = (x: number) => {
  const n = 7.5625;
  const d = 2.75;
  if (x < 1 / d) return n * x * x;
  if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75;
  if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375;
  return n * (x -= 2.625 / d) * x + 0.984375;
};
