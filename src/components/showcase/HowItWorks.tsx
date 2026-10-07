import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Layers,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sliders,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';

export const HowItWorks: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      id: '01',
      title: 'Understand',
      eyebrow: 'Semantic Query Disambiguation',
      headline: 'Extract exact engineering specifications',
      description:
        'Interprets natural text queries to isolate material grades, dimensions, international standards, and configuration parameters without making synthetic assumptions.',
      icon: Sparkles,
      capabilities: [
        'Dimensions & physical tolerances',
        'Material composition & alloy grades',
        'Regulatory certifications & standards',
      ],
      previewNode: 'Dimensions · Grade · Variant',
    },
    {
      id: '02',
      title: 'Research',
      eyebrow: 'Verified Catalog Discovery',
      headline: 'Scan authentic commercial supplier feeds',
      description:
        'Dispatches targeted supplier queries to scan verified distributor inventories, building merchants, and trade catalogs to retrieve real commercial listings.',
      icon: Search,
      capabilities: [
        'Direct distributor catalogs',
        'Commercial wholesale inventories',
        'Live timestamped price quotes',
      ],
      previewNode: 'Wholesale Catalogs · Merchant Inventory',
    },
    {
      id: '03',
      title: 'Compare',
      eyebrow: 'Variant Normalization',
      headline: 'Screen outliers and normalize parameters',
      description:
        'Separates conflicting hardware configurations (e.g. 128GB vs 256GB), groups listings by authentic currency, and eliminates abnormal statistical price outliers.',
      icon: Layers,
      capabilities: [
        'Interquartile Range (IQR) outlier screening',
        'Standardized unit-of-measure alignment',
        'Conflicting variant segregation',
      ],
      previewNode: 'Unit Alignment · Outlier Screening',
    },
    {
      id: '04',
      title: 'Estimate',
      eyebrow: 'Evidence-Driven Pricing',
      headline: 'Calculate transparent benchmark bounds',
      description:
        'Calculates a representative median price benchmark with lower/upper bounds, sample depth metrics, and an honest confidence score reflecting real data.',
      icon: Calculator,
      capabilities: [
        'Statistical median price benchmark',
        'Observed lower and upper bounds',
        'Confidence score based on sample depth',
      ],
      previewNode: 'Median Benchmark · Price Bounds',
    },
  ];

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="my-24 sm:my-32 relative">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-96 hero-radial-glow blur-3xl -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/90 text-teal-800 text-xs font-bold uppercase font-mono mb-4 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Deterministic Research Pipeline</span>
        </div>
        <h2 id="how-it-works-title" className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          How PRICERA Works
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
          Four interconnected stages transform an ambiguous search term into a transparent, evidence-backed market benchmark.
        </p>
      </div>

      {/* LARGE CENTRAL INTERCONNECTED PIPELINE COMPOSITION */}
      <div className="relative max-w-5xl mx-auto">
        {/* Continuous Animated Connecting Beam (Desktop) */}
        <div className="hidden lg:block absolute top-12 left-16 right-16 h-1 bg-slate-200/80 rounded-full z-0 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500 rounded-full w-full animate-shimmer" />
        </div>

        {/* 4 Interactive Stage Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {stages.map((stg, idx) => {
            const Icon = stg.icon;
            const isActive = activeStage === idx;

            return (
              <div
                key={stg.id}
                onClick={() => setActiveStage(idx)}
                className={`group cursor-pointer rounded-3xl p-6 sm:p-7 transition-all duration-300 relative flex flex-col justify-between ${
                  isActive
                    ? 'glass-panel-dark text-white shadow-2xl -translate-y-2 border border-teal-500/40 ring-4 ring-teal-500/10'
                    : 'glass-panel text-slate-800 hover:-translate-y-1 hover:border-teal-500/40'
                }`}
              >
                {/* Node Top Row: Numeral + Icon */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    {/* Glowing Stage Node Circle */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/40 scale-105'
                          : 'bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Step Numeral Pill */}
                    <span
                      className={`font-mono font-bold text-xs px-2.5 py-1 rounded-full border ${
                        isActive
                          ? 'bg-white/10 text-teal-300 border-teal-400/30'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      Stage {stg.id}
                    </span>
                  </div>

                  {/* Stage Eyebrow */}
                  <span
                    className={`text-[11px] font-mono uppercase tracking-wider block mb-1 font-semibold ${
                      isActive ? 'text-teal-300' : 'text-teal-700'
                    }`}
                  >
                    {stg.eyebrow}
                  </span>

                  {/* Stage Title */}
                  <h3
                    className={`text-xl font-bold tracking-tight mb-3 ${
                      isActive ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {stg.title}
                  </h3>

                  {/* Short Description */}
                  <p
                    className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                      isActive ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {stg.description}
                  </p>
                </div>

                {/* Bottom Node Indicator */}
                <div
                  className={`pt-3.5 border-t text-[11px] font-mono flex items-center justify-between ${
                    isActive
                      ? 'border-white/10 text-teal-300'
                      : 'border-slate-100 text-slate-400 group-hover:text-teal-700'
                  }`}
                >
                  <span className="truncate">{stg.previewNode}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAILED ACTIVE STAGE SHOWCASE PANEL */}
        <div className="mt-8 rounded-3xl glass-panel p-7 sm:p-9 relative overflow-hidden border border-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-bold">
                  Active Pipeline Focus · Stage {stages[activeStage].id}: {stages[activeStage].title}
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {stages[activeStage].headline}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {stages[activeStage].description}
              </p>
            </div>

            {/* Checklist of capabilities */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2.5 font-mono text-xs sm:text-sm shrink-0 lg:w-80 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-sans">
                Stage Capabilities
              </span>
              {stages[activeStage].capabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-xs font-medium font-sans">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
