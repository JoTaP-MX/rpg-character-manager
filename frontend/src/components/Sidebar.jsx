import { NavLink } from 'react-router-dom';
import { Home, Search, Star, Trash2, ExternalLink, Compass } from 'lucide-react';
import { cn } from '../lib/cn';

// Troque pela URL real quando quiser — aqui é só o placeholder do prompt.
const PINTEREST_URL = 'https://www.pinterest.com/';

const NAV = [
  { to: '/',          label: 'Início',    icon: Home,   end: true },
  { to: '/busca',     label: 'Busca',     icon: Search, end: false },
  { to: '/favoritos', label: 'Favoritos', icon: Star,   end: false },
  { to: '/lixeira',   label: 'Lixeira',   icon: Trash2, end: false },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r-[3px] border-[var(--ink)] bg-[var(--paper)]">
      <nav className="p-3 flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 font-semibold uppercase tracking-widest text-xs border-[2px] border-transparent',
                isActive
                  ? 'border-[var(--ink)] bg-[var(--amber)] shadow-[var(--shadow-sm)]'
                  : 'hover:border-[var(--ink)]'
              )
            }
          >
            <Icon size={16} strokeWidth={2.6} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-3">
        <a
          href={PINTEREST_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="bx-btn w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Compass size={15} strokeWidth={2.6} />
            Procure mais ideias
          </span>
          <ExternalLink size={13} strokeWidth={2.6} />
        </a>

        <p className="bx-meta opacity-50 mt-3 leading-tight">
          v0.2.0 · local
        </p>
      </div>
    </aside>
  );
}
