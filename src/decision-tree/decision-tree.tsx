import './decision-tree.css';

import { ActionNode } from './action';
import { DecisionNode } from './decision';
import type { Graph } from './graph';
import { useDecisionTree } from './use-decision-tree';
import { classes } from './utils';

// TODO:
// copy JSON
// import (validate) JSON
// readonly simpleton
// test tree box
// <form> for vertexes
// esc discards dummy vertex
// doc click discards too
// FoodScript -> atg?
// relative positioning

export function DecisionTree(props: { graph: Graph }) {
  const { graph } = props;
  const { state, events } = useDecisionTree(graph);

  const { selected, hovered, vertex } = state;

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
      {graph.edges.map((edge) => (
        <div
          key={edge.id}
          data-from={edge.from}
          data-to={edge.to}
          className={classes(
            'edge',
            graph.errors.loops.some(
              (loop) => loop.includes(edge.from) && loop.includes(edge.to),
            ) && 'invalid',
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

      {graph.nodes.map((node) =>
        node.type === 'start' ? (
          <div
            key={node.id}
            data-id={node.id}
            onMouseDown={onNodePress}
            onMouseUp={onNodeRelease}
            onClick={onNodeClick}
            className={classes('decision', selected === node.id && 'selected')}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
            }}
          >
            <div className="root-label">Perception</div>
            <div className="vertexes">
              <button className="vertex" onClick={onVertexClick}>
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
              selected === node.id && 'selected',
              hovered === node.id && 'hovered',
              graph.errors.loops.some((loop) => loop.includes(node.id)) &&
                'invalid',
            )}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
            }}
          >
            {node.type === 'decision' ? (
              <DecisionNode
                node={node}
                selected={selected === node.id}
                vertex={vertex}
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
