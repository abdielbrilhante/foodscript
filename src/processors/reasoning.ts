import type { Game } from '../core/game';
import { relativeCell } from '../core/utils';
import type { PerceptionItem, Processor, Team } from '../types';

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

    const perception = {
      id: agent.id,
      carrying: agent.trunk != null,
      terminal: game.arena[x][y].terminal === agent.team,
      facingTerminal: team === 'red' ? position.d === 3 : position.d === 1,
      direction: (['east', 'south', 'west', 'north'] as const)[
        agent.position.d
      ],
      center: cellState(x, y, null),
      ahead: cellState(...relativeCell(position, 0), team),
      leftish: cellState(...relativeCell(position, -1), team),
      left: cellState(...relativeCell(position, -2), team),
      rightish: cellState(...relativeCell(position, 1), team),
      right: cellState(...relativeCell(position, 2), team),
      inbox: agent.inbox,
    };

    agent.action = reason(perception, agent.state, (message: string) => {
      for (const _agent of game.agents) {
        if (_agent.id !== agent.id && _agent.team === agent.team) {
          _agent.inbox.push(message);
          if (_agent.inbox.length > 20) {
            _agent.inbox.shift();
          }
        }
      }
    });
  }
};
