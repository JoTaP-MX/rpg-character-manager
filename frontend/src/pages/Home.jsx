import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, FolderPlus } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { listFolders } from '../api/folders';
import { listDocuments } from '../api/documents';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SketchDivider } from '../components/SketchDivider';
import { EmptyState } from '../components/EmptyState';
import { NewCampaignModal } from '../components/NewCampaignModal';
import { QuickCharacterModal } from '../components/QuickCharacterModal';

// Estatísticas de uma campanha computadas com endpoints reais:
// percorre a subárvore de pastas chamando listFolders({ parent_id }) e
// listDocuments({ folder_id }). Irmãos em paralelo, para não ficar lento.
async function loadCampaignStats(campaignId) {
  const byType = {};
  let docs = 0;

  async function walk(folderId) {
    const [children, folderDocs] = await Promise.all([
      listFolders({ parent_id: folderId }),
      listDocuments({ folder_id: folderId }),
    ]);

    for (const d of folderDocs) {
      docs += 1;
      byType[d.type] = (byType[d.type] || 0) + 1;
    }

    await Promise.all(children.map((c) => walk(c.id)));
  }

  await walk(campaignId);
  return { docs, byType };
}

export function Home() {
  // Campanha = pasta raiz. `listFolders()` sem parent_id já bate no backend
  // real e é exatamente o que `/api/campaigns` fará quando for implementado.
  const { data: campaigns, loading, reload } = useAsync(listFolders, []);
  const [showNew, setShowNew] = useState(false);
  const [showQuick, setShowQuick] = useState(false);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="bx-meta opacity-60 mb-1">Biblioteca</p>
        <h1 className="bx-h1 text-5xl mb-2">Suas campanhas</h1>
        <p className="opacity-75 max-w-xl">
          Cada campanha é uma pasta raiz. Dentro dela, todo o conteúdo é
          escrito livremente em Markdown — personagens, locais, itens, o que
          você quiser.
        </p>
        <SketchDivider className="mt-5" />
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Button variant="primary" onClick={() => setShowNew(true)}>
          <FolderPlus size={15} strokeWidth={2.6} /> Nova Campanha
        </Button>
        <Button onClick={() => setShowQuick(true)}>
          <Sparkles size={15} strokeWidth={2.6} /> Personagem Rápido
        </Button>
      </div>

      {loading ? (
        <p className="bx-meta opacity-60">Carregando…</p>
      ) : campaigns?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="compass"
          title="Nenhuma campanha ainda"
          message="Comece sua primeira campanha! Você pode adicionar subpastas para personagens, locais e itens depois."
          action={
            <Button variant="primary" onClick={() => setShowNew(true)}>
              <Plus size={15} strokeWidth={2.6} /> Criar primeira campanha
            </Button>
          }
        />
      )}

      <NewCampaignModal
        open={showNew}
        onClose={() => setShowNew(false)}
        onCreated={() => { setShowNew(false); reload(); }}
      />
      <QuickCharacterModal
        open={showQuick}
        onClose={() => setShowQuick(false)}
        onCreated={() => { setShowQuick(false); reload(); }}
      />
    </div>
  );
}

function CampaignCard({ campaign }) {
  const { data: stats } = useAsync(
    () => loadCampaignStats(campaign.id),
    [campaign.id]
  );

  return (
    <Card
      as={Link}
      to={`/campanha/${campaign.id}`}
      className="block p-5 transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_var(--ink)]"
    >
      <h2 className="bx-h2 text-xl leading-tight mb-1">{campaign.name}</h2>

      <p className="bx-meta opacity-60 mb-4">
        {stats
          ? `${stats.docs} documento${stats.docs === 1 ? '' : 's'}`
          : '…'}
      </p>

      {stats && stats.docs > 0 && (
        <div className="flex flex-wrap gap-1">
          {Object.entries(stats.byType).map(([type, n]) => (
            <span key={type} className="bx-chip !text-[10px]">
              {type} <strong className="font-mono">{n}</strong>
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
