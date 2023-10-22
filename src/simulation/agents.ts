import type { AgentDef } from '../decision-tree/types';
import { randId } from '../decision-tree/utils';
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
    if (!localStorage.getItem('adt__agents')) {
      localStorage.setItem('adt__agents', JSON.stringify([Simpleton.id]));
      this.persist(Simpleton);
    }
  }

  agents() {
    return json(localStorage.getItem('adt__agents'), [Simpleton.id]);
  }

  parse = (id: string) => {
    return json<AgentDef | null>(localStorage.getItem(`adt__${id}`), null);
  };

  persist(agentDef: AgentDef) {
    localStorage.setItem(
      'adt__agents',
      JSON.stringify(Array.from(new Set(this.agents().concat(agentDef.id)))),
    );
    localStorage.setItem(`adt__${agentDef.id}`, JSON.stringify(agentDef));
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
    localStorage.setItem(
      'adt__agents',
      JSON.stringify(
        Array.from(new Set(this.agents().filter((_id) => _id !== id))),
      ),
    );
    localStorage.removeItem(`adt__${id}`);
  }
}

export const agentService = new AgentService();
