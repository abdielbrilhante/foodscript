import './agent-editor.css';

import { useReactiveState } from '../shared/use-reactive-state';
import { SIMPLETON_ID } from '../simulation/dummy';
import { AgentEditorState } from './agent-editor-state';
import { DecisionTree } from './decision-tree';
import { DryRun } from './dry-run';

export function AgentEditor(props: {
  switchScreen: () => void;
  openHelp: () => void;
}) {
  const { switchScreen, openHelp } = props;

  const state = useReactiveState(() => new AgentEditorState());
  const graph = state.$graph;

  return (
    <div className="agent-editor">
      <form className="editor-actions">
        <div className="action-set">
          <label htmlFor="agent">
            <div>Agent</div>
            {state.$renaming ? (
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Agent name"
                value={state.$name}
                onChange={(event) => (state.$name = event.currentTarget.value)}
              />
            ) : (
              <select
                id="agent"
                value={state.$agent}
                onChange={(event) => (state.$agent = event.currentTarget.value)}
              >
                <option value="">Add new</option>
                {state.$agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            )}
          </label>
          {!state.$agent ? (
            <>
              <label htmlFor="name">
                <div>Agent name</div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Agent name"
                  value={state.$name}
                  onChange={(event) => {
                    state.$name = event.currentTarget.value;
                  }}
                />
              </label>
              <label htmlFor="">
                <div>Import decision tree</div>
                <input
                  onChange={state.onPasteJSON}
                  placeholder="Paste JSON here"
                />
              </label>
              <button
                type="button"
                disabled={!state.$name}
                onClick={state.onAddNew}
              >
                Save
              </button>
            </>
          ) : (
            <>
              {state.$agent !== SIMPLETON_ID && (
                <>
                  <button type="button" onClick={state.onRename}>
                    {state.$renaming ? 'Save' : 'Rename'}
                  </button>
                  <button type="button" onClick={state.onDeleteAgent}>
                    Delete
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={state.onClone}
                disabled={!state.$agent}
              >
                Clone
              </button>
              <button
                type="button"
                onClick={state.onCopy}
                disabled={!state.$agent || state.$exported}
              >
                {state.$exported ? 'Copied!' : 'Copy as JSON'}
              </button>
            </>
          )}
        </div>
        <div className="action-set">
          <button
            type="button"
            disabled={!graph}
            onClick={graph?.addDecisionNode}
          >
            Add decision
          </button>
          <button
            type="button"
            disabled={!graph}
            onClick={graph?.addActionNode}
          >
            Add action
          </button>
          <button
            type="button"
            className="switch-screen"
            onClick={switchScreen}
          >
            Go to simulation
          </button>
          <button type="button" className="info" onClick={openHelp}>
            ?
          </button>
        </div>
      </form>
      <div className="decision-tree-container">
        {graph ? <DecisionTree graph={graph} /> : null}
      </div>

      {graph ? (
        <div className="dry-run-container">
          {state.$dryRun ? (
            <DryRun
              graph={graph}
              collapse={() => {
                state.$dryRun = false;
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                state.$dryRun = true;
              }}
            >
              Test decision tree
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
