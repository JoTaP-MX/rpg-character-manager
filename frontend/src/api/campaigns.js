import { delay } from './client';
import { store, folderChildren } from './_store';

// GET /api/campaigns → planned (mock)
// Alias conceitual de GET /api/folders sem parent_id.
export async function listCampaigns() {
  await delay();
  return store.folders.filter((f) => f.parent_id == null);
}

// POST /api/campaigns → planned (mock)
export async function createCampaign({ name }) {
  await delay();
  const folder = {
    id: Date.now(),
    name,
    parent_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  store.folders.push(folder);
  return folder;
}

// Extra (mock): estatísticas de uma campanha a partir da store.
export async function getCampaignStats(campaignId) {
  await delay(80);
  const childFolders = folderChildren(campaignId).length;
  const docs = store.documents.filter((d) => d.folder_id === campaignId).length;
  return { childFolders, docs };
}
