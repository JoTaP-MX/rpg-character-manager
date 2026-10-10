import { http, delay } from './client';
import { store, folderChildren } from './_store';

// GET /api/folders → implemented
// Sem `parent_id` retorna as pastas raiz; com `parent_id` filtra por pai.
export async function listFolders({ parent_id } = {}) {
  const url = parent_id === undefined
    ? '/api/folders'
    : `/api/folders?parent_id=${parent_id ?? ''}`;
  return http.get(url);
}

// POST /api/folders → implemented
export async function createFolder({ name, parent_id = null }) {
  return http.post('/api/folders', { name, parent_id });
}

// GET /api/folders/{id} → implemented
export async function getFolder(id) {
  return http.get(`/api/folders/${id}`);
}

// PATCH /api/folders/{id} → implemented
export async function updateFolder(id, patch) {
  return http.patch(`/api/folders/${id}`, patch);
}

// DELETE /api/folders/{id} → implemented (soft delete)
export async function deleteFolder(id) {
  return http.delete(`/api/folders/${id}`);
}

// GET /api/folders/tree → monta a árvore chamando o endpoint REAL recursivamente.
//
// `rootId = null` (padrão) → árvore a partir das pastas raiz, comportamento
// usado pelo QuickCharacterModal.
// `rootId = <id>` → subárvore enraizada naquela pasta (excluindo-a, só os
// descendentes), usado pela seção "Subpastas" da CampaignView.
export async function getFolderTree(rootId = null) {
  async function loadChildren(parentId) {
    const folders = parentId === null
      ? await listFolders()
      : await listFolders({ parent_id: parentId });

    if (!folders?.length) return [];

    return Promise.all(
      folders.map(async (folder) => ({
        ...folder,
        children: await loadChildren(folder.id),
      }))
    );
  }

  return loadChildren(rootId);
}

// Extra (não é endpoint do openapi.yml): contagem auxiliar para gamificação.
// Continua mockada — ver observação no fim da resposta anterior.
export async function getFolderStats(folderId) {
  await delay(80);
  const childFolders = folderChildren(folderId).length;
  const docs = store.documents.filter((d) => d.folder_id === folderId).length;
  return { childFolders, docs };
}
