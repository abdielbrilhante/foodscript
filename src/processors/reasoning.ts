import type { Game } from '../sim/game';
import { relativeCell } from '../sim/utils';
import type { PerceptionItem, Perception, Processor, Team } from '../types';

export const reasoningProcessor: Processor = (game: Game) => {
  function cellState(x: number, y: number, team: Team | null): PerceptionItem {
    const entity = game.getArenaPosition(x, y);

    if (entity?.agentId != null && team) {
      return game.agents[entity.agentId].team === team ? 'friend' : 'foe';
    } else if (entity?.nuggetId != null) {
      return 'gold';
    } else if (entity === null) {
      return 'wall';
    } else {
      return null;
    }
  }

  for (const agent of game.agents) {
    const { position, team, reason } = agent;
    const { x, y } = position;

    const perception: Perception = {
      id: agent.id,
      isCarrying: agent.trunk != null,
      isInTerminal: game.arena[x][y].terminal === agent.team,
      isFacingTerminal: team === 'red' ? position.d === 3 : position.d === 1,
      direction: (['east', 'south', 'west', 'north'] as const)[
        agent.position.d
      ],
      center: cellState(x, y, null),
      ahead: cellState(...relativeCell(position, 0), team),
      slightLeft: cellState(...relativeCell(position, -1), team),
      left: cellState(...relativeCell(position, -2), team),
      slightRight: cellState(...relativeCell(position, 1), team),
      right: cellState(...relativeCell(position, 2), team),
    };

    agent.action = reason(perception, agent.state);
  }
};
