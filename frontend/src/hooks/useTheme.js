import { useCallback, useEffect, useState } from 'react';
import { updateSettings } from '../api/settings';

const STORAGE_KEY = 'visual-codex:theme';

function resolveTheme(theme) {
  if (theme !== 'system') return theme;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', resolveTheme(theme));
}

/**
 * Tema com três estados: 'light' | 'dark' | 'system'.
 * Persiste em localStorage e também tenta sincronizar com /api/settings
 * (endpoint ainda planejado — o mock engole silenciosamente).
 */
export function useTheme() {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'system'
  );

  // Aplica + persiste sempre que o tema muda.
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);

    if (theme !== 'system') return undefined;

    // Quando em "system", escuta mudanças do SO em tempo real.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback(async (next) => {
    setThemeState(next);
    try {
      await updateSettings({ theme: next });
    } catch {
      // endpoint planejado — falha silenciosa é aceitável aqui
    }
  }, []);

  return { theme, setTheme };
}
