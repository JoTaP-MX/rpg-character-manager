const now = '2026-09-24T12:00:00.000Z';

export const store = {
  folders: [
    { id: 1, name: 'A Maldição de Strahd', parent_id: null, created_at: now, updated_at: now },
    { id: 2, name: 'Personagens', parent_id: 1, created_at: now, updated_at: now },
    { id: 3, name: 'Locais', parent_id: 1, created_at: now, updated_at: now },
    { id: 4, name: 'Itens', parent_id: 1, created_at: now, updated_at: now },
    { id: 5, name: 'Lost Mine of Phandelver', parent_id: null, created_at: now, updated_at: now },
    { id: 6, name: 'NPCs', parent_id: 5, created_at: now, updated_at: now },
  ],
  documents: [
    {
      id: 1,
      title: 'Ireena Kolyana',
      type: 'personagem',
      folder_id: 2,
      content: '# Ireena Kolyana\n\nHerdeira de [[Barovia]] e foco da obsessão de Strahd.\n',
      created_at: now,
      updated_at: now,
    },
    {
      id: 2,
      title: 'Strahd von Zarovich',
      type: 'criatura',
      folder_id: 2,
      content: '# Strahd von Zarovich\n\nO lorde vampiro de [[Barovia]].\n',
      created_at: now,
      updated_at: now,
    },
    {
      id: 3,
      title: 'Barovia',
      type: 'local',
      folder_id: 3,
      content: '# Barovia\n\nVale enevoado, prisão de [[Ireena Kolyana]].\n',
      created_at: now,
      updated_at: now,
    },
    {
      id: 4,
      title: 'Espada do Sol',
      type: 'item',
      folder_id: 4,
      content: '# Espada do Sol\n\nRelíquia contra [[Strahd von Zarovich]].\n',
      created_at: now,
      updated_at: now,
    },
    {
      id: 5,
      title: 'Gundren Rockseeker',
      type: 'personagem',
      folder_id: 6,
      content: '# Gundren Rockseeker\n\nAnão que contrata o grupo em Phandalin.\n',
      created_at: now,
      updated_at: now,
    },
  ],
  tags: [
    { name: 'vampiro', usage_count: 2 },
    { name: 'barovia', usage_count: 3 },
  ],
  favorites: [1, 4],
  trash: [
    { kind: 'document', id: 99, name: 'Rascunho abandonado' },
    { kind: 'folder', id: 98, name: 'Sessão cancelada' },
  ],
  profile: {
    display_name: 'Mestre',
    avatar_url: null,
    updated_at: now,
  },
  settings: {
    theme: 'system',
    locale: 'pt-BR',
    updated_at: now,
  },
};

export function folderChildren(folderId) {
  return store.folders.filter((f) => f.parent_id === folderId);
}

export function buildTree(parentId = null) {
  return folderChildren(parentId).map((folder) => ({
    ...folder,
    children: buildTree(folder.id),
  }));
}
