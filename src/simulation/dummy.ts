import type { AgentTemplate, StartItem } from '../decision-tree/types';
import { randId } from '../decision-tree/utils';

export const startNode: StartItem = {
  id: randId(),
  type: 'start',
  x: 300,
  y: 0,
  next: { start: null },
};

export const SIMPLETON_ID = 't0l524jg';

export const Simpleton = (): AgentTemplate => {
  const ids = Array(9).fill(null).map(randId);
  return {
    id: SIMPLETON_ID,
    name: 'Simpleton',
    tree: [
      {
        id: ids[0],
        type: 'start',
        x: 301,
        y: 12,
        next: { start: ids[1] },
      },
      {
        id: ids[1],
        type: 'decision',
        next: { yes: ids[2], no: ids[3] },
        test: 'isCarrying',
        x: 251,
        y: 138,
      },
      {
        id: ids[2],
        type: 'decision',
        next: { yes: ids[4], no: ids[6] },
        test: 'isInTerminal',
        x: 89,
        y: 295,
      },
      {
        id: ids[3],
        type: 'decision',
        next: { '*': ids[6], 'gold': ids[5] },
        test: 'center',
        x: 503,
        y: 278,
      },
      { id: ids[4], type: 'action', command: 'drop', x: 27, y: 425 },
      {
        id: ids[6],
        type: 'decision',
        next: { '60%': ids[7], '40%': ids[8] },
        test: 'random %',
        x: 382,
        y: 522,
      },
      { id: ids[5], type: 'action', command: 'pickUp', x: 593, y: 407 },
      { id: ids[7], type: 'action', command: 'move', x: 254, y: 675 },
      { id: ids[8], type: 'action', command: 'turnLeft', x: 503, y: 676 },
    ],
  };
};
