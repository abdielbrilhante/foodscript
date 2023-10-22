import type { AgentDef } from '../decision-tree/types';
import { randId } from '../decision-tree/utils';

export const startNode = {
  id: randId(),
  x: 300,
  y: 0,
  test: null,
  next: { start: '' },
};

export const Simpleton: AgentDef = {
  id: '1',
  name: 'Simpleton',
  tree: [
    {
      id: '01912142',
      x: 301,
      y: 12,
      test: null,
      next: { start: '10784688' },
    },
    {
      id: '10784688',
      next: { yes: '25471746' },
      test: 'isCarrying',
      x: 251,
      y: 138,
    },
    {
      id: '25471746',
      next: { yes: '29802997', no: '81916346' },
      test: 'isInTerminal',
      x: 89,
      y: 295,
    },
    { id: '29802997', command: 'drop', x: 27, y: 425 },
    {
      id: '81916346',
      next: { '60%': '37129258', '40%': '67404638' },
      test: 'random %',
      x: 382,
      y: 522,
    },
    { id: '36581820', command: 'pickUp', x: 593, y: 407 },
    { id: '37129258', command: 'move', x: 254, y: 675 },
    { id: '67404638', command: 'turnLeft', x: 503, y: 676 },
    {
      id: '65199581',
      next: { '*': '81916346', 'gold': '36581820' },
      test: 'center',
      x: 503,
      y: 278,
    },
  ],
};
