import React from 'react';
import { Layers, ShieldCheck, Compass, GitBranch } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onResetSearch}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-lg p-1 -m-1"
            title="MarketSpec Home"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold shadow-xs transition-transform group-hover:scale-105">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">
                  Market<span className="text-indigo-600">Spec</span>
                </span>
                <Badge variant="neutral" size="sm" className="hidden sm:inline-flex text-[11px] font-mono">
                  Stage 1-2 MVP
                </Badge>
              </div>
              <p className="text-[11px] text-slate-700 tracking-normal hidden md:block">
                Physical Product & Material Intelligence
              </p>
            </div>
          </button>
        </div>

        {/* Minimal Navigation & Stage Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Text-Search Only (No Image/Voice)</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenArchitectureModal}
            leftIcon={<GitBranch className="w-3.5 h-3.5 text-slate-500" />}
            className="text-xs font-medium"
          >
            Architecture & Specs
          </Button>
        </div>
      </div>
    </header>
  );
};
