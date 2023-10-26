import { useEffect, useMemo } from 'react';

import './simulation.css';

import { LocalStorage } from '../shared/local-storage';
import { ReactiveState, useReactiveState } from '../shared/use-reactive-state';
import { agentService } from './agents';
import { Game } from './game';

class SimulationState extends ReactiveState {
  $game?: Game;
  $running = false;
  $pristine = true;
}

export function Simulation(props: {
  switchScreen: () => void;
  openHelp: () => void;
}) {
  const { switchScreen, openHelp } = props;

  const agents = useMemo(() => agentService.load(), []);
  const state = useReactiveState(() => new SimulationState());

  function inputProps(name: string, defaultValue?: number) {
    return {
      id: name,
      name: name,
      defaultValue: LocalStorage.getItem(name) ?? defaultValue ?? undefined,
      onChange: (
        event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
      ) => {
        LocalStorage.setItem(name, event.currentTarget.value);
        state.$pristine = false;
      },
    };
  }

  function setup() {
    if (state.$game) {
      state.$game.stop();
    }

    const form = new FormData(
      document.querySelector('.arena-container form') as HTMLFormElement,
    );

    state.$pristine = true;
    state.$running = false;
    state.$game = new Game({
      setRunning: (value: boolean) => {
        state.$running = value;
      },
      fps: Number(form.get('fps')),
      rows: Number(form.get('rows')),
      placement: String(form.get('placement')),
      agentDensity: Number(form.get('agentDensity')),
      goldDensity: Number(form.get('goldDensity')),
      maxCarries: Number(form.get('maxCarries')),
      maxRuns: Number(form.get('maxRuns')),
      agents: [form.get('red') as string, form.get('blue') as string],
    });
  }

  function onSetup(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setup();
  }

  function onStartStop() {
    if (state.$running) {
      state.$game!.stop();
    } else {
      state.$game!.start();
    }
  }

  useEffect(setup, [state]);

  return (
    <div className="arena-container">
      <div className="score">
        <form className="controls" onSubmit={onSetup}>
          <label htmlFor="red">
            <div>Red agent</div>
            <select {...inputProps('red')} data-readonly={state.$running}>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="blue">
            <div>Blue agent</div>
            <select {...inputProps('blue')} data-readonly={state.$running}>
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
              data-readonly={state.$running}
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
              readOnly={state.$running}
              type="number"
              required
              style={{ width: 55 }}
            />
          </label>
          <label htmlFor="agentDensity">
            <div>Agent %</div>
            <input
              {...inputProps('agentDensity', 10)}
              readOnly={state.$running}
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
              readOnly={state.$running}
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
              readOnly={state.$running}
              type="number"
              required
              style={{ width: 75 }}
            />
          </label>
          <label htmlFor="fps">
            <div>FPS</div>
            <input
              {...inputProps('fps', 20)}
              readOnly={state.$running}
              type="number"
              required
              style={{ width: 60 }}
            />
          </label>
          <label htmlFor="maxRuns">
            <div>Max runs</div>
            <input
              {...inputProps('maxRuns', 1000)}
              readOnly={state.$running}
              type="number"
              required
              style={{ width: 70 }}
            />
          </label>
          <button type="submit">{state.$pristine ? 'Reset' : 'Setup'}</button>
          <button
            type="button"
            onClick={onStartStop}
            disabled={!state.$game || !state.$pristine}
          >
            {state.$running ? 'Stop' : 'Start'}
          </button>
        </form>
        <div className="stats">
          <span>0 / 0</span>
          <div className="scorecards">
            <span className="red">0</span>
            <span className="gold">0</span>
            <span className="blue">0</span>
          </div>
          <button
            type="button"
            className="switch-screen"
            onClick={() => {
              state.$game?.stop();
              switchScreen();
            }}
          >
            Go to editor
          </button>
          <button type="button" className="info" onClick={openHelp}>
            ?
          </button>
        </div>
      </div>
      <canvas id="arena" />
    </div>
  );
}
