import type { decisions } from '../simulation/constants';
import type { Action } from '../types';

export type AgentTree = (DecisionItem | ActionItem)[];

export interface TreeNode {
  id: string;
}

export interface AgentDef {
  id: string;
  name: string;
  tree: AgentTree;
}

export interface GraphItem {
  id: string;
  x: number;
  y: number;
}

export interface DecisionItem extends GraphItem {
  test: (typeof decisions)[number] | null;
  next: Record<string, string>;
}

export interface EdgeItem extends GraphItem {
  from: string;
  to: string;
  key: string;
  length: number;
  rotation: number;
}

export interface ActionItem extends GraphItem {
  command: Action;
}
