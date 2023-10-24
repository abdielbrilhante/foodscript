import React, { useCallback, useEffect, useState } from 'react';

import './agent-editor.css';

import { LocalStorage } from '../shared/local-storage';
import { agentService } from '../simulation/agents';
import { SIMPLETON_ID } from '../simulation/dummy';
import { DecisionTree } from './decision-tree';
import { Graph } from './graph';
import { useNodes } from './use-nodes';

let agents = agentService.load();

export function AgentEditor(props: {
  switchScreen: () => void;
  openHelp: () => void;
}) {
  const { switchScreen, openHelp } = props;

  const [agent, setAgent] = useState(
    () => LocalStorage.getItem('edit') ?? agents[0]?.id ?? '',
  );
  const [name, setName] = useState('');
  const [exported, setExported] = useState(false);
  const [renaming, setRenaming] = useState(false);

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
  }, [name]);

  const onRename = useCallback(() => {
    if (renaming && graph) {
      if (graph) {
        graph.updateName(name);
      }

      agents = agentService.load();
      setName('');
      setRenaming(false);
    } else {
      setName(agents.find((item) => item.id === agent)?.name ?? '');
      setRenaming((value) => !value);
    }
  }, [renaming, graph, name, agent]);

  const onDeleteAgent = useCallback(() => {
    agentService.delete(agent);
    agents = agentService.load();
    setAgent(agents[0]?.id ?? '');
  }, [agent]);

  const onClone = useCallback(async () => {
    if (graph) {
      const template = agents.find((item) => item.id === agent)!;
      const id = agentService.append({
        ...template,
        name: `${template.name} (clone)`,
      });
      agents = agentService.load();
      setAgent(id);
    }
  }, [graph, agent]);

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
      } else {
        event.preventDefault();
      }
    },
    [],
  );

  useEffect(() => {
    if (!agent) {
      setName('');
    }

    LocalStorage.setItem('edit', agent);
  }, [agent]);

  return (
    <div className="agent-editor">
      <div className="editor-actions">
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
              <button onClick={onClone} disabled={!agent}>
                Clone
              </button>
              <button onClick={onCopy} disabled={!agent || exported}>
                {exported ? 'Copied!' : 'Copy as JSON'}
              </button>
            </>
          )}
        </div>
        <div className="action-set">
          <button disabled={!agent} onClick={onAddDecision}>
            Add decision
          </button>
          <button disabled={!agent} onClick={onAddAction}>
            Add action
          </button>
          <button className="switch-screen" onClick={switchScreen}>
            Go to simulation
          </button>
          <button className="info" onClick={openHelp}>
            ?
          </button>
        </div>
      </div>
      <div className="decision-tree-container">
        {graph ? <DecisionTree graph={graph} /> : null}
      </div>
    </div>
  );
}
