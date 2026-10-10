import { cn } from '../lib/cn';

export function Card({ as: As = 'div', className, children, ...rest }) {
  return (
    <As className={cn('bx-card', className)} {...rest}>
      {children}
    </As>
  );
}
