import React from 'react';
import { classNames } from '@/src/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'info' | 'danger' | 'teal';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-800 border-slate-200/90',
    neutral: 'bg-zinc-100 text-zinc-700 border-zinc-200/80',
    teal: 'bg-teal-50 text-teal-800 border-teal-200/90',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/90',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/90',
    info: 'bg-sky-50 text-sky-800 border-sky-200/90',
    danger: 'bg-rose-50 text-rose-800 border-rose-200/90',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 tracking-tight',
    md: 'text-xs font-semibold px-3 py-1 tracking-tight',
  };

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
