import { forwardRef } from 'react';
import { cn } from '../lib/cn';

export const Input = forwardRef(function Input(
  { label, hint, className, id, ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <label className="block" htmlFor={inputId}>
      {label && <span className="bx-label">{label}</span>}
      <input
        id={inputId}
        ref={ref}
        className={cn('bx-input', className)}
        {...rest}
      />
      {hint && <span className="bx-meta opacity-60 mt-1 block">{hint}</span>}
    </label>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, hint, className, id, ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <label className="block" htmlFor={inputId}>
      {label && <span className="bx-label">{label}</span>}
      <textarea
        id={inputId}
        ref={ref}
        className={cn('bx-input font-mono text-sm leading-relaxed', className)}
        {...rest}
      />
      {hint && <span className="bx-meta opacity-60 mt-1 block">{hint}</span>}
    </label>
  );
});

export function Select({ label, children, className, id, ...rest }) {
  const selectId = id || rest.name;
  return (
    <label className="block" htmlFor={selectId}>
      {label && <span className="bx-label">{label}</span>}
      <select
        id={selectId}
        className={cn('bx-input appearance-none pr-8', className)}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}
