// Upload/gerenciamento de imagens. Endpoints "planned" → mock em memória.
// O upload mock devolve um blob URL local, válido apenas na sessão atual.
import { delay } from './client';

const buckets = new Map(); // documentId -> Asset[]

function bucket(documentId) {
  if (!buckets.has(documentId)) buckets.set(documentId, []);
  return buckets.get(documentId);
}

// GET /api/documents/{id}/assets → planned (mock)
export async function listDocumentAssets(documentId) {
  await delay();
  return [...bucket(documentId)];
}

// POST /api/documents/{id}/assets → planned (mock)
export async function uploadDocumentAsset(documentId, file) {
  await delay();
  if (!file) throw new Error('Arquivo inválido.');
  if (!file.type.startsWith('image/')) {
    throw new Error('Só imagens são aceitas (png, jpg, gif, webp…).');
  }
  const asset = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    document_id: documentId,
    filename: file.name,
    url: URL.createObjectURL(file),
    mime_type: file.type,
    size_bytes: file.size,
    created_at: new Date().toISOString(),
  };
  bucket(documentId).push(asset);
  return asset;
}

// GET /api/assets/{id} → planned (mock) — só devolve o registro do bucket
export async function getAsset(assetId) {
  await delay();
  for (const list of buckets.values()) {
    const found = list.find((a) => a.id === assetId);
    if (found) return found;
  }
  throw new Error('Asset não encontrado.');
}

// DELETE /api/assets/{id} → planned (mock)
export async function deleteAsset(assetId) {
  await delay();
  for (const list of buckets.values()) {
    const idx = list.findIndex((a) => a.id === assetId);
    if (idx >= 0) {
      URL.revokeObjectURL(list[idx].url);
      list.splice(idx, 1);
      return null;
    }
  }
  throw new Error('Asset não encontrado.');
}
