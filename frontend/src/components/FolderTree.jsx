import { useState } from 'react';
import { ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Árvore de pastas navegável. Controlado pelo pai via `value` / `onChange`.
 * `nodes` deve ser uma lista de FolderTreeNode (com `children`).
 */
export function FolderTree({ nodes, value, onChange, level = 0 }) {
  if (!nodes?.length) return null;
  return (
    <ul className={cn(level > 0 && 'ml-4 border-l-[2px] border-[var(--ink)] pl-2')}>
      {nodes.map((node) => (
        <FolderTreeNode
          key={node.id}
          node={node}
          value={value}
          onChange={onChange}
          level={level}
        />
      ))}
    </ul>
  );
}

function FolderTreeNode({ node, value, onChange, level }) {
  const hasChildren = node.children?.length > 0;
  const [open, setOpen] = useState(level === 0);
  const selected = value === node.id;

  return (
    <li>
      <div className="flex items-center gap-1">
        {hasChildren ? (
          <button
            onClick={() => setOpen((o) => !o)}
            className="p-1 hover:bg-[var(--bone)]"
            aria-label={open ? 'Recolher' : 'Expandir'}
          >
            <ChevronRight
              size={14}
              strokeWidth={2.6}
              className={cn('transition-transform', open && 'rotate-90')}
            />
          </button>
        ) : (
          <span className="w-6" aria-hidden="true" />
        )}

        <button
          onClick={() => onChange?.(node.id)}
          className={cn(
            'flex-1 flex items-center gap-2 px-2 py-1 text-left text-sm hover:bg-[var(--bone)]',
            selected && 'bg-[var(--amber)] font-semibold border-[2px] border-[var(--ink)]'
          )}
        >
          {open ? (
            <FolderOpen size={14} strokeWidth={2.4} />
          ) : (
            <Folder size={14} strokeWidth={2.4} />
          )}
          <span className="truncate">{node.name}</span>
        </button>
      </div>

      {hasChildren && open && (
        <FolderTree
          nodes={node.children}
          value={value}
          onChange={onChange}
          level={level + 1}
        />
      )}
    </li>
  );
}
