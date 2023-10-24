import { useCallback, useEffect, useState } from 'react';

import { LocalStorage } from '../shared/local-storage';
import { agentService } from '../simulation/agents';
import { Graph } from './graph';
import { useNodes } from './use-nodes';

let agents = agentService.load();

export function useAgentEditor() {
  const [agent, setAgent] = useState(
    () => LocalStorage.getItem('edit') ?? agents[0]?.id ?? '',
  );
  const [name, setName] = useState('');
  const [exported, setExported] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [dryRun, setDryRun] = useState(false);

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

  return {
    state: {
      agent,
      agents,
      name,
      renaming,
      graph,
      exported,
      dryRun,
    },
    setters: {
      setName,
      setAgent,
      setDryRun,
    },
    events: {
      onPasteJSON,
      onAddNew,
      onRename,
      onDeleteAgent,
      onClone,
      onCopy,
      onAddDecision,
      onAddAction,
    },
  };
}
