import type {
  AgentTemplate,
  DecisionItem,
  StartItem,
} from '../../decision-tree/types';
import type {
  PerceptionItem,
  Perception,
  Processor,
  Team,
  Action,
} from '../../types';
import type { Game } from '../game';
import { relativeCell } from '../utils';

const BOOLEAN_STRINGS: Record<string, boolean> = { yes: true, no: false };
const CATCHALL_STRING = '*';

function decide(perception: Perception, decisionTree: AgentTemplate['tree']) {
  let node = decisionTree.find((node) => node.type === 'start');

  let action: Action | null | undefined = undefined;
  while (action === undefined) {
    if (!node) {
      action = null;
    } else if (node.type === 'start') {
      node = decisionTree.find(
        (item) => item.id === (node as StartItem).next.start,
      );
    } else if (node.type === 'action') {
      action = node.command;
    } else {
      let match: string | undefined;
      const matches = Object.keys(node.next).sort((l, r) =>
        l === CATCHALL_STRING ? 1 : r === CATCHALL_STRING ? -1 : 0,
      );

      if (node.test === 'random %') {
        const value = Math.floor(Math.random() * 100);
        const values = matches.map((percent) =>
          Number(percent.replace(/%$/u, '')),
        );
        let sum = 0;
        match = matches.find((_, i) => {
          sum += values[i];
          return value < sum;
        });
      } else {
        const value = perception[node.test];
        match = matches.find((key) => {
          if (typeof value === 'boolean') {
            return BOOLEAN_STRINGS[key] === value;
          } else if (typeof value === 'number') {
            return Number(key) === value;
          } else {
            return key === '*' || key === value;
          }
        });
      }

      if (match != null) {
        node = decisionTree.find(
          (item) => item.id === (node as DecisionItem).next[match!],
        );
      } else {
        action = null;
      }
    }
  }

  return action;
}

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
    const { position, team, decisionTree } = agent;
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

    agent.action = decide(perception, decisionTree);
  }
};
