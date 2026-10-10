import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Badge } from './Badge';

/**
 * Card de documento usado nos grids/masonry (Home de campanha, Busca,
 * Favoritos). O `favorited` é opcional e mostra a estrela.
 */
export function DocumentCard({ doc, favorited = false }) {
  return (
    <Link
      to={`/documento/${doc.id}`}
      className="bx-card group block p-4 mb-4 transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_var(--ink)]"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <Badge type={doc.type} />
        {favorited && (
          <Star size={16} strokeWidth={2.5} className="fill-[var(--amber)] shrink-0" />
        )}
      </div>

      <h3 className="bx-h2 text-lg leading-tight mb-1 group-hover:underline">
        {doc.title}
      </h3>

      <p className="bx-meta opacity-60">
        #{doc.id}
        {doc.updated_at && (
          <> · {new Date(doc.updated_at).toLocaleDateString('pt-BR')}</>
        )}
      </p>
    </Link>
  );
}
