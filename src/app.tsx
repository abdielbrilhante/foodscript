import { useCallback, useState } from 'react';

import { AgentEditor } from './decision-tree/agent-editor';
import { Simulation } from './simulation/simulation';

export function App() {
  const [screen, setScreen] = useState<'editor' | 'simulation'>(
    (localStorage.getItem('adt__screen') || 'simulation') as
      | 'editor'
      | 'simulation',
  );

  const switchScreen = useCallback(() => {
    setScreen((current) => {
      const next = current === 'editor' ? 'simulation' : 'editor';
      localStorage.setItem('adt__screen', next);
      return next;
    });
  }, []);

  return (
    <main>
      {screen === 'editor' ? (
        <AgentEditor switchScreen={switchScreen} />
      ) : (
        <Simulation switchScreen={switchScreen} />
      )}
    </main>
  );
}
