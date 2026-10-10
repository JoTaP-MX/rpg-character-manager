import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  Save,
  Trash2,
  Eye,
  Pencil,
  Download,
  ImagePlus,
  Star,
} from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import {
  getDocument,
  updateDocument,
  deleteDocument,
  exportDocument,
} from '../api/documents';
import { listDocumentAssets, uploadDocumentAsset } from '../api/assets';
import { favoriteDocument, unfavoriteDocument } from '../api/favorites';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Textarea } from '../components/Input';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { cn } from '../lib/cn';

export function DocumentView() {
  const { id } = useParams();
  const docId = Number(id);
  const nav = useNavigate();

  const {
    data: doc,
    setData: setDoc,
    loading,
    error,
  } = useAsync(() => getDocument(docId), [docId]);

  const { data: assets, reload: reloadAssets } = useAsync(
    () => listDocumentAssets(docId),
    [docId]
  );

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('edit');
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (doc) {
      setTitle(doc.title);
      setContent(doc.content ?? '');
      setDirty(false);
    }
  }, [doc]);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await updateDocument(docId, { title, content });
      setDoc(updated);
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    await deleteDocument(docId);
    nav(`/campanha/${doc.folder_id}`);
  };

  const toggleFavorite = async () => {
    // Favoritos é endpoint planejado — o mock é em memória e não persiste
    // entre reloads. Otimista aqui para o botão dar feedback imediato.
    try {
      if (favorited) await unfavoriteDocument(docId);
      else await favoriteDocument(docId);
      setFavorited((f) => !f);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      await uploadDocumentAsset(docId, f);
      reloadAssets();
    } catch (err) {
      alert(err.message);
    }
    e.target.value = '';
  };

  if (loading) {
    return <p className="p-10 bx-meta opacity-60">Carregando…</p>;
  }

  if (error) {
    return (
      <EmptyState
        icon="ghost"
        title="Documento não encontrado"
        message={error.message}
        action={
          <Link to="/" className="bx-btn">
            Voltar ao início
          </Link>
        }
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <Link
          to={`/campanha/${doc.folder_id}`}
          className="bx-btn bx-btn-ghost !text-[10px]"
        >
          <ArrowLeft size={13} strokeWidth={2.6} /> Voltar
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            onClick={toggleFavorite}
            title={favorited ? 'Remover dos favoritos' : 'Favoritar'}
          >
            <Star
              size={14}
              strokeWidth={2.6}
              className={favorited ? 'fill-[var(--amber)]' : ''}
            />
          </Button>
          <Button
            variant="ghost"
            onClick={() => exportDocument(docId)}
            title="Exportar .md"
          >
            <Download size={14} strokeWidth={2.6} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setConfirmDelete(true)}
            title="Enviar para a lixeira"
          >
            <Trash2 size={14} strokeWidth={2.6} />
          </Button>
          <Button variant="primary" onClick={save} disabled={!dirty || saving}>
            <Save size={14} strokeWidth={2.6} />
            {saving ? 'Salvando…' : dirty ? 'Salvar' : 'Salvo'}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Badge type={doc.type} />
          <span className="bx-meta opacity-60">#{doc.id}</span>
        </div>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setDirty(true);
          }}
          className="w-full bg-transparent bx-h1 text-5xl outline-none border-b-[3px] border-transparent focus:border-[var(--ink)] pb-1"
          aria-label="Título do documento"
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex">
          <button
            onClick={() => setMode('edit')}
            className={cn('bx-btn !text-[10px]', mode === 'edit' && 'bx-btn-primary')}
          >
            <Pencil size={12} strokeWidth={2.6} /> Editar
          </button>
          <button
            onClick={() => setMode('preview')}
            className={cn(
              'bx-btn !text-[10px] !border-l-0',
              mode === 'preview' && 'bx-btn-primary'
            )}
          >
            <Eye size={12} strokeWidth={2.6} /> Prévia
          </button>
        </div>
        <p className="bx-meta opacity-50">
          Markdown · suporta [[Links]] no futuro
        </p>
      </div>

      {mode === 'edit' ? (
        <Textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setDirty(true);
          }}
          rows={22}
          className="!text-[13px]"
        />
      ) : (
        <article className="bx-card p-6 md-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || '*Sem conteúdo.*'}
          </ReactMarkdown>
        </article>
      )}

      <section className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="bx-label !mb-0">Imagens</h2>
          <Button
            variant="ghost"
            onClick={() => document.getElementById('asset-upload')?.click()}
          >
            <ImagePlus size={14} strokeWidth={2.6} /> Anexar
          </Button>
          <input
            id="asset-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {assets?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {assets.map((a) => (
              <div
                key={a.id}
                className="bx-bold aspect-square overflow-hidden bg-[var(--bone)]"
              >
                <img
                  src={a.url}
                  alt={a.filename}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bx-bold bg-[var(--bone)] p-6 text-center bx-meta opacity-60">
            Nenhuma imagem anexada ainda.
          </div>
        )}
      </section>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Enviar para a lixeira?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={remove}>
              Enviar para a lixeira
            </Button>
          </>
        }
      >
        <p>Este documento vai para a lixeira e pode ser restaurado depois.</p>
      </Modal>
    </div>
  );
}
