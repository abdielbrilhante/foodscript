import type { Position } from '../types';

export function relativeCell(position: Position, offset: number) {
  const { x, y, d } = position;
  const angle = (Math.PI / 2) * d + (Math.PI / 4) * offset;

  return [
    Math.max(0, Math.round(x + Math.cos(angle))),
    Math.max(0, Math.round(y + Math.sin(angle))),
  ] as const;
}
