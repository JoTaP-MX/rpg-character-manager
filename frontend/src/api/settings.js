// Preferências da aplicação (tema, idioma). Endpoints "planned" → mock.
import { delay } from './client';
import { store } from './_store';

// GET /api/settings → planned (mock)
export async function getSettings() {
  await delay();
  return { ...store.settings };
}

// PATCH /api/settings → planned (mock)
export async function updateSettings(patch) {
  await delay();
  store.settings = {
    ...store.settings,
    ...patch,
    updated_at: new Date().toISOString(),
  };
  return { ...store.settings };
}
