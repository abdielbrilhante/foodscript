import { actions } from '../simulation/constants';
import type { ActionItem } from './types';
import { readable } from './utils';

export function ActionNode(props: {
  node: ActionItem;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onChangeAction: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const { node, onDelete, onChangeAction } = props;
  return (
    <>
      <label htmlFor={`action__${node.id}`}>
        <select
          id={`action__${node.id}`}
          value={node.command}
          onChange={onChangeAction}
        >
          {actions.map((action) => (
            <option key={action} value={action}>
              {readable(action)}
            </option>
          ))}
        </select>
        <span className="arrow" />
      </label>
      <button type="button" className="delete config" onClick={onDelete}>
        ×
      </button>
    </>
  );
}
