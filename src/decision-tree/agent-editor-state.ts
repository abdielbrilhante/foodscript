import { LocalStorage } from '../shared/local-storage';
import { ReactiveState } from '../shared/use-reactive-state';
import { agentService } from '../simulation/agents';
import { Graph } from './graph';

export class AgentEditorState extends ReactiveState {
  $agent: string;
  $name = '';
  $exported = false;
  $renaming = false;
  $dryRun = false;
  $graph: Graph | null;
  $agents = agentService.load();

  constructor() {
    super();
    this.$agent = LocalStorage.getItem('edit') ?? this.$agents[0]?.id ?? '';
    this.$graph = this.$agent ? new Graph(this.$agent) : null;
    this.$graph?.sync(this);
  }

  write(key: keyof AgentEditorState, value: unknown) {
    super.write(key, value);

    if (key === '$agent') {
      if (!value) {
        this.$name = '';
        this.$graph = null;
      } else {
        this.$graph = new Graph(this.$agent);
        this.$graph?.sync(this);
      }

      LocalStorage.setItem('edit', this.$agent);
    }
  }

  onAddNew = () => {
    const id = agentService.create(this.$name);
    this.$agents = agentService.load();
    this.$agent = id;
  };

  onRename = () => {
    if (this.$renaming && this.$graph) {
      this.$graph.$name = this.$name;
      this.$graph.persist();
      this.$name = '';
      this.$renaming = false;
      this.$agents = agentService.load();
    } else {
      this.$name =
        this.$agents.find((item) => item.id === this.$agent)?.name ?? '';
      this.$renaming = !this.$renaming;
    }
  };

  onDeleteAgent = () => {
    agentService.delete(this.$agent);
    this.$agents = agentService.load();
    this.$agent = this.$agents[0]?.id ?? '';
  };

  onClone = async () => {
    if (this.$graph) {
      const template = this.$agents.find((item) => item.id === this.$agent)!;
      const id = agentService.append({
        ...template,
        name: `${template.name} (clone)`,
      });
      this.$agents = agentService.load();
      this.$agent = id;
    }
  };

  onCopy = async () => {
    if (this.$graph) {
      this.$exported = true;
      await navigator.clipboard.writeText(this.$graph.toJSON());
      setTimeout(() => {
        this.$exported = false;
      }, 1500);
    }
  };

  onPasteJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const template = Graph.fromJSON(event.currentTarget.value);
    if (template) {
      const id = agentService.append(template);
      this.$agents = agentService.load();
      this.$agent = id;
    } else {
      event.preventDefault();
    }
  };
}
