import './agent-editor.css';

import { SIMPLETON_ID } from '../simulation/dummy';
import { DecisionTree } from './decision-tree';
import { DryRun } from './dry-run';
import { useAgentEditor } from './use-agent-editor';

export function AgentEditor(props: {
  switchScreen: () => void;
  openHelp: () => void;
}) {
  const { switchScreen, openHelp } = props;

  const { state, setters, events } = useAgentEditor();
  const { agent, agents, name, renaming, graph, exported, dryRun } = state;
  const {
    onPasteJSON,
    onAddNew,
    onRename,
    onDeleteAgent,
    onClone,
    onCopy,
    onAddDecision,
    onAddAction,
  } = events;
  const { setName, setAgent, setDryRun } = setters;

  return (
    <div className="agent-editor">
      <form className="editor-actions">
        <div className="action-set">
          <label htmlFor="agent">
            <div>Agent</div>
            {renaming ? (
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Agent name"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
              />
            ) : (
              <select
                id="agent"
                value={agent}
                onChange={(event) => setAgent(event.currentTarget.value)}
              >
                <option value="">Add new</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            )}
          </label>
          {!agent ? (
            <>
              <label htmlFor="name">
                <div>Agent name</div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Agent name"
                  value={name}
                  onChange={(event) => setName(event.currentTarget.value)}
                />
              </label>
              <label htmlFor="">
                <div>Import decision tree</div>
                <input onChange={onPasteJSON} placeholder="Paste JSON here" />
              </label>
              <button type="button" disabled={!name} onClick={onAddNew}>
                Save
              </button>
            </>
          ) : (
            <>
              {agent !== SIMPLETON_ID && (
                <>
                  <button type="button" onClick={onRename}>
                    {renaming ? 'Save' : 'Rename'}
                  </button>
                  <button type="button" onClick={onDeleteAgent}>
                    Delete
                  </button>
                </>
              )}
              <button type="button" onClick={onClone} disabled={!agent}>
                Clone
              </button>
              <button
                type="button"
                onClick={onCopy}
                disabled={!agent || exported}
              >
                {exported ? 'Copied!' : 'Copy as JSON'}
              </button>
            </>
          )}
        </div>
        <div className="action-set">
          <button type="button" disabled={!agent} onClick={onAddDecision}>
            Add decision
          </button>
          <button type="button" disabled={!agent} onClick={onAddAction}>
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
          {dryRun ? (
            <DryRun graph={graph} collapse={() => setDryRun(false)} />
          ) : (
            <button type="button" onClick={() => setDryRun(true)}>
              Test decision tree
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
