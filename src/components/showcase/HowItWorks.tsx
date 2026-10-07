import React from 'react';
import { Sparkles, Search, Layers, Calculator, ShieldCheck, FileText, CheckCircle2, Sliders } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      stepNumber: '01',
      title: 'Understand',
      subtitle: 'AI Specification Extraction',
      description:
        'Interprets natural language queries using Google Gemini to extract exact dimensions, material grades, standards, and variant parameters without hallucination.',
      icon: Sparkles,
      tag: 'Semantic Parsing',
    },
    {
      stepNumber: '02',
      title: 'Research',
      subtitle: 'Commercial Listing Retrieval',
      description:
        'When an external search provider is configured, targeted supplier queries search verified distributor catalogs, trade merchants, and wholesale listings.',
      icon: Search,
      tag: 'Evidence Retrieval',
    },
    {
      stepNumber: '03',
      title: 'Compare',
      subtitle: 'Variant & Outlier Screening',
      description:
        'Filters conflicting product variants (e.g. 128GB vs 256GB), groups listings by authentic currency, and screens extreme statistical price outliers.',
      icon: Layers,
      tag: 'Statistical Filtering',
    },
    {
      stepNumber: '04',
      title: 'Estimate',
      subtitle: 'Transparent Price Benchmark',
      description:
        'Calculates representative median price benchmarks, spreads, and confidence ratings, documenting explicit methodology and market limitations.',
      icon: Calculator,
      tag: 'Evidence Benchmark',
    },
  ];

  const principles = [
    {
      title: 'Text-First Search',
      description: 'Search any physical product, construction material, or industrial part using natural text terms.',
      icon: Sliders,
    },
    {
      title: 'Evidence-Backed Pricing',
      description: 'Zero artificial numbers. Estimates derive strictly from real verified observations.',
      icon: ShieldCheck,
    },
    {
      title: 'Confidence-Aware Estimates',
      description: 'Clear High, Medium, and Low ratings reflect sample depth and market price spread.',
      icon: CheckCircle2,
    },
    {
      title: 'Source Transparency',
      description: 'Every quote displays authentic seller domain, timestamp, and verifiable citation.',
      icon: FileText,
    },
  ];

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="my-16 sm:my-20">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/90 text-teal-800 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Evidence-Driven Architecture</span>
        </div>
        <h2 id="how-it-works-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          How PRICERA Works
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          From query parsing to transparent statistical estimates. No synthetic prices, no computer vision, and no ungrounded claims.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.stepNumber}
              padding="md"
              className="bg-white border-slate-200/90 hover:border-teal-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                    Step {item.stepNumber}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.tag}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 group-hover:bg-teal-50 group-hover:border-teal-200 flex items-center justify-center text-slate-700 group-hover:text-teal-700 transition-colors mb-3">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-950 transition-colors">
                  {item.title}
                </h3>
                <span className="text-xs font-medium text-slate-500 block mb-2">
                  {item.subtitle}
                </span>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>Deterministic pipeline</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Core Principles Grid (Replacing fake statistics with real product capabilities) */}
      <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            PRICERA Trust Principles
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Architectural standards enforced across every query execution
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
                  <Icon className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{p.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
