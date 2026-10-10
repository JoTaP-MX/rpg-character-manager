// Import/export completo da biblioteca. Endpoints "planned" → mock.
// O export real (zip) e o import real ainda não existem no backend,
// então aqui sinalizamos isso claramente em vez de fingir que funciona.
import { delay } from './client';
import { store } from './_store';

// GET /api/export → planned (mock: exporta um JSON simples da store)
export async function exportLibrary() {
  await delay();
  const payload = {
    exported_at: new Date().toISOString(),
    folders: store.folders,
    documents: store.documents,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `visual-codex-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// POST /api/import → planned (mock: não mescla de verdade na store)
export async function importLibrary(file) {
  await delay();
  if (!file) throw new Error('Nenhum arquivo enviado.');
  const text = await file.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Arquivo inválido — esperado um JSON de backup.');
  }
  return {
    folders_created: parsed.folders?.length ?? 0,
    documents_created: parsed.documents?.length ?? 0,
    _note: 'Import real ainda não implementado no backend; este é um contador mock.',
  };
}
