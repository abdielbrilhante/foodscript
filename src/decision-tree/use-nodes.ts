import { useEffect, useMemo, useState } from 'react';

import { Graph } from './graph';

export function useNodes(id: string) {
  const [, trigger] = useState(Symbol);

  const graph = useMemo(
    () => (id ? new Graph(id, () => trigger(Symbol())) : null),
    [id],
  );

  useEffect(() => {
    if (graph) {
      graph.rebuildEdges();
      graph.rerender();
    }
  }, [graph]);

  return graph;
}
