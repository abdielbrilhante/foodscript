import type { Agent, Position, Processor } from '../../types';
import type { Game } from '../game';
import { relativeCell } from '../utils';

export const actionProcessor: Processor = (game: Game) => {
  const { getArenaPosition } = game;

  function pickUp(agent: Agent, x: number, y: number) {
    const { nuggetId } = getArenaPosition(x, y)!;
    if (nuggetId != null) {
      agent.trunk = { nuggetId, runs: 0 };
    }
  }

  function drop(agent: Agent, x: number, y: number) {
    const cell = getArenaPosition(x, y)!;
    if (
      (x === 0 || x === game.columns - 1 || y === 0 || y === game.rows - 1) &&
      cell.nuggetId != null
    ) {
      game.score[agent.team] += 1;

      agent.trunk = null;
      cell.nuggetId = undefined;
      game.numNuggets -= 1;
    }
  }

  function move(agent: Agent, position: Position) {
    const { x: cx, y: cy } = position;
    const [x, y] = relativeCell(position, 0);
    const cellAhead = getArenaPosition(x, y);
    const nuggetId = agent.trunk;
    if (
      cellAhead &&
      cellAhead.agentId == null &&
      (cellAhead.nuggetId == null || nuggetId == null)
    ) {
      agent.position.x = x;
      agent.position.y = y;
      cellAhead.agentId = agent.id;

      if (agent.trunk != null) {
        const goldCell = game.nuggets[agent.trunk.nuggetId];
        goldCell.position.x = x;
        goldCell.position.y = y;
        cellAhead.nuggetId = agent.trunk.nuggetId;
      }

      const current = getArenaPosition(cx, cy);
      current!.agentId = undefined;
      if (nuggetId != null) {
        current!.nuggetId = undefined;
      }
    }
  }

  for (const agent of game.agents) {
    const { position, action } = agent;

    if (!action) {
      continue;
    }

    const { x: cx, y: cy } = position;

    if (action === 'pickUp' && agent.trunk == null) {
      pickUp(agent, cx, cy);
    } else if (action === 'drop' && agent.trunk != null) {
      drop(agent, cx, cy);
    } else if (action === 'move') {
      move(agent, position);
    } else if (action.startsWith('turn')) {
      agent.position.d =
        ((position.d || 4) + (action === 'turnLeft' ? -1 : 1)) % 4;
    }
  }
};
