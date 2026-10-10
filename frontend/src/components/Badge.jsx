import { cn } from '../lib/cn';

// Cor sólida, chapada, por tipo de documento. Nada de pastel nem gradiente.
// Tipos fora do mapa caem no fallback `documento`.
const TYPE_COLORS = {
  personagem: 'bg-[var(--amber)] text-[var(--ink)]',
  item: 'bg-[var(--brick)] text-[var(--paper)]',
  local: 'bg-[var(--moss)] text-[var(--paper)]',
  criatura: 'bg-[var(--slate)] text-[var(--paper)]',
  campanha: 'bg-[var(--ink)] text-[var(--paper)]',
  documento: 'bg-[var(--bone)] text-[var(--ink)]',
};

export function Badge({ type = 'documento', children, className }) {
  const colorClass = TYPE_COLORS[type] || TYPE_COLORS.documento;
  return (
    <span className={cn('bx-chip', colorClass, className)}>
      {children ?? type}
    </span>
  );
}
