import { useEffect } from 'react';

import { ReactiveState, useReactiveState } from '../shared/use-reactive-state';
import { decisions } from '../simulation/constants';
import type { DecisionItem } from './types';
import { classes, readable } from './utils';

class DecisionNodeState extends ReactiveState {
  $edit = false;
}

export function DecisionNode(props: {
  selected: boolean;
  node: DecisionItem;
  vertex: string | null;
  onVertexClick: React.MouseEventHandler<HTMLButtonElement>;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
  onAddVertex: React.MouseEventHandler<HTMLButtonElement>;
  onSaveVertexes: React.FormEventHandler<HTMLFormElement>;
  onChangePerception: React.ChangeEventHandler<HTMLSelectElement>;
}) {
  const state = useReactiveState(() => new DecisionNodeState());
  const {
    selected,
    node,
    vertex,
    onVertexClick,
    onDelete,
    onAddVertex,
    onSaveVertexes,
    onChangePerception,
  } = props;

  useEffect(() => {
    if (!selected && state.$edit) {
      state.$edit = false;
    }
  }, [selected, state.$edit, state]);

  return (
    <>
      <label htmlFor={`perception__${node.id}`}>
        <select
          id={`perception__${node.id}`}
          value={node.test}
          onChange={onChangePerception}
        >
          {decisions.map((perception) => (
            <option key={perception} value={perception}>
              {readable(perception)}
            </option>
          ))}
        </select>
        <span className="arrow" />
      </label>

      <button
        type="button"
        className="delete config"
        data-id={node.id}
        onClick={onDelete}
      >
        ×
      </button>

      {state.$edit ? (
        <button
          type="button"
          className="add config"
          data-id={node.id}
          onClick={onAddVertex}
        >
          +
        </button>
      ) : (
        <button
          type="button"
          className="edit config"
          onClick={() => {
            state.$edit = true;
          }}
        >
          Edit
        </button>
      )}

      {state.$edit ? (
        <form className="vertexes" data-id={node.id} onSubmit={onSaveVertexes}>
          {Object.keys(node.next).map((key) => (
            <input key={key} className="vertex" defaultValue={key} />
          ))}
          <button type="submit" className="edit config">
            Ok
          </button>
        </form>
      ) : (
        <div className="vertexes">
          {Object.keys(node.next).map((key) => (
            <button
              key={key}
              type="button"
              className={classes(
                'vertex',
                vertex === key && 'highlight',
                !node.next[key] && 'invalid',
              )}
              onClick={onVertexClick}
            >
              {key}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
