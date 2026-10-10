import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';

const WIDTHS = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
};

export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-10 overflow-y-auto"
      style={{ background: 'color-mix(in srgb, var(--ink) 40%, transparent)' }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className={cn('bx-card w-full mt-10', WIDTHS[size])}>
        <header className="flex items-center justify-between border-b-[3px] border-[var(--ink)] px-5 py-3">
          <h2 className="bx-h2 text-xl">{title}</h2>
          <button
            onClick={onClose}
            className="bx-btn bx-btn-ghost !p-1"
            aria-label="Fechar"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </header>

        <div className="px-5 py-5">{children}</div>

        {footer && (
          <footer className="border-t-[3px] border-[var(--ink)] px-5 py-3 flex justify-end gap-2 flex-wrap">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
