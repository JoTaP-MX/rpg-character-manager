// Perfil local único — não existe login multiusuário.
// Endpoints "planned" → mock em _store.js.
import { delay } from './client';
import { store } from './_store';

// GET /api/me → planned (mock)
export async function getProfile() {
  await delay();
  return { ...store.profile };
}

// PATCH /api/me → planned (mock)
export async function updateProfile(patch) {
  await delay();
  store.profile = {
    ...store.profile,
    ...patch,
    updated_at: new Date().toISOString(),
  };
  return { ...store.profile };
}

// POST /api/me/avatar → planned (mock)
export async function uploadAvatar(file) {
  await delay();
  if (!file) throw new Error('Arquivo inválido.');
  if (!file.type.startsWith('image/')) {
    throw new Error('A foto de perfil precisa ser uma imagem.');
  }
  // Revoga avatar anterior, se houver, para não vazar blob URLs.
  if (store.profile.avatar_url?.startsWith('blob:')) {
    URL.revokeObjectURL(store.profile.avatar_url);
  }
  store.profile = {
    ...store.profile,
    avatar_url: URL.createObjectURL(file),
    updated_at: new Date().toISOString(),
  };
  return { ...store.profile };
}
