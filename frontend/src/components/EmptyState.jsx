import { useEffect, useRef } from 'react';
import rough from 'roughjs';

// Três ilustrações hand-drawn simples: pergaminho, bússola, fantasma.
function Sketch({ kind, size = 96 }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return undefined;
    svg.innerHTML = '';
    const rc = rough.svg(svg);
    const s = size;

    if (kind === 'scroll') {
      svg.appendChild(
        rc.rectangle(14, 20, s - 28, s - 40, {
          stroke: 'currentColor', strokeWidth: 2, roughness: 2.4, fill: 'none',
        })
      );
      svg.appendChild(rc.line(24, 38, s - 24, 38, { stroke: 'currentColor', strokeWidth: 1.4, roughness: 2 }));
      svg.appendChild(rc.line(24, 52, s - 32, 52, { stroke: 'currentColor', strokeWidth: 1.4, roughness: 2 }));
      svg.appendChild(rc.line(24, 66, s - 28, 66, { stroke: 'currentColor', strokeWidth: 1.4, roughness: 2 }));
    } else if (kind === 'compass') {
      svg.appendChild(rc.circle(s / 2, s / 2, s - 24, { stroke: 'currentColor', strokeWidth: 2, roughness: 2 }));
      svg.appendChild(rc.line(s / 2, 22, s / 2, s - 22, { stroke: 'currentColor', strokeWidth: 1.4, roughness: 2 }));
      svg.appendChild(rc.line(22, s / 2, s - 22, s / 2, { stroke: 'currentColor', strokeWidth: 1.4, roughness: 2 }));
      svg.appendChild(rc.line(s / 2, 26, s / 2 - 6, 40, { stroke: 'currentColor', strokeWidth: 2, roughness: 1.2 }));
    } else {
      // ghost
      svg.appendChild(
        rc.path(
          `M 24 ${s - 20} L 24 44 Q 24 16 ${s / 2} 16 Q ${s - 24} 16 ${s - 24} 44 ` +
          `L ${s - 24} ${s - 20} L ${s - 34} ${s - 30} L ${s - 44} ${s - 20} ` +
          `L ${s / 2 + 4} ${s - 30} L 44 ${s - 20} Z`,
          { stroke: 'currentColor', strokeWidth: 2, roughness: 2.2, fill: 'none' }
        )
      );
      svg.appendChild(rc.circle(s / 2 - 12, 44, 8, { stroke: 'currentColor', strokeWidth: 2, fill: 'currentColor', fillStyle: 'solid' }));
      svg.appendChild(rc.circle(s / 2 + 12, 44, 8, { stroke: 'currentColor', strokeWidth: 2, fill: 'currentColor', fillStyle: 'solid' }));
    }

    return () => {
      svg.innerHTML = '';
    };
  }, [kind, size]);

  return <svg ref={ref} width={size} height={size} className="text-[var(--ink)]" aria-hidden="true" />;
}

export function EmptyState({ icon = 'scroll', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="bx-bold bg-[var(--bone)] p-6 mb-5 shadow-[var(--shadow)]">
        <Sketch kind={icon} />
      </div>
      <h3 className="bx-h2 text-xl mb-1">{title}</h3>
      {message && <p className="max-w-md opacity-75 mb-5">{message}</p>}
      {action}
    </div>
  );
}
