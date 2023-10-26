import './decision-tree.css';

import { ActionNode } from './action';
import { DecisionNode } from './decision';
import type { Graph } from './graph';
import { useDecisionTree } from './use-decision-tree';
import { classes } from './utils';

export function DecisionTree(props: { graph: Graph }) {
  const { graph } = props;
  const { state, events } = useDecisionTree(graph);

  const {
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
  } = events;

  return (
    <div className="decision-tree" style={graph.size()}>
      {graph.$edges.map((edge) => (
        <div
          key={edge.id}
          data-from={edge.from}
          data-to={edge.to}
          className={classes(
            'edge',
            graph.$errors.loops.some(
              (loop) => loop.includes(edge.from) && loop.includes(edge.to),
            ) && 'invalid',
            graph.$highlight.some(
              (id, index) =>
                edge.from === id && edge.to === graph.$highlight[index + 1],
            ) && 'highlight-path',
          )}
          style={{
            width: edge.length,
            left: edge.x,
            top: edge.y,
            transform: `rotate(${edge.rotation}deg)`,
            borderTopStyle: edge.to ? 'solid' : 'dashed',
          }}
        />
      ))}

      {graph.$nodes.map((node) =>
        node.type === 'start' ? (
          <div
            key={node.id}
            data-id={node.id}
            onMouseDown={onNodePress}
            onMouseUp={onNodeRelease}
            onClick={onNodeClick}
            className={classes(
              'decision',
              state.$selected === node.id && 'selected',
              graph.$highlight.includes(node.id) && 'highlight-path',
            )}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
            }}
          >
            <div className="root-label">Perception</div>
            <div className="vertexes">
              <button type="button" className="vertex" onClick={onVertexClick}>
                Start
              </button>
            </div>
          </div>
        ) : (
          <div
            key={node.id}
            data-id={node.id}
            onMouseDown={onNodePress}
            onMouseUp={onNodeRelease}
            onClick={onNodeClick}
            onMouseEnter={onNodeHover}
            onMouseLeave={onNodeHoverEnd}
            className={classes(
              node.type,
              state.$selected === node.id && 'selected',
              state.$hovered === node.id && 'hovered',
              graph.$errors.loops.some((loop) => loop.includes(node.id)) &&
                'invalid',
              graph.$highlight.includes(node.id) && 'highlight-path',
            )}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
            }}
          >
            {node.type === 'decision' ? (
              <DecisionNode
                node={node}
                selected={state.$selected === node.id}
                vertex={state.$vertex}
                onVertexClick={onVertexClick}
                onDelete={onDelete}
                onAddVertex={onAddVertex}
                onSaveVertexes={onSaveVertexes}
                onChangePerception={onUpdateChoice}
              />
            ) : (
              <ActionNode
                node={node}
                onDelete={onDelete}
                onChangeAction={onUpdateChoice}
              />
            )}
          </div>
        ),
      )}
    </div>
  );
}
