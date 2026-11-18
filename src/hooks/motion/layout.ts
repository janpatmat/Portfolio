import { clamp } from './math';

export interface RowPlacement {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  numScale: number;
}

// Experience rows: the active row (index P, fractional while scrolling) sits at `top`. Rows still
// to come wait below in a line that steps inwards and fades; rows already read move up and fade.
// Each row is placed from its neighbour's measured height, so rows of any height never overlap.
export function experienceRows(
  P: number,
  heights: number[],
  o: { top: number; gap: number; step: number; width: number }
): RowPlacement[] {
  const n = heights.length;
  if (!n) return [];

  const rows = heights.map((_, i) => {
    const d = i - P;
    const x = d > 0 ? d * o.step : 0;
    return {
      x,
      y: 0,
      scale: d > 0 ? Math.max(0.5, (o.width - 2 * x) / o.width) : 1,
      opacity: d > 0 ? clamp(1 - 0.28 * d, 0.06, 1) : clamp(1 + 1.3 * d, 0, 1),
      numScale: d > 0 ? clamp(1 - 0.28 * d, 0.2, 1) : 1,
    };
  });

  const a = Math.min(Math.floor(P), n - 1);
  const f = P - a;
  rows[a].y = o.top - f * (heights[a] + o.gap);
  for (let i = a + 1; i < n; i++) rows[i].y = rows[i - 1].y + (heights[i - 1] + o.gap) * rows[i - 1].scale;
  for (let i = a - 1; i >= 0; i--) rows[i].y = rows[i + 1].y - (heights[i] + o.gap);

  return rows;
}

export interface GridSlot {
  x: number;
  y: number;
  scale: number;
}

// Project grid slots, as offsets from the stage centre. Rows are centred, the last row on its own.
// Tries each column count and keeps the one where the cards can stay largest; scale (k) shrinks
// the grid when it would not fit the available area.
export function gridSlots(
  count: number,
  o: { minCols: number; maxCols: number; cellW: number; cellH: number; offsetY: number; availW: number; availH: number }
): GridSlot[] {
  if (!count) return [];

  let cols = o.minCols;
  let k = 0;
  for (let c = o.minCols; c <= o.maxCols; c++) {
    const used = Math.min(c, count);
    const rows = Math.ceil(count / used);
    const fit = Math.min(1, o.availW / (used * o.cellW), o.availH / (rows * o.cellH));
    if (fit >= k) {
      k = fit;
      cols = used;
    }
  }

  const rows = Math.ceil(count / cols);
  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / cols);
    const inRow = row === rows - 1 ? count - row * cols : cols;
    const col = i % cols;
    return {
      x: (col - (inRow - 1) / 2) * o.cellW * k,
      y: (row - (rows - 1) / 2) * o.cellH * k + o.offsetY,
      scale: k,
    };
  });
}
