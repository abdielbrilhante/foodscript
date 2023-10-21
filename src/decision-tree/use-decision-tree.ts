import { useCallback, useEffect, useRef, useState } from 'react';

import type { Action, Perception } from '../types';
import type { Graph } from './graph';
import type { DecisionItem } from './types';
import { useMouseMove } from './use-mouse-move';

export function useDecisionTree(graph: Graph) {
  const mouseMove = useMouseMove();

  const isLongPress = useRef(false);
  const base = useRef<{ x: number; y: number } | null>(null);

  const [selected, setSelected] = useState<string | null>(null);
  const [vertex, setVertex] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const onNodePress = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return;
      }

      isLongPress.current = false;
      const element = event.currentTarget;
      const id = element.getAttribute('data-id')!;

      mouseMove.watch((_event: MouseEvent) => {
        const node = graph.findNodeById(id)!;

        if (!base.current) {
          base.current = {
            x: _event.clientX - node.x,
            y: _event.clientY - node.y,
          };
        } else {
          isLongPress.current = true;
          node.x = _event.clientX - base.current!.x;
          node.y = _event.clientY - base.current!.y;
          graph.updateNode(id);
        }
      });
    },
    [graph, mouseMove],
  );

  const onNodeRelease = useCallback(() => {
    base.current = null;
    mouseMove.unwatch();
  }, [mouseMove]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isLongPress.current) {
        return;
      }

      mouseMove.unwatch();

      const id = event.currentTarget.getAttribute('data-id')!;
      if (hovered === id) {
        const node = graph.findNodeById(selected) as DecisionItem;
        node.next[vertex!] = id;
        graph.updateNode(id);

        setVertex(null);
        setHovered(null);
      } else {
        setSelected(event.currentTarget.getAttribute('data-id'));
      }
    },
    [graph, selected, hovered, vertex, mouseMove],
  );

  const onNodeHover = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const id = event.currentTarget.getAttribute('data-id');
      if (!vertex || id === selected) {
        return;
      }

      setHovered(id);
    },
    [vertex, selected],
  );

  const onNodeHoverEnd = useCallback(() => {
    setHovered(null);
  }, []);

  const onVertexClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.currentTarget.nodeName === 'INPUT') {
        return;
      }

      event.stopPropagation();
      const value = event.currentTarget.textContent!.toLowerCase();

      mouseMove.watch((_event: MouseEvent) => {
        graph.updateDummyEdge(selected!, value, _event.clientX, _event.clientY);
      });

      setVertex(value);
    },
    [graph, selected, mouseMove],
  );

  const onDelete = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      const id = event.currentTarget.parentElement!.getAttribute('data-id')!;
      graph.deleteNode(id);
    },
    [graph],
  );

  const onAddVertex = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      const id = event.currentTarget.parentElement!.getAttribute('data-id')!;
      const node = graph.findNodeById(id) as DecisionItem;
      const key = `<${Object.keys(node.next).length + 1}>`;
      node.next[key] = '';
      graph.updateNode(id);
    },
    [graph],
  );

  const onSaveVertexes = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      const id = event.currentTarget.parentElement!.getAttribute('data-id')!;
      const keys: string[] = [];
      const inputs =
        event.currentTarget.parentElement!.querySelectorAll('input');
      for (const input of inputs) {
        if (input.value && !keys.includes(input.value)) {
          keys.push(input.value);
        }
      }

      graph.updateVertexes(id, keys);
      setVertex(null);
      setSelected(null);
    },
    [graph],
  );

  const onUpdateChoice = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.currentTarget.value;
      const id = event.currentTarget.id.split('__').pop()!;
      const node = graph.findNodeById(id)!;
      if ('test' in node) {
        node.test = value as keyof Perception;
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
      if (active && !active.contains(event.target as HTMLElement)) {
        mouseMove.unwatch();
        graph.updateNodes();
        setSelected(null);
        setVertex(null);
      }
    }

    document.addEventListener('click', onDocumentClick);
    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
  }, [selected, mouseMove, graph]);

  return {
    state: {
      selected,
      hovered,
      vertex,
    },
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
