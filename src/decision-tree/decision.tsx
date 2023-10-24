import { useEffect, useState } from 'react';

import { decisions } from '../simulation/constants';
import type { DecisionItem } from './types';
import { classes, readable } from './utils';

export function DecisionNode(props: {
  selected: boolean;
  node: DecisionItem;
  vertex: string | null;
  onVertexClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onAddVertex: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSaveVertexes: (event: React.FormEvent<HTMLFormElement>) => void;
  onChangePerception: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const [edit, setEdit] = useState(false);
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
    if (!selected && edit) {
      setEdit(false);
    }
  }, [selected, edit]);

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

      <button type="button" className="delete config" onClick={onDelete}>
        ×
      </button>

      {edit ? (
        <button type="button" className="add config" onClick={onAddVertex}>
          +
        </button>
      ) : (
        <button
          type="button"
          className="edit config"
          onClick={() => setEdit(true)}
        >
          Edit
        </button>
      )}

      {edit ? (
        <form className="vertexes" onSubmit={onSaveVertexes}>
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
