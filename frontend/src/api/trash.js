import { delay } from './client';
import { store } from './_store';

function withoutContent({ content, ...rest }) {
  return rest;
}

// GET /api/trash → planned (mock)
export async function listTrash() {
  await delay();
  return [...store.trash];
}

// POST /api/folders/{id}/restore → planned (mock)
export async function restoreFolder(id) {
  await delay();
  store.trash = store.trash.filter((item) => !(item.kind === 'folder' && item.id === id));
  return { ok: true };
}

// POST /api/documents/{id}/restore → planned (mock)
export async function restoreDocument(id) {
  await delay();
  store.trash = store.trash.filter((item) => !(item.kind === 'document' && item.id === id));
  return { ok: true };
}

// DELETE /api/folders/{id}/permanent → planned (mock)
export async function permanentlyDeleteFolder(id) {
  await delay();
  store.trash = store.trash.filter((item) => !(item.kind === 'folder' && item.id === id));
  store.folders = store.folders.filter((f) => f.id !== id);
  return null;
}

// DELETE /api/documents/{id}/permanent → planned (mock)
export async function permanentlyDeleteDocument(id) {
  await delay();
  store.trash = store.trash.filter((item) => !(item.kind === 'document' && item.id === id));
  store.documents = store.documents.filter((d) => d.id !== id);
  return null;
}

export { withoutContent };
