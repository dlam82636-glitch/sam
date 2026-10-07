import React from 'react';
import { classNames } from '@/src/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hoverEffect = false,
  ...props
}) => {
  const paddingMap = {
    none: '',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-7',
    lg: 'p-7 sm:p-9',
  };

  return (
    <div
      className={classNames(
        'bg-white rounded-2xl border border-slate-200/80 shadow-card transition-all duration-250 ease-out',
        hoverEffect ? 'hover:border-teal-600/40 hover:-translate-y-1 hover:shadow-card-hover' : '',
        paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
