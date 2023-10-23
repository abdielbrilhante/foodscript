import React, { useCallback, useEffect, useState } from 'react';

import './agent-editor.css';

import { agentService } from '../simulation/agents';
import { SIMPLETON_ID } from '../simulation/dummy';
import { DecisionTree } from './decision-tree';
import { Graph } from './graph';
import { useNodes } from './use-nodes';

let agents = agentService.load();

export function AgentEditor(props: { switchScreen: () => void }) {
  const { switchScreen } = props;

  const [adding, setAdding] = useState(!agents.length);
  const [agent, setAgent] = useState(agents[0]?.id ?? '');
  const [name, setName] = useState('');
  const [exported, setExported] = useState(false);

  const graph = useNodes(agent);

  const onAddDecision = useCallback(() => {
    if (graph) {
      graph.addDecisionNode();
    }
  }, [graph]);

  const onAddAction = useCallback(() => {
    if (graph) {
      graph.addActionNode();
    }
  }, [graph]);

  const onAddNew = useCallback(() => {
    const id = agentService.create(name);
    agents = agentService.load();
    setAgent(id);
    setAdding(false);
  }, [name]);

  const onDeleteAgent = useCallback(() => {
    agentService.delete(agent);
    agents = agentService.load();
    setAgent(agents[0]?.id ?? '');
  }, [agent]);

  const onCopy = useCallback(async () => {
    if (graph) {
      setExported(true);
      await navigator.clipboard.writeText(graph.toJSON());
      setTimeout(() => {
        setExported(false);
      }, 1500);
    }
  }, [graph]);

  const onPasteJSON = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const template = Graph.fromJSON(event.currentTarget.value);
      if (template) {
        const id = agentService.append(template);
        agents = agentService.load();
        setAgent(id);
        setAdding(false);
      } else {
        event.preventDefault();
      }
    },
    [],
  );

  useEffect(() => {
    if (!agent) {
      setAdding(true);
    } else {
      setName('');
    }
  }, [agent]);

  return (
    <div className="agent-editor">
      <div className="editor-actions">
        <div className="action-set">
          {adding ? (
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
              <button type="button" disabled={!name} onClick={onAddNew}>
                Save
              </button>
              <label htmlFor="">
                <div>Import decision tree</div>
                <input onChange={onPasteJSON} placeholder="Paste JSON here" />
              </label>
            </>
          ) : (
            <>
              <label htmlFor="agent">
                <div>Agent</div>
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
              </label>
              {agent !== SIMPLETON_ID && (
                <button type="button" onClick={onDeleteAgent}>
                  Delete
                </button>
              )}
              <button onClick={onCopy} disabled={adding || exported}>
                {exported ? 'Copied!' : 'Copy as JSON'}
              </button>
            </>
          )}
        </div>
        <div className="action-set">
          <button disabled={adding} onClick={onAddDecision}>
            Add decision
          </button>
          <button disabled={adding} onClick={onAddAction}>
            Add action
          </button>
          <button className="switch-screen" onClick={switchScreen}>
            Go to simulation
          </button>
        </div>
      </div>
      <div className="decision-tree-container">
        {graph ? <DecisionTree graph={graph} /> : null}
      </div>
    </div>
  );
}
