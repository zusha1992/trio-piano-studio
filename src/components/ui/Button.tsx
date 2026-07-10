import Link from 'next/link';
import { clsx } from 'clsx';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  disabled,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-light tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer';

  const variants = {
    primary: 'bg-[var(--c-accent)] hover:bg-[#D4B96A] text-[var(--c-bg)]',
    outline:
      'border border-[var(--c-accent)] text-[var(--c-accent)] hover:bg-[var(--c-accent)] hover:text-[var(--c-bg)]',
    ghost: 'text-[var(--c-text)] hover:text-[var(--c-accent)]',
  };

  const sizes = {
    sm: 'text-[10px] px-5 py-2.5',
    md: 'text-xs px-7 py-3.5',
    lg: 'text-xs px-9 py-4',
  };

  const cls = clsx(base, variants[variant], sizes[size], disabled && 'opacity-50 cursor-not-allowed', className);

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
