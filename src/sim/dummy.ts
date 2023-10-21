import { randId } from '../decision-tree/utils';

export const startNode = {
  id: randId(),
  x: 300,
  y: 0,
  test: null,
  next: { start: '' },
};

export const Dummy = {
  id: randId(),
  name: 'Dummy',
  tree: [{ ...startNode }],
};
