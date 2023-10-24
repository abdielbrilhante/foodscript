import { useCallback, useState } from 'react';

import { AgentEditor } from './decision-tree/agent-editor';
import { Help } from './help/help';
import { LocalStorage } from './shared/local-storage';
import { Simulation } from './simulation/simulation';

export function App() {
  const [help, setHelp] = useState(() => !LocalStorage.getItem('helpSeen'));

  const [screen, setScreen] = useState<'editor' | 'simulation'>(
    (LocalStorage.getItem('screen') || 'simulation') as 'editor' | 'simulation',
  );

  const switchScreen = useCallback(() => {
    setScreen((current) => {
      const next = current === 'editor' ? 'simulation' : 'editor';
      LocalStorage.setItem('screen', next);
      return next;
    });
  }, []);

  const openHelp = useCallback(() => {
    setHelp(true);
  }, []);

  return (
    <main>
      {screen === 'editor' ? (
        <AgentEditor switchScreen={switchScreen} openHelp={openHelp} />
      ) : (
        <Simulation switchScreen={switchScreen} openHelp={openHelp} />
      )}

      {help ? <Help close={() => setHelp(false)} /> : null}
    </main>
  );
}
