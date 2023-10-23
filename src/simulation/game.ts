import type {
  Cell,
  Processor,
  Team,
  Agent,
  GoldNugget,
  Position,
} from '../types';
import { agentService } from './agents';
import * as placement from './placement';
import { actionProcessor } from './processors/action';
import { carryingProcessor } from './processors/carrying';
import { reasoningProcessor } from './processors/reasoning';
import { Screen } from './screen';

export class Game {
  private interval?: number;
  private fps: number;
  private maxRuns: number;
  private placement: keyof typeof placement;
  runs = 0;
  maxCarries: number;

  setRunning: (value: boolean) => void;

  rows: number;
  columns: number;
  score = {
    red: 0,
    blue: 0,
  };

  screen: Screen;
  arena: Cell[][];

  numAgents: number;
  numNuggets: number;
  agentCursor = 0;
  nuggetCursor = 0;

  agents: Agent[];
  nuggets: GoldNugget[];

  processors: Processor[] = [
    carryingProcessor,
    reasoningProcessor,
    actionProcessor,
  ];

  constructor(config: {
    setRunning: (value: boolean) => void;
    rows: number;
    agentDensity: number;
    goldDensity: number;
    maxRuns: number;
    maxCarries: number;
    agents: [string, string];
    placement: string;
    fps: number;
  }) {
    this.setRunning = config.setRunning;
    this.placement = config.placement as keyof typeof placement;
    this.fps = config.fps;
    this.maxRuns = config.maxRuns;
    this.maxCarries = config.maxCarries;
    this.rows = config.rows;
    this.columns = Math.round(
      (window.innerWidth / (window.innerHeight - 100)) * this.rows,
    );

    this.arena = Array(this.columns)
      .fill(null)
      .map(() =>
        Array(this.columns)
          .fill(null)
          .map((_r, y) => ({
            agentId: undefined,
            nuggetId: undefined,
            terminal:
              y === 0 ? 'red' : y === this.rows - 1 ? 'blue' : undefined,
          })),
      );

    this.screen = new Screen(this.rows, this.columns);
    this.numAgents = Math.floor(
      (this.rows * this.columns * config.agentDensity) / 100,
    );
    this.numNuggets = Math.floor(
      (this.rows * this.columns * config.goldDensity) / 100,
    );

    this.agents = Array(this.numAgents);
    this.nuggets = Array(this.numNuggets);

    this.addAgents(...config.agents);

    this.initialize();
  }

  private isNotEmpty(position: Position) {
    return (
      this.arena[position.x][position.y].agentId != null ||
      this.arena[position.x][position.y].nuggetId != null ||
      this.arena[position.x][position.y].terminal != null
    );
  }

  addGoldNugget() {
    const randPosition = () => ({
      x: Math.floor(Math.random() * this.columns),
      y: Math.floor(Math.random() * (this.rows - 2)) + 1,
      d: 0,
    });

    let position = null;

    do {
      position = randPosition();
    } while (this.isNotEmpty(position));

    this.arena[position.x][position.y].nuggetId = this.nuggetCursor;
    this.nuggets[this.nuggetCursor] = {
      id: this.nuggetCursor,
      position: position,
    };

    this.nuggetCursor += 1;
  }

  private addAgent(agentId: string, team: Team) {
    const template = agentService.parse(agentId)!;

    const randPosition = () => ({
      ...placement[this.placement](this.rows, this.columns, team),
      d: Math.floor(Math.random() * 4),
    });

    let position = null;

    do {
      position = randPosition();
    } while (this.isNotEmpty(position));

    this.arena[position.x][position.y].agentId = this.agentCursor;
    this.agents[this.agentCursor] = {
      id: this.agentCursor,
      class: template.name,
      team: team,
      decisionTree: template.tree,
      trunk: null,
      action: null,
      position: position,
    };

    this.agentCursor += 1;
  }

  get done() {
    return (
      this.runs >= this.maxRuns ||
      this.numNuggets < Math.abs(this.score.red - this.score.blue)
    );
  }

  addAgents(red: string, blue: string) {
    for (let i = 0; i < this.numAgents / 2; i += 1) {
      this.addAgent(red, 'red');
      this.addAgent(blue, 'blue');
    }
  }

  getAgent = (x: number, y: number) => {
    const cell = this.arena[x][y];
    if (cell.agentId != null) {
      return this.agents[cell.agentId];
    }

    return null;
  };

  getArenaPosition = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= this.columns || y >= this.rows) {
      return null;
    }

    return this.arena[x][y];
  };

  initialize() {
    for (let i = 0; i < this.numNuggets; i += 1) {
      this.addGoldNugget();
    }

    this.screen.initialize();
    this.screen.render(this.arena, this.getAgent);
    this.compileStats();
  }

  compileStats() {
    document.querySelector(
      '.stats > span',
    )!.textContent = `${this.runs} / ${this.maxRuns}`;

    document.querySelector('.scorecards .red')!.textContent = String(
      this.score.red,
    );

    document.querySelector('.scorecards .gold')!.textContent = String(
      this.numNuggets,
    );

    document.querySelector('.scorecards .blue')!.textContent = String(
      this.score.blue,
    );

    if (this.score.red === this.score.blue) {
      document.querySelector('.scorecards .red')!.classList.remove('winner');
      document.querySelector('.scorecards .blue')!.classList.remove('winner');
    }

    if (this.score.red > this.score.blue) {
      document.querySelector('.scorecards .red')!.classList.add('winner');
      document.querySelector('.scorecards .blue')!.classList.remove('winner');
    }

    if (this.score.red < this.score.blue) {
      document.querySelector('.scorecards .blue')!.classList.add('winner');
      document.querySelector('.scorecards .red')!.classList.remove('winner');
    }
  }

  start() {
    if (this.done) {
      return;
    }

    this.setRunning(true);
    this.turn();

    this.interval = setInterval(() => {
      if (this.done) {
        this.stop();
      } else {
        this.turn();
      }
    }, 1000 / this.fps);
  }

  stop() {
    this.setRunning(false);
    clearInterval(this.interval);
    this.interval = undefined;
  }

  turn() {
    this.runs += 1;

    for (const processor of this.processors) {
      processor(this);
    }

    this.screen.render(this.arena, this.getAgent);
    this.compileStats();
  }
}
