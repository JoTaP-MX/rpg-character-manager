import { useCallback, useEffect, useState } from 'react';

/**
 * Executa uma função assíncrona e devolve { data, loading, error, reload, setData }.
 * Reexecuta quando qualquer item do array `deps` muda.
 *
 * Uso:
 *   const { data, loading, reload } = useAsync(() => listFolders(), []);
 */
export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.resolve()
      .then(() => run())
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [run, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { data, loading, error, reload, setData };
}
