import type { Processor } from '../types';

export const carryingProcessor: Processor = (game) => {
  for (const agent of game.agents) {
    if (agent.trunk) {
      agent.trunk.runs += 1;

      if (agent.trunk.runs >= game.maxCarries) {
        agent.trunk = null;
        game.arena[agent.position.x][agent.position.y].nuggetId = undefined;
        game.addGoldNugget();
      }
    }
  }
};
