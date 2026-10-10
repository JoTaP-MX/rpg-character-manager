import { delay } from './client';
import { store } from './_store';

// GET /api/search?q= → planned (mock)
export async function search(q) {
  await delay();
  const needle = String(q || '').trim().toLowerCase();
  if (!needle) return [];
  return store.documents
    .filter((d) => {
      const title = (d.title || '').toLowerCase();
      const content = (d.content || '').toLowerCase();
      return title.includes(needle) || content.includes(needle);
    })
    .map(({ content, ...rest }) => rest);
}
