import type { Game } from './sim/game';

export type Cell = {
  agentId?: number;
  nuggetId?: number;
  terminal?: Team;
};

export interface Agent {
  id: number;
  reason: AgentFunction;
  action: Action | null;
  state: Record<string, unknown>;
  position: Position;
  trunk: { nuggetId: number; runs: number } | null;
  class: string;
  team: Team;
}

export interface GoldNugget {
  id: number;
  position: Position;
}

export type PerceptionItem = 'wall' | 'friend' | 'foe' | 'gold' | null;

export interface Position {
  x: number;
  y: number;
  d: number;
}

export type Team = 'red' | 'blue';

export interface Perception {
  id: number;

  isCarrying: boolean;
  direction: 'north' | 'south' | 'east' | 'west';
  isFacingTerminal: boolean;
  isInTerminal: boolean;
  center: PerceptionItem;
  ahead: PerceptionItem;
  slightLeft: PerceptionItem;
  left: PerceptionItem;
  slightRight: PerceptionItem;
  right: PerceptionItem;
}

export type Action = 'turnLeft' | 'turnRight' | 'move' | 'pickUp' | 'drop';

export type AgentFunction = (
  perception: Perception,
  state: Record<string, unknown>,
) => Action | null;

export type AgentExtractor = (x: number, y: number) => Agent | null;

export type Processor = (game: Game) => void;
