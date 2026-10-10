import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, FolderPlus, ArrowLeft } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { getFolder, getFolderTree, createFolder } from '../api/folders';
import { listDocuments, createDocument } from '../api/documents';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { FolderTree } from '../components/FolderTree';
import { DocumentCard } from '../components/DocumentCard';
import { EmptyState } from '../components/EmptyState';
import { SketchDivider } from '../components/SketchDivider';

export function CampaignView() {
  const { id } = useParams();
  const folderId = Number(id);

  const { data: folder } = useAsync(() => getFolder(folderId), [folderId]);

  // Árvore enraizada nesta campanha — só os descendentes, não a biblioteca toda.
  const { data: tree, reload: reloadTree } = useAsync(
    () => getFolderTree(folderId),
    [folderId]
  );

  const { data: docs, reload: reloadDocs } = useAsync(
    () => listDocuments({ folder_id: folderId }),
    [folderId]
  );

  const [showNewFolder, setShowNewFolder] = useState(false);
  const [showNewDoc, setShowNewDoc] = useState(false);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <Link to="/" className="bx-btn bx-btn-ghost mb-6 !text-[10px]">
        <ArrowLeft size={13} strokeWidth={2.6} /> Voltar
      </Link>

      <div className="mb-6">
        <p className="bx-meta opacity-60 mb-1">Campanha</p>
        <h1 className="bx-h1 text-5xl mb-3">{folder?.name ?? '…'}</h1>
        <SketchDivider />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="bx-label !mb-0">Subpastas</h2>
            <button
              onClick={() => setShowNewFolder(true)}
              className="bx-btn bx-btn-ghost !p-1 !text-[10px]"
              aria-label="Nova subpasta"
            >
              <FolderPlus size={13} strokeWidth={2.6} />
            </button>
          </div>

          <div className="bx-bold bg-[var(--bone)] p-2">
            {tree?.length ? (
              <FolderTree nodes={tree} value={folderId} onChange={() => {}} />
            ) : (
              <p className="bx-meta p-2 opacity-60">Sem subpastas</p>
            )}
          </div>
        </aside>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="bx-h2 text-2xl">Documentos</h2>
            <Button variant="primary" onClick={() => setShowNewDoc(true)}>
              <Plus size={14} strokeWidth={2.6} /> Novo documento
            </Button>
          </div>

          {docs?.length ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {docs.map((d) => (
                <DocumentCard key={d.id} doc={d} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="scroll"
              title="Pasta vazia"
              message="Que tal começar por um personagem icônico, um local amaldiçoado ou um item lendário?"
              action={
                <Button variant="primary" onClick={() => setShowNewDoc(true)}>
                  <Plus size={14} strokeWidth={2.6} /> Criar primeiro documento
                </Button>
              }
            />
          )}
        </section>
      </div>

      <NewFolderInline
        open={showNewFolder}
        parentId={folderId}
        onClose={() => setShowNewFolder(false)}
        onCreated={() => {
          setShowNewFolder(false);
          reloadTree();
        }}
      />
      <NewDocInline
        open={showNewDoc}
        folderId={folderId}
        onClose={() => setShowNewDoc(false)}
        onCreated={() => {
          setShowNewDoc(false);
          reloadDocs();
        }}
      />
    </div>
  );
}

function NewFolderInline({ open, parentId, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const clean = name.trim();
    if (!clean) return;
    setSaving(true);
    try {
      await createFolder({ name: clean, parent_id: parentId });
      setName('');
      onCreated?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova subpasta"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={submit}
            disabled={saving || !name.trim()}
          >
            Criar
          </Button>
        </>
      }
    >
      <Input
        label="Nome"
        value={name}
        autoFocus
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
    </Modal>
  );
}

function NewDocInline({ open, folderId, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('personagem');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const clean = title.trim();
    if (!clean) return;
    setSaving(true);
    try {
      await createDocument({
        title: clean,
        folder_id: folderId,
        type,
      });
      setTitle('');
      setType('personagem');
      onCreated?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo documento"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={submit}
            disabled={saving || !title.trim()}
          >
            Criar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Título"
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <Input
          label="Tipo"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="personagem, item, local, criatura…"
        />
      </div>
    </Modal>
  );
}
