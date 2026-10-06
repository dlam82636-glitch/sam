import React from 'react';
import { Sliders, ShieldCheck, HelpCircle } from 'lucide-react';
import { SpecificationItem } from '@/src/types';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';

export interface SpecificationsTableProps {
  specifications: SpecificationItem[];
}

export const SpecificationsTable: React.FC<SpecificationsTableProps> = ({ specifications }) => {
  return (
    <Card className="border-slate-200/90 shadow-xs" padding="none">
      <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Technical Specifications</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized physical parameters and regulatory standards extracted from supplier datasheets
          </p>
        </div>
        <Badge variant="neutral" size="sm" className="font-mono">
          {specifications.length} Parameters
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider">
              <th className="py-3 px-5 sm:px-6">Specification</th>
              <th className="py-3 px-4">Value / Standard</th>
              <th className="py-3 px-4 hidden sm:table-cell">Category</th>
              <th className="py-3 px-5 sm:px-6 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {specifications.map((spec) => (
              <tr key={spec.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-5 sm:px-6 font-medium text-slate-800">
                  {spec.name}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-900 font-medium">
                  {spec.value}
                </td>
                <td className="py-3.5 px-4 hidden sm:table-cell">
                  {spec.category && (
                    <span className="capitalize text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {spec.category}
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-5 sm:px-6 text-right">
                  <span
                    className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded ${
                      spec.confidence === 'high'
                        ? 'bg-emerald-50 text-emerald-700'
                        : spec.confidence === 'medium'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {spec.confidence || 'high'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
