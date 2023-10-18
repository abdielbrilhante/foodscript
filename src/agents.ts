import type { AgentFunction } from './types';

function randomPick<A, B>(a: A, b: B, aProbability = 0.5) {
  return Math.random() < aProbability ? a : b;
}

export const dummy: AgentFunction = (perception) => {
  if (perception.carrying && perception.terminal) {
    return 'drop';
  }

  if (!perception.carrying && perception.center === 'gold') {
    return 'pickUp';
  }

  if (perception.ahead && perception.ahead !== 'gold') {
    return 'turnLeft';
  }

  return randomPick('move', 'turnRight', 0.8);
};
