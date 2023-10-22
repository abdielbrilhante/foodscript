import type { AgentDef } from '../decision-tree/types';
import { randId } from '../decision-tree/utils';
import { LocalStorage } from '../shared/local-storage';
import { Simpleton, startNode } from './dummy';

function json<T>(content: string | null, fallback: T) {
  if (content == null) {
    return fallback;
  }

  try {
    return JSON.parse(content) as T;
  } catch (error) {
    return fallback;
  }
}

class AgentService {
  constructor() {
    if (!LocalStorage.getItem('agents')) {
      LocalStorage.setItem('agents', JSON.stringify([Simpleton.id]));
      this.persist(Simpleton);
    }
  }

  agents() {
    return json(LocalStorage.getItem('agents'), [Simpleton.id]);
  }

  parse = (id: string) => {
    return json<AgentDef | null>(LocalStorage.getItem(id), null);
  };

  persist(agentDef: AgentDef) {
    LocalStorage.setItem(
      'agents',
      JSON.stringify(Array.from(new Set(this.agents().concat(agentDef.id)))),
    );
    LocalStorage.setItem(agentDef.id, JSON.stringify(agentDef));
  }

  create(name: string) {
    const id = randId();
    this.persist({
      id: id,
      name: name.trim(),
      tree: [{ ...startNode }],
    });

    return id;
  }

  delete(id: string) {
    LocalStorage.setItem(
      'agents',
      JSON.stringify(
        Array.from(new Set(this.agents().filter((_id) => _id !== id))),
      ),
    );
    LocalStorage.removeItem(`${id}`);
  }
}

export const agentService = new AgentService();
