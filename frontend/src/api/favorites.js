import { delay } from './client';
import { store } from './_store';

// GET /api/favorites → planned (mock)
export async function listFavorites() {
  await delay();
  return store.documents
    .filter((d) => store.favorites.includes(d.id))
    .map(({ content, ...rest }) => rest);
}

// POST /api/documents/{id}/favorite → planned (mock)
export async function favoriteDocument(documentId) {
  await delay();
  if (!store.favorites.includes(documentId)) store.favorites.push(documentId);
  return { ok: true };
}

// DELETE /api/documents/{id}/favorite → planned (mock)
export async function unfavoriteDocument(documentId) {
  await delay();
  store.favorites = store.favorites.filter((id) => id !== documentId);
  return null;
}
