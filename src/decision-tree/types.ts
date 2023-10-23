import type { decisions } from '../simulation/constants';
import type { Action } from '../types';

export type AgentTree = [StartItem, ...(DecisionItem | ActionItem)[]];

export interface TreeNode {
  id: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  tree: AgentTree;
}

export interface GraphItem {
  id: string;
  x: number;
  y: number;
}

export interface StartItem extends GraphItem {
  type: 'start';
  next: {
    start: string | null;
  };
}

export interface DecisionItem extends GraphItem {
  type: 'decision';
  test: (typeof decisions)[number];
  next: Record<string, string | null>;
}

export interface EdgeItem extends GraphItem {
  type: 'edge';
  from: string;
  to: string;
  key: string;
  length: number;
  rotation: number;
}

export interface ActionItem extends GraphItem {
  type: 'action';
  command: Action;
}
