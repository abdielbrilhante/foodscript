import { useMemo, useRef } from 'react';

export function useMouseMove() {
  const mouseMoveHandler = useRef<((event: MouseEvent) => void) | null>(null);
  return useMemo(
    () => ({
      watch(callback: (event: MouseEvent) => void) {
        if (mouseMoveHandler.current) {
          document.removeEventListener('mousemove', mouseMoveHandler.current);
        }

        mouseMoveHandler.current = callback;
        document.addEventListener('mousemove', mouseMoveHandler.current);
      },
      unwatch() {
        if (mouseMoveHandler.current) {
          document.removeEventListener('mousemove', mouseMoveHandler.current);
        }
      },
    }),
    [],
  );
}
