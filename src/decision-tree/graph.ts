import { agentService } from '../simulation/agents';
import { actions, decisions } from '../simulation/constants';
import type { AgentTree, DecisionItem, EdgeItem } from './types';
import { randId } from './utils';

export class Graph {
  private timeout: number | null = null;

  name: string;
  nodes: AgentTree;
  edges: EdgeItem[] = [];
  errors: {
    loops: string[][];
  } = {
    loops: [],
  };

  constructor(
    private id: string,
    private trigger: () => void,
  ) {
    const agentDef = agentService.parse(id)!;
    this.name = agentDef.name;
    this.nodes = agentDef.tree;
  }

  rerender() {
    this.check();
    this.trigger();

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      agentService.persist({
        id: this.id,
        name: this.name,
        tree: this.nodes,
      });
    }, 500);
  }

  size() {
    let height = 0;
    let width = 0;
    for (const node of this.nodes) {
      const element = document.querySelector(`[data-id="${node.id}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        height = Math.max(height, node.y + rect.height);
        width = Math.max(width, node.x + rect.width);
      }
    }

    return { width: width + 200, height: height + 200 };
  }

  check() {
    this.errors.loops = this.visit(this.nodes[0].id);
  }

  visit(id: string | null, paths: string[] = [], loops: string[][] = []) {
    const node = this.findNodeById(id);
    if (id && node && node.type === 'decision') {
      if (paths.includes(id)) {
        paths.push(id);
        loops.push(paths);
        return loops;
      }

      paths.push(id);
      for (const edge of Object.values(node.next)) {
        this.visit(edge, [...paths], loops);
      }
    }

    return loops;
  }

  rebuildEdges = (id?: string) => {
    const current = this.edges;

    this.edges = [
      id
        ? current[0]
        : {
            id: randId(),
            type: 'edge',
            from: '',
            to: '',
            key: '',
            length: 0,
            x: 0,
            y: 0,
            rotation: 0,
          },
    ];

    for (const node of this.nodes) {
      if (node.type === 'decision' || node.type === 'start') {
        for (const [key, to] of Object.entries(node.next)) {
          if (id && node.id !== id && to !== id) {
            const stable = current.find(
              (edge) =>
                edge.from === node.id && edge.key === key && edge.to === to,
            );
            if (stable) {
              this.edges.push(stable);
              continue;
            }
          }

          const position = this.computeEdgePosition({
            from: node.id,
            key: key,
            to: to,
          });

          if (position) {
            this.edges.push({
              id: randId(),
              type: 'edge',
              ...position,
            });
          }
        }
      }
    }
  };

  findNodeById(id: string | null) {
    return this.nodes.find((node) => node.id === id);
  }

  addDecisionNode() {
    const id = randId();
    this.nodes.push({
      id: id,
      type: 'decision',
      next: {
        '<1>': '',
        '<2>': '',
      },
      test: decisions[0],
      x: 0,
      y: 0,
    });
    this.updateNode(id);
  }

  addActionNode() {
    const id = randId();
    this.nodes.push({
      id: id,
      type: 'action',
      command: actions[0],
      x: 0,
      y: 0,
    });
    this.updateNode(id);
  }

  updateNode(id: string) {
    this.nodes = this.nodes.map((node) => {
      return id === node.id ? { ...node } : node;
    }) as AgentTree;

    this.rebuildEdges(id);
    this.rerender();
  }

  updateNodes() {
    this.rebuildEdges();
    this.rerender();
  }

  updateDummyEdge(from: string, vertex: string, x: number, y: number) {
    this.edges[0] = {
      ...this.edges[0],
      ...this.computeDummyEdgePosition(from, vertex, x, y),
    };
    this.rerender();
  }

  deleteNode = (id: string) => {
    for (const node of this.nodes) {
      if (node.type === 'decision') {
        for (const [key, value] of Object.entries(node.next)) {
          if (value === id) {
            node.next[key] = null;
          }
        }
      }
    }

    this.nodes = this.nodes.filter((node) => node.id !== id) as AgentTree;
    this.rebuildEdges(id);
    this.rerender();
  };

  updateVertexes = (id: string, keys: string[]) => {
    const node = this.findNodeById(id) as DecisionItem;
    const updated: Record<string, string | null> = {};
    for (const [index, key] of keys.entries()) {
      updated[key] = Object.values(node.next)[index];
    }

    node.next = updated;
    this.rebuildEdges(id);
    this.rerender();
  };

  computeDummyEdgePosition(
    fromId: string,
    vertex: string,
    x: number,
    y: number,
  ) {
    const from = this.findNodeById(fromId) as DecisionItem;

    const fromRect = document
      .querySelector(`[data-id="${from.id}"]`)!
      .getBoundingClientRect() ?? { width: 160, height: 60 };

    const paths = Object.keys(from.next);
    const numPaths = paths.length;
    const index = paths.indexOf(vertex);

    const fx = from.x + ((index + 0.5) * fromRect.width) / numPaths;
    const fy = from.y + fromRect.height;
    const tx = x - fromRect.x + from.x;
    const ty = y - fromRect.y + from.y;

    const edgeLength = Math.sqrt(
      Math.pow(Math.abs(tx - fx), 2) + Math.pow(Math.abs(ty - fy), 2),
    );

    return {
      length: edgeLength,
      x: fx,
      y: from.y + fromRect.height,
      rotation: (180 * Math.atan2(ty - fy, tx - fx)) / Math.PI,
    };
  }

  computeEdgePosition(edge: { from: string; to: string | null; key: string }) {
    const { from: fromId, key, to: toId } = edge;
    const from = this.findNodeById(fromId) as DecisionItem;
    const to = this.findNodeById(toId);

    if (!to) {
      return null;
    }

    const paths = Object.keys(from.next);
    const numPaths = paths.length;
    const toIndex = paths.indexOf(key);

    const fromRect = document
      .querySelector(`[data-id="${from.id}"]`)!
      .getBoundingClientRect();

    const toRect = document
      .querySelector(`[data-id="${to.id}"]`)!
      .getBoundingClientRect();

    const fx = from.x + ((toIndex + 0.5) * fromRect.width) / numPaths;
    const fy = from.y + fromRect.height;
    const tx = to.x + toRect.width / 2;
    const ty = to.y;

    const edgeLength = Math.sqrt(
      Math.pow(Math.abs(tx - fx), 2) + Math.pow(Math.abs(ty - fy), 2),
    );

    return {
      ...edge,
      to: edge.to!,
      length: edgeLength,
      x: fx,
      y: from.y + fromRect.height,
      rotation: (180 * Math.atan2(ty - fy, tx - fx)) / Math.PI,
    };
  }
}
