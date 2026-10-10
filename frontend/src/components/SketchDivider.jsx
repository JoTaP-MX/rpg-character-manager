import { useEffect, useRef } from 'react';
import rough from 'roughjs';

/**
 * Linha divisória levemente imperfeita, desenhada à mão via rough.js.
 * Cor acompanha o texto do pai (currentColor) — troca com o tema.
 */
export function SketchDivider({ height = 10, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return undefined;
    svg.innerHTML = '';
    const rc = rough.svg(svg);
    const line = rc.line(2, height / 2, 998, height / 2, {
      stroke: 'currentColor',
      strokeWidth: 1.6,
      roughness: 2.2,
      bowing: 1.4,
    });
    svg.appendChild(line);
    return () => {
      svg.innerHTML = '';
    };
  }, [height]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 1000 ${height}`}
      preserveAspectRatio="none"
      className={`w-full text-[var(--ink)] opacity-80 ${className}`}
      style={{ height }}
      aria-hidden="true"
    />
  );
}
