import { UserRound } from 'lucide-react';

export function Topbar({ onOpenProfile }) {
  return (
    <header className="sticky top-0 z-40 grid grid-cols-3 items-center px-5 py-3 border-b-[3px] border-[var(--ink)] bg-[var(--paper)]">
      {/* coluna esquerda vazia — mantém o título centralizado sem truque */}
      <div />

      <h1 className="bx-h1 text-3xl text-center tracking-tight select-none">
        Visual Codex
      </h1>

      <div className="flex justify-end">
        <button
          onClick={onOpenProfile}
          className="bx-btn bx-btn-ghost !p-2"
          aria-label="Abrir perfil"
        >
          <UserRound size={20} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}
