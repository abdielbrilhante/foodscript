import type { Team } from '../types';

export function mixed(rows: number, columns: number) {
  return {
    x: Math.floor(Math.random() * columns),
    y: Math.floor(Math.random() * rows),
  };
}

export function splitX(rows: number, columns: number, team: Team) {
  const offset = team === 'red' ? 0 : Math.ceil(columns / 2);
  return {
    x: Math.floor(Math.random() * Math.floor(columns / 2)) + offset,
    y: Math.floor(Math.random() * rows),
  };
}

export function splitY(rows: number, columns: number, team: Team) {
  const offset = team === 'red' ? 0 : Math.ceil(rows / 2);
  return {
    x: Math.floor(Math.random() * columns),
    y: Math.floor(Math.random() * Math.floor(rows / 2)) + offset,
  };
}

export function reverseSplitY(rows: number, columns: number, team: Team) {
  const offset = team === 'blue' ? 0 : Math.ceil(rows / 2);
  return {
    x: Math.floor(Math.random() * columns),
    y: Math.floor(Math.random() * Math.floor(rows / 2)) + offset,
  };
}
