import { useEffect, useRef, useState } from 'react';
import { X, Upload, Sun, Moon, Monitor, Globe } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { getProfile, updateProfile, uploadAvatar } from '../api/profile';
import { Button } from './Button';
import { SketchDivider } from './SketchDivider';
import { cn } from '../lib/cn';

const THEMES = [
  { id: 'light',  label: 'Claro',   icon: Sun },
  { id: 'dark',   label: 'Escuro',  icon: Moon },
  { id: 'system', label: 'Sistema', icon: Monitor },
];

const LANGS = [
  { id: 'pt-BR', label: 'Português (BR)' },
  { id: 'en-US', label: 'English (US)' },
  { id: 'es-ES', label: 'Español' },
];

export function ProfileDrawer({ open, onClose, theme, setTheme }) {
  const { data: profile, setData: setProfile } = useAsync(getProfile, []);
  const fileRef = useRef(null);
  const [lang, setLang] = useState('pt-BR');

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const saveName = async (name) => {
    const updated = await updateProfile({ display_name: name });
    setProfile(updated);
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const updated = await uploadAvatar(file);
      setProfile(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      {/* backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 transition-opacity duration-150',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ background: 'color-mix(in srgb, var(--ink) 35%, transparent)' }}
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Perfil"
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[var(--paper)]',
          'border-l-[3px] border-[var(--ink)] transition-transform duration-200',
          'flex flex-col',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <header className="flex items-center justify-between px-5 py-3 border-b-[3px] border-[var(--ink)]">
          <h2 className="bx-h1 text-2xl">Perfil</h2>
          <button onClick={onClose} className="bx-btn bx-btn-ghost !p-1" aria-label="Fechar">
            <X size={18} strokeWidth={2.5} />
          </button>
        </header>

        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* Identidade */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bx-bold bg-[var(--bone)] flex items-center justify-center overflow-hidden shrink-0 shadow-[var(--shadow-sm)]">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="bx-h1 text-3xl opacity-50">
                  {profile?.display_name?.[0] ?? '?'}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="bx-label">Nome de exibição</span>
              <NameEditor value={profile?.display_name ?? ''} onSave={saveName} />

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatar}
              />
              <button
                className="bx-btn mt-2 text-[10px]"
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={12} strokeWidth={2.6} /> Trocar foto
              </button>
            </div>
          </div>

          <SketchDivider />

          {/* Tema */}
          <section>
            <span className="bx-label">Tema</span>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  className={cn(
                    'bx-btn !flex-col !py-3 !text-[10px]',
                    theme === id && 'bx-btn-primary'
                  )}
                  aria-pressed={theme === id}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Idioma */}
          <section>
            <span className="bx-label">Idioma</span>
            <div className="relative">
              <Globe
                size={14}
                strokeWidth={2.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <select
                className="bx-input pl-9 appearance-none"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                {LANGS.map((l) => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </div>
            <p className="bx-meta opacity-50 mt-1">
              A tradução da interface ainda está em andamento.
            </p>
          </section>

          <SketchDivider />

          <section className="opacity-60">
            <span className="bx-label">Em breve</span>
            <ul className="bx-meta space-y-1 leading-relaxed">
              <li>· Import / export da biblioteca</li>
              <li>· Sincronização entre dispositivos</li>
              <li>· Múltiplos perfis locais</li>
            </ul>
          </section>
        </div>
      </aside>
    </>
  );
}

function NameEditor({ value, onSave }) {
  const [editing, setEditing] = useState(null);

  const commit = async () => {
    if (editing === null) return;
    const clean = editing.trim();
    if (clean && clean !== value) await onSave(clean);
    setEditing(null);
  };

  if (editing !== null) {
    return (
      <div className="flex gap-2">
        <input
          autoFocus
          className="bx-input"
          value={editing}
          onChange={(e) => setEditing(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') setEditing(null);
          }}
        />
        <Button variant="primary" onClick={commit}>Ok</Button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(value)}
      className="text-left font-semibold text-lg hover:underline"
      title="Clique para editar"
    >
      {value || 'Sem nome'}{' '}
      <span className="bx-meta opacity-50">editar</span>
    </button>
  );
}
