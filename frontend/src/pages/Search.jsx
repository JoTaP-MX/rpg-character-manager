import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { search } from '../api/search';
import { useAsync } from '../hooks/useAsync';
import { DocumentCard } from '../components/DocumentCard';
import { EmptyState } from '../components/EmptyState';
import { SketchDivider } from '../components/SketchDivider';

export function Search() {
  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState('');

  const { data: results, loading } = useAsync(
    () => (submitted ? search(submitted) : Promise.resolve([])),
    [submitted]
  );

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(q);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <h1 className="bx-h1 text-5xl mb-3">Busca</h1>
      <SketchDivider className="mb-6" />

      <form onSubmit={onSubmit} className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <SearchIcon
            size={15}
            strokeWidth={2.6}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Título ou conteúdo…"
            className="bx-input pl-9"
            aria-label="Termo de busca"
          />
        </div>
        <button type="submit" className="bx-btn bx-btn-primary">
          Buscar
        </button>
      </form>

      {!submitted ? (
        <p className="bx-meta opacity-60">
          Digite algo e pressione Enter.
        </p>
      ) : loading ? (
        <p className="bx-meta opacity-60">Buscando…</p>
      ) : results?.length ? (
        <div className="columns-1 sm:columns-2 gap-4">
          {results.map((d) => (
            <DocumentCard key={d.id} doc={d} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="ghost"
          title="Nada encontrado"
          message={`Nenhum documento corresponde a "${submitted}".`}
        />
      )}
    </div>
  );
}
