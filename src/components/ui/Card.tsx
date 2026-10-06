import React from 'react';
import { classNames } from '@/src/lib/utils';

export interface CardProps {
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
}) => {
  const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={classNames(
        'bg-white rounded-xl border border-slate-200/90 shadow-xs transition-all duration-200',
        hoverEffect ? 'hover:border-slate-300 hover:shadow-md' : '',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
};
