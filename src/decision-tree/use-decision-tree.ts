import { useCallback, useEffect } from 'react';

import { ReactiveState, useReactiveState } from '../shared/use-reactive-state';
import type { decisions } from '../simulation/constants';
import type { Action } from '../types';
import type { Graph } from './graph';
import type { ActionItem, DecisionItem } from './types';
import { useMouseMove } from './use-mouse-move';

function getNodeId(event: React.MouseEvent | React.FormEvent) {
  return event.currentTarget.getAttribute('data-id');
}

class DecisionTreeState extends ReactiveState {
  $selected: string | null = null;
  $vertex: string | null = null;
  $hovered: string | null = null;

  isLongPress = false;
  cursorBase: { x: number; y: number } | null = null;

  clearVertexState() {
    this.$vertex = null;
    this.$selected = null;
  }
}

export function useDecisionTree(graph: Graph) {
  const mouseMove = useMouseMove();

  const state = useReactiveState(() => new DecisionTreeState());

  const onNodePress = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return;
      }

      state.isLongPress = false;
      const id = getNodeId(event)!;

      mouseMove.watch((_event: MouseEvent) => {
        const node = graph.findNodeById(id)!;

        if (!state.cursorBase) {
          state.cursorBase = {
            x: _event.clientX - node.x,
            y: _event.clientY - node.y,
          };
        } else {
          state.isLongPress = true;
          node.x = _event.clientX - state.cursorBase!.x;
          node.y = _event.clientY - state.cursorBase!.y;
          graph.updateNode(id);
        }
      });
    },
    [graph, state, mouseMove],
  );

  const onNodeRelease = useCallback(() => {
    state.cursorBase = null;
    mouseMove.unwatch();
  }, [mouseMove, state]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (state.isLongPress) {
        return;
      }

      mouseMove.unwatch();

      const id = getNodeId(event)!;
      if (state.$hovered === id) {
        const node = graph.findNodeById(state.$selected) as DecisionItem;
        node.next[state.$vertex!] = id;
        graph.updateNode(id);

        state.clearVertexState();
      } else {
        state.$selected = id;
      }
    },
    [graph, state, mouseMove],
  );

  const onNodeHover = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const id = getNodeId(event);
      if (!state.$vertex || id === state.$selected) {
        return;
      }

      state.$hovered = id;
    },
    [state],
  );

  const onNodeHoverEnd = useCallback(() => {
    state.$hovered = null;
  }, [state]);

  const onVertexClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.currentTarget.nodeName === 'INPUT') {
        return;
      }

      event.stopPropagation();
      const value = event.currentTarget.textContent!.toLowerCase();

      mouseMove.watch((_event: MouseEvent) => {
        graph.updateDummyEdge(
          state.$selected!,
          value,
          _event.clientX,
          _event.clientY,
        );
      });

      state.$vertex = value;
    },
    [graph, mouseMove, state],
  );

  const onDelete = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      const id = getNodeId(event)!;
      graph.deleteNode(id);
    },
    [graph],
  );

  const onAddVertex = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      const id = getNodeId(event)!;
      const node = graph.findNodeById(id) as DecisionItem;
      const key = `<${Object.keys(node.next).length + 1}>`;
      node.next[key] = '';
      graph.updateNode(id);
    },
    [graph],
  );

  const onSaveVertexes = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const id = getNodeId(event)!;
      const keys: string[] = [];
      const inputs =
        event.currentTarget.parentElement!.querySelectorAll('input');
      for (const input of inputs) {
        if (input.value && !keys.includes(input.value)) {
          keys.push(input.value);
        }
      }

      graph.updateVertexes(id, keys);
      state.clearVertexState();
    },
    [graph, state],
  );

  const onUpdateChoice = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.currentTarget.value;
      const id = event.currentTarget.id.split('__').pop()!;
      const node = graph.findNodeById(id) as DecisionItem | ActionItem;
      if (node.type === 'decision') {
        node.test = value as (typeof decisions)[number];
      } else {
        node.command = value as Action;
      }
      graph.updateNode(id);
    },
    [graph],
  );

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      const active = document.querySelector('.selected');
      if (
        active &&
        (!active.contains(event.target as HTMLElement) ||
          active.getAttribute('data-id') === graph.$nodes[0].id)
      ) {
        mouseMove.unwatch();
        graph.updateNodes();
        state.clearVertexState();
      }
    }

    document.addEventListener('click', onDocumentClick);
    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
  }, [graph, mouseMove, state]);

  return {
    state: state,
    events: {
      onNodePress,
      onNodeRelease,
      onNodeClick,
      onNodeHover,
      onNodeHoverEnd,
      onVertexClick,
      onDelete,
      onAddVertex,
      onSaveVertexes,
      onUpdateChoice,
    },
  };
}
