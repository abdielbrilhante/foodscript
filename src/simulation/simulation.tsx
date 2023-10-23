import { useEffect, useMemo, useState } from 'react';

import './simulation.css';

import { LocalStorage } from '../shared/local-storage';
import { agentService } from './agents';
import { Game } from './game';

export function Simulation(props: { switchScreen: () => void }) {
  const { switchScreen } = props;

  const agents = useMemo(() => agentService.load(), []);

  const [game, setGame] = useState<Game>();
  const [running, setRunning] = useState(false);
  const [pristine, setPristine] = useState(true);

  function inputProps(name: string, defaultValue?: number) {
    return {
      id: name,
      name: name,
      defaultValue: LocalStorage.getItem(name) ?? defaultValue ?? undefined,
      onChange: (
        event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
      ) => {
        LocalStorage.setItem(name, event.currentTarget.value);
        setPristine(false);
      },
    };
  }

  function setup() {
    setGame((current) => {
      setPristine(true);
      const form = new FormData(
        document.querySelector('.arena-container form') as HTMLFormElement,
      );

      if (current) {
        current.stop();
      }

      setRunning(false);

      return new Game({
        setRunning: setRunning,
        fps: Number(form.get('fps')),
        rows: Number(form.get('rows')),
        placement: String(form.get('placement')),
        agentDensity: Number(form.get('agentDensity')),
        goldDensity: Number(form.get('goldDensity')),
        maxCarries: Number(form.get('maxCarries')),
        maxRuns: Number(form.get('maxRuns')),
        agents: [form.get('red') as string, form.get('blue') as string],
      });
    });
  }

  function onSetup(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setup();
  }

  function onStartStop() {
    if (running) {
      game!.stop();
    } else {
      game!.start();
    }
  }

  useEffect(setup, []);

  return (
    <div className="arena-container">
      <div className="score">
        <form className="controls" onSubmit={onSetup}>
          <label htmlFor="red">
            <div>Red agent</div>
            <select {...inputProps('red')} data-readonly={running}>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="blue">
            <div>Blue agent</div>
            <select {...inputProps('blue')} data-readonly={running}>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="placement">
            <div>Placement</div>
            <select
              {...inputProps('placement')}
              required
              data-readonly={running}
            >
              <option value="mixed">Random (mixed)</option>
              <option value="splitY">Y-wise split</option>
              <option value="reverseSplitY">Y-wise split (reverse)</option>
              <option value="splitX">X-wise split</option>
            </select>
          </label>
          <label htmlFor="rows">
            <div>Rows</div>
            <input
              {...inputProps('rows', 30)}
              readOnly={running}
              type="number"
              required
              style={{ width: 55 }}
            />
          </label>
          <label htmlFor="agentDensity">
            <div>Agent %</div>
            <input
              {...inputProps('agentDensity', 10)}
              readOnly={running}
              type="number"
              required
              max={40}
              style={{ width: 55 }}
            />
          </label>
          <label htmlFor="goldDensity">
            <div>Gold %</div>
            <input
              {...inputProps('goldDensity', 30)}
              readOnly={running}
              type="number"
              required
              max={60}
              style={{ width: 55 }}
            />
          </label>
          <label htmlFor="maxCarries">
            <div>Max carries</div>
            <input
              {...inputProps('maxCarries', 30)}
              readOnly={running}
              type="number"
              required
              style={{ width: 75 }}
            />
          </label>
          <label htmlFor="fps">
            <div>FPS</div>
            <input
              {...inputProps('fps', 20)}
              readOnly={running}
              type="number"
              required
              style={{ width: 60 }}
            />
          </label>
          <label htmlFor="maxRuns">
            <div>Max runs</div>
            <input
              {...inputProps('maxRuns', 1000)}
              readOnly={running}
              type="number"
              required
              style={{ width: 70 }}
            />
          </label>
          <button type="submit">{pristine ? 'Reset' : 'Setup'}</button>
          <button
            type="button"
            onClick={onStartStop}
            disabled={!game || !pristine}
          >
            {running ? 'Stop' : 'Start'}
          </button>
        </form>
        <div className="stats">
          <span>0 / 0</span>
          <div className="scorecards">
            <span className="red">0</span>
            <span className="gold">0</span>
            <span className="blue">0</span>
          </div>
          <button className="switch-screen" onClick={switchScreen}>
            Go to editor
          </button>
        </div>
      </div>
      <canvas id="arena" />
    </div>
  );
}
