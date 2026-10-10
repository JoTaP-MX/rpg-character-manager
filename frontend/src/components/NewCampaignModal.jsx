import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { createFolder } from '../api/folders';

export function NewCampaignModal({ open, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) {
      setName('');
      setError(null);
      setSaving(false);
    }
  }, [open]);

  const submit = async () => {
    const clean = name.trim();
    if (!clean) return;
    setSaving(true);
    setError(null);
    try {
      // Campanha = pasta raiz. POST /api/folders sem parent_id já está
      // implementado no backend — não usamos /api/campaigns (planejado).
      await createFolder({ name: clean, parent_id: null });
      onCreated?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova campanha"
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
            {saving ? 'Criando…' : 'Criar'}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <Input
          label="Nome da campanha"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Ex: A Maldição de Strahd"
        />
        {error && <p className="bx-meta text-[var(--brick)]">{error}</p>}
        <p className="bx-meta opacity-60">
          Uma campanha é uma pasta raiz — subpastas para personagens, locais e
          itens podem vir depois.
        </p>
      </div>
    </Modal>
  );
}
