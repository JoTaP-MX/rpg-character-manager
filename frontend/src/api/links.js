// Fase 2 do roadmap — hyperlinks [[Nome]] entre documentos.
// Endpoints ainda "planned" no openapi.yml → camada de mock aqui.
import { delay } from './client';
import { store } from './_store';

// GET /api/documents/{id}/links → planned (mock)
// Extrai todos os [[Nome]] do conteúdo e casa com títulos existentes.
export async function getDocumentLinks(documentId) {
  await delay();
  const doc = store.documents.find((d) => d.id === documentId);
  if (!doc) return [];
  const matches = [...(doc.content || '').matchAll(/\[\[([^\]]+)\]\]/g)]
    .map((m) => m[1].trim());
  if (!matches.length) return [];
  return store.documents
    .filter((d) => d.id !== documentId && matches.includes(d.title))
    .map(({ content, ...rest }) => rest);
}

// GET /api/documents/{id}/backlinks → planned (mock)
// Documentos cujo conteúdo contém [[Título deste documento]].
export async function getDocumentBacklinks(documentId) {
  await delay();
  const doc = store.documents.find((d) => d.id === documentId);
  if (!doc) return [];
  const needle = `[[${doc.title}]]`;
  return store.documents
    .filter((d) => d.id !== documentId && (d.content || '').includes(needle))
    .map(({ content, ...rest }) => rest);
}
