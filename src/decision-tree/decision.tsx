import { useEffect, useRef, useState } from 'react';

import { perceptions } from '../sim/constants';
import type { DecisionItem } from './types';
import { classes, readable } from './utils';

export function DecisionNode(props: {
  selected: boolean;
  node: DecisionItem;
  vertex: string | null;
  onVertexClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onAddVertex: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSaveVertexes: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onChangePerception: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const vertexes = useRef<HTMLDivElement>(null);
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
      {node.test ? (
        <label htmlFor={`perception__${node.id}`}>
          <select
            id={`perception__${node.id}`}
            value={node.test}
            onChange={onChangePerception}
          >
            {perceptions.map((perception) => (
              <option key={perception} value={perception}>
                {readable(perception)}
              </option>
            ))}
          </select>
          <span className="arrow" />
        </label>
      ) : (
        <div className="root-label">Perception</div>
      )}

      {node.test != null && (
        <button type="button" className="delete config" onClick={onDelete}>
          ×
        </button>
      )}

      {node.test != null && (
        <button
          type="button"
          className="edit config"
          onClick={edit ? onSaveVertexes : () => setEdit(true)}
        >
          {edit ? 'Ok' : 'Edit'}
        </button>
      )}

      {edit && (
        <button type="button" className="add config" onClick={onAddVertex}>
          +
        </button>
      )}

      {edit ? (
        <div className="vertexes" ref={vertexes}>
          {Object.keys(node.next).map((key) => (
            <input key={key} className="vertex" defaultValue={key} />
          ))}
        </div>
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
