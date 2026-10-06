import React from 'react';
import { AlertTriangle, Info, GitBranch } from 'lucide-react';
import { Badge } from '@/src/components/ui/Badge';

export interface PrototypeBannerProps {
  onOpenArchitectureModal?: () => void;
}

export const PrototypeBanner: React.FC<PrototypeBannerProps> = ({ onOpenArchitectureModal }) => {
  return (
    <div className="w-full mb-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-xs uppercase tracking-wider text-amber-950">
                Stage 1 & 2 Preview Schema
              </span>
              <Badge variant="warning" size="sm" className="font-mono text-[10px]">
                Isolated Demo Fixture
              </Badge>
            </div>
            <p className="text-xs text-amber-900/90 mt-0.5 leading-relaxed">
              This layout demonstrates the future structured output format. The figures below are synthetic schema fixtures used to validate component hierarchy and responsiveness before live AI and web search services are connected in Stage 3.
            </p>
          </div>
        </div>

        {onOpenArchitectureModal && (
          <button
            onClick={onOpenArchitectureModal}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100/80 hover:bg-amber-200/70 border border-amber-300/80 text-amber-900 text-xs font-medium transition-colors cursor-pointer"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Architecture Specs</span>
          </button>
        )}
      </div>
    </div>
  );
};
