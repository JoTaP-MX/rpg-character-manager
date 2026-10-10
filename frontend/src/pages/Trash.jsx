import { useState } from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import {
  listTrash,
  restoreFolder,
  restoreDocument,
  permanentlyDeleteFolder,
  permanentlyDeleteDocument,
} from '../api/trash';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { SketchDivider } from '../components/SketchDivider';

export function Trash() {
  const { data, loading, reload } = useAsync(listTrash, []);
  const [confirm, setConfirm] = useState(null);

  const doPurge = async () => {
    if (!confirm) return;
    try {
      if (confirm.kind === 'folder') await permanentlyDeleteFolder(confirm.id);
      else await permanentlyDeleteDocument(confirm.id);
    } finally {
      setConfirm(null);
      reload();
    }
  };

  const doRestore = async (item) => {
    try {
      if (item.kind === 'folder') await restoreFolder(item.id);
      else await restoreDocument(item.id);
    } finally {
      reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <h1 className="bx-h1 text-5xl mb-3">Lixeira</h1>
      <p className="opacity-75 mb-2">
        Itens excluídos ficam aqui até você restaurá-los ou apagá-los de vez.
      </p>
      <SketchDivider className="mb-6" />

      {loading ? (
        <p className="bx-meta opacity-60">Carregando…</p>
      ) : data?.length ? (
        <ul className="space-y-3">
          {data.map((item) => (
            <li
              key={`${item.kind}-${item.id}`}
              className="bx-card flex items-center gap-3 p-3 flex-wrap"
            >
              <span className="bx-chip">
                {item.kind === 'folder' ? 'Pasta' : 'Documento'}
              </span>
              <span className="flex-1 font-semibold truncate">{item.name}</span>
              <Button variant="ghost" onClick={() => doRestore(item)}>
                <RotateCcw size={13} strokeWidth={2.6} /> Restaurar
              </Button>
              <Button variant="danger" onClick={() => setConfirm(item)}>
                <Trash2 size={13} strokeWidth={2.6} />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon="ghost"
          title="Lixeira vazia"
          message="Nada foi excluído — continue criando sem medo."
        />
      )}

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Excluir definitivamente?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={doPurge}>
              Excluir para sempre
            </Button>
          </>
        }
      >
        <p>
          <strong>{confirm?.name}</strong> será removido do banco e do disco.
          Não dá para desfazer.
        </p>
      </Modal>
    </div>
  );
}
