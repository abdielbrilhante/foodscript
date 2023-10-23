import type { AgentTemplate } from '../decision-tree/types';
import { randId } from '../decision-tree/utils';
import { LocalStorage } from '../shared/local-storage';
import { SIMPLETON_ID, Simpleton, startNode } from './dummy';

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
      LocalStorage.setItem('agents', JSON.stringify([SIMPLETON_ID]));
      this.persist(Simpleton());
    }
  }

  agents() {
    return json(LocalStorage.getItem('agents'), [SIMPLETON_ID]);
  }

  load() {
    return this.agents()
      .map(this.parse)
      .filter((item) => item != null) as AgentTemplate[];
  }

  parse = (id: string) => {
    return json<AgentTemplate | null>(LocalStorage.getItem(id), null);
  };

  persist(agentDef: AgentTemplate) {
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

  append(template: AgentTemplate) {
    if (this.agents().includes(template.id)) {
      template.id = randId();
    }

    this.persist(template);
    return template.id;
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
