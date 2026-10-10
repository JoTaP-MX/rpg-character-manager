import { delay } from './client';
import { store } from './_store';

// GET /api/tags → planned (mock)
export async function listTags() {
  await delay();
  return store.tags;
}

// POST /api/documents/{id}/tags → planned (mock)
export async function addDocumentTag(documentId, tag) {
  await delay();
  const clean = String(tag || '').trim();
  if (!clean) throw new Error('Tag vazia.');
  const existing = store.tags.find((t) => t.name === clean);
  if (existing) existing.usage_count += 1;
  else store.tags.push({ name: clean, usage_count: 1 });
  return { ok: true };
}

// DELETE /api/documents/{id}/tags/{tag} → planned (mock)
export async function removeDocumentTag(documentId, tag) {
  await delay();
  const idx = store.tags.findIndex((t) => t.name === tag);
  if (idx >= 0) {
    store.tags[idx].usage_count -= 1;
    if (store.tags[idx].usage_count <= 0) store.tags.splice(idx, 1);
  }
  return null;
}
