import React from 'react';
import { GitBranch, ShieldCheck } from 'lucide-react';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';

export interface NavbarProps {
  onOpenArchitectureModal: () => void;
  onResetSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenArchitectureModal,
  onResetSearch,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* PRICERA Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onResetSearch}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-1 -m-1 cursor-pointer"
            title="PRICERA Home"
          >
            {/* Minimal data-inspired 'P' emblem */}
            <div className="w-9 h-9 rounded-lg bg-teal-800 flex items-center justify-center text-white font-extrabold shadow-xs transition-transform group-hover:scale-105 border border-teal-700">
              <span className="font-mono text-base tracking-tighter text-teal-200">P</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  PRICERA
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/80 hidden sm:inline">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 tracking-normal hidden md:block">
                Know the market before you buy.
              </p>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200/70">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>Product & Price Intelligence</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenArchitectureModal}
            leftIcon={<GitBranch className="w-3.5 h-3.5 text-teal-700" />}
            className="text-xs font-semibold hover:border-teal-500 hover:text-teal-900 transition-colors"
          >
            Architecture
          </Button>
        </div>
      </div>
    </header>
  );
};
