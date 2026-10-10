import { cn } from '../lib/cn';

const VARIANTS = {
  default: '',
  primary: 'bx-btn-primary',
  danger: 'bx-btn-danger',
  ghost: 'bx-btn-ghost',
};

export function Button({
  variant = 'default',
  type = 'button',
  className,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={cn('bx-btn', VARIANTS[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
