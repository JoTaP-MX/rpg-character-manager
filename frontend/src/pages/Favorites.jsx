import { useAsync } from '../hooks/useAsync';
import { listFavorites } from '../api/favorites';
import { DocumentCard } from '../components/DocumentCard';
import { EmptyState } from '../components/EmptyState';
import { SketchDivider } from '../components/SketchDivider';

export function Favorites() {
  const { data, loading } = useAsync(listFavorites, []);

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <h1 className="bx-h1 text-5xl mb-3">Favoritos</h1>
      <SketchDivider className="mb-6" />

      {loading ? (
        <p className="bx-meta opacity-60">Carregando…</p>
      ) : data?.length ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {data.map((d) => (
            <DocumentCard key={d.id} doc={d} favorited />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="scroll"
          title="Sem favoritos ainda"
          message="Abra um documento e toque na estrela para fixá-lo aqui."
        />
      )}
    </div>
  );
}
