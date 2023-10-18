import type { Game } from './core/game';

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
  inbox: string[];
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

  carrying: boolean;
  direction: 'north' | 'south' | 'east' | 'west';
  facingTerminal: boolean;
  terminal: boolean;
  center: PerceptionItem;
  ahead: PerceptionItem;
  leftish: PerceptionItem;
  left: PerceptionItem;
  rightish: PerceptionItem;
  right: PerceptionItem;

  inbox: string[];
}

export type Action = 'turnLeft' | 'turnRight' | 'move' | 'pickUp' | 'drop';

export type AgentFunction = (
  perception: Perception,
  state: Record<string, unknown>,
  broadcast: (message: string) => void,
) => Action | null;

export type AgentExtractor = (x: number, y: number) => Agent | null;

export type Processor = (game: Game) => void;
