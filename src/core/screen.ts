import type { Agent, AgentExtractor, Cell, Team } from '../types';

const colors = {
  red: {
    dark: '#ab212f',
    light: '#e16571',
  },
  blue: {
    dark: '#212FAB',
    light: '#6571e1',
  },
};

export class Screen {
  private cell = 0;
  canvas: HTMLCanvasElement;

  constructor(
    private rows: number,
    private columns: number,
  ) {
    this.canvas = document.getElementById('arena') as HTMLCanvasElement;
  }

  ctx() {
    return this.canvas.getContext('2d')!;
  }

  initialize() {
    this.cell = (window.innerWidth - 48) / this.columns;

    this.canvas = document.getElementById('arena') as HTMLCanvasElement;
    this.canvas.height = window.devicePixelRatio * this.rows * this.cell;
    this.canvas.width = window.devicePixelRatio * this.columns * this.cell;
    this.canvas.style.height = `${this.rows * this.cell}px`;
    this.canvas.style.width = `${this.columns * this.cell}px`;

    this.ctx().scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  renderGrid() {
    const ctx = this.ctx();

    ctx.strokeStyle = '#CCC';
    ctx.lineWidth = 1;

    for (let i = 1; i < this.rows; i += 1) {
      ctx.beginPath();
      ctx.moveTo(0, this.cell * i);
      ctx.lineTo(this.canvas.width, this.cell * i);
      ctx.stroke();
    }

    for (let i = 1; i < this.columns; i += 1) {
      ctx.beginPath();
      ctx.moveTo(this.cell * i, 0);
      ctx.lineTo(this.cell * i, this.canvas.height);
      ctx.stroke();
    }
  }

  renderTerminal(x: number, y: number, team: Team) {
    const ctx = this.ctx();

    ctx.fillStyle = `${
      team === 'red' ? colors.red.light : colors.blue.light
    }40`;
    ctx.beginPath();
    ctx.moveTo(this.cell * x, this.cell * y);
    ctx.lineTo(this.cell * (x + 1), this.cell * y);
    ctx.lineTo(this.cell * (x + 1), this.cell * (y + 1));
    ctx.lineTo(this.cell * x, this.cell * (y + 1));
    ctx.lineTo(this.cell * x, this.cell * y);
    ctx.fill();
  }

  renderAgent(x: number, y: number, agent: Agent) {
    const ctx = this.ctx();

    const radius = this.cell * 0.3;
    const [cx, cy] = [
      x * this.cell + this.cell / 2,
      y * this.cell + this.cell / 2,
    ];

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = colors[agent.team].light;
    ctx.fill();

    const start = -Math.PI / 2 + agent.position.d * (Math.PI / 2);

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = this.cell / 15;
    ctx.arc(cx, cy, radius, start, start + Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = colors[agent.team].light;
    ctx.lineWidth = this.cell / 15;
    ctx.arc(cx, cy, radius, start + Math.PI, start + Math.PI * 2);
    ctx.stroke();
  }

  renderNugget(x: number, y: number) {
    const ctx = this.ctx();

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.fillStyle = '#DB5';
    ctx.lineWidth = this.cell / 25;
    ctx.arc(
      x * this.cell + this.cell / 2,
      y * this.cell + this.cell / 2,
      this.cell * 0.2,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.fill();
  }

  render(arena: Cell[][], getAgent: AgentExtractor) {
    const ctx = this.ctx();

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderGrid();

    for (let x = 0; x < arena.length; x += 1) {
      for (let y = 0; y < arena[x].length; y += 1) {
        const item = arena[x][y];
        if (item.terminal) {
          this.renderTerminal(x, y, item.terminal);
        }

        if (item.agentId != null) {
          this.renderAgent(x, y, getAgent(x, y)!);
        }

        if (item.nuggetId != null) {
          this.renderNugget(x, y);
        }
      }
    }
  }
}
