import { AgentEditor } from './decision-tree/agent-editor';
import { Help } from './help/help';
import { LocalStorage } from './shared/local-storage';
import { ReactiveState, useReactiveState } from './shared/use-reactive-state';
import { Simulation } from './simulation/simulation';

class AppState extends ReactiveState {
  $help = !LocalStorage.getItem('helpSeen');
  $screen: 'editor' | 'simulation' = (LocalStorage.getItem('screen') ||
    'simulation') as 'editor' | 'simulation';

  switchScreen = () => {
    this.$screen = this.$screen === 'editor' ? 'simulation' : 'editor';
    LocalStorage.setItem('screen', this.$screen);
  };

  openHelp = () => {
    this.$help = true;
  };

  closeHelp = () => {
    this.$help = false;
  };
}

export function App() {
  const state = useReactiveState(() => new AppState());

  return (
    <main>
      {state.$screen === 'editor' ? (
        <AgentEditor
          switchScreen={state.switchScreen}
          openHelp={state.openHelp}
        />
      ) : (
        <Simulation
          switchScreen={state.switchScreen}
          openHelp={state.openHelp}
        />
      )}

      {state.$help ? <Help close={state.closeHelp} /> : null}
    </main>
  );
}
