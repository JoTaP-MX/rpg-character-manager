import { http } from './client';

// GET /api/documents → implemented
export async function listDocuments({ folder_id } = {}) {
  const url = folder_id === undefined
    ? '/api/documents'
    : `/api/documents?folder_id=${folder_id}`;
  return http.get(url);
}

// POST /api/documents → implemented
export async function createDocument({ title, folder_id, type = 'documento', content = '' }) {
  return http.post('/api/documents', { title, folder_id, type, content });
}

// GET /api/documents/{id} → implemented
export async function getDocument(id) {
  return http.get(`/api/documents/${id}`);
}

// PATCH /api/documents/{id} → implemented
export async function updateDocument(id, patch) {
  return http.patch(`/api/documents/${id}`, patch);
}

// DELETE /api/documents/{id} → implemented (soft delete)
export async function deleteDocument(id) {
  return http.delete(`/api/documents/${id}`);
}

// Extra: baixa o Markdown do documento real como arquivo .md
export async function exportDocument(id) {
  const doc = await getDocument(id);
  const blob = new Blob([doc.content || ''], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.title || id}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
