import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { FolderTree } from './FolderTree';
import { useAsync } from '../hooks/useAsync';
import { getFolderTree } from '../api/folders';
import { createDocument } from '../api/documents';

/**
 * Fluxo rápido: usuário escolhe campanha/pasta via árvore, o tipo já vem
 * pré-selecionado como "personagem" e o conteúdo inicial é o título em H1.
 */
export function QuickCharacterModal({ open, onClose, onCreated }) {
  const { data: tree, loading } = useAsync(getFolderTree, []);
  const [title, setTitle] = useState('');
  const [folderId, setFolderId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setFolderId(null);
      setSaving(false);
      setError(null);
    }
  }, [open]);

  const submit = async () => {
    const clean = title.trim();
    if (!clean || !folderId) return;
    setSaving(true);
    setError(null);
    try {
      await createDocument({
        title: clean,
        folder_id: folderId,
        type: 'personagem',
        content: `# ${clean}\n\n`,
      });
      onCreated?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const canSubmit = !!title.trim() && !!folderId && !saving;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Personagem rápido"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={submit} disabled={!canSubmit}>
            {saving ? 'Criando…' : 'Criar personagem'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Nome do personagem"
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && canSubmit && submit()}
          placeholder="Ex: Kael, o Bardo"
        />

        <div>
          <span className="bx-label">Onde ele entra?</span>
          <div className="bx-bold bg-[var(--bone)] p-2 max-h-56 overflow-y-auto">
            {loading ? (
              <p className="bx-meta p-2 opacity-60">Carregando…</p>
            ) : tree?.length ? (
              <FolderTree nodes={tree} value={folderId} onChange={setFolderId} />
            ) : (
              <p className="bx-meta p-2 opacity-60">
                Nenhuma campanha ainda. Crie uma primeiro na tela inicial.
              </p>
            )}
          </div>
        </div>

        {error && <p className="bx-meta text-[var(--brick)]">{error}</p>}

        <p className="bx-meta opacity-60">
          Tipo pré-selecionado: <strong>personagem</strong>. Você pode mudar
          depois, na tela do documento.
        </p>
      </div>
    </Modal>
  );
}
