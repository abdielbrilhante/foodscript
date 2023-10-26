import { useMemo, useRef, useState } from 'react';

export class ReactiveState {
  private data: Record<string, unknown> = {};
  private writers = 0;
  private rerender = () => {};

  watch(rerender: () => void) {
    this.rerender = rerender;
    for (const key of Object.keys(this)) {
      if (key.startsWith('$')) {
        this.data[key] = this[key as keyof typeof this];
        Object.defineProperty(this, key, {
          get: () => this.data[key],
          set: (value: unknown) => {
            this.write(key, value);
          },
        });
      }
    }
  }

  sync(parent: ReactiveState) {
    this.watch(() => parent.rerender());
  }

  write(key: string, value: unknown) {
    this.data[key] = value;
    this.commit();
  }

  commit() {
    this.writers += 1;
    queueMicrotask(() => {
      this.writers -= 1;
      if (this.writers === 0) {
        this.rerender();
      }
    });
  }
}

export function useReactiveState<State extends ReactiveState>(
  createState: () => State,
  deps?: unknown[],
) {
  const [, rerender] = useState(Symbol);
  const creator = useRef(createState);
  creator.current = createState;

  const stable = useRef(deps);
  if (
    deps !== stable.current &&
    deps != null &&
    stable.current != null &&
    (deps.length !== stable.current.length ||
      deps.some((dep, index) => dep !== stable.current![index]))
  ) {
    stable.current = deps;
  }

  return useMemo(() => {
    const state = creator.current();
    state.watch(() => rerender(Symbol()));
    return state;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stable.current]);
}
