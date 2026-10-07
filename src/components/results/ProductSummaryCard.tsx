import React from 'react';
import { PhysicalProduct } from '@/src/types';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';

export interface ProductSummaryCardProps {
  product: PhysicalProduct;
}

export const ProductSummaryCard: React.FC<ProductSummaryCardProps> = ({ product }) => {
  return (
    <Card className="border-slate-200/90 shadow-card" padding="lg">
      {/* Category Hierarchy */}
      <div className="flex items-center gap-2 flex-wrap mb-2.5">
        <Badge variant="teal" size="sm" className="font-mono">
          {product.primaryCategory}
        </Badge>
        {product.subCategory && (
          <>
            <span className="text-slate-300 text-xs">/</span>
            <Badge variant="default" size="sm">
              {product.subCategory}
            </Badge>
          </>
        )}
      </div>

      {/* Main Canonical Name */}
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
        {product.canonicalName}
      </h2>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed mb-6">
        {product.shortDescription}
      </p>

      {/* Grid of Key Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-100">
        {/* Material & Applications */}
        <div className="space-y-4">
          {product.materialType && (
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Material Composition
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-800">
                {product.materialType}
              </span>
            </div>
          )}

          {product.commonApplications && product.commonApplications.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Typical Applications & Environments
              </span>
              <ul className="space-y-1.5">
                {product.commonApplications.map((app, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Brands & Variants */}
        <div className="space-y-4">
          {product.knownBrandsOrManufacturers && product.knownBrandsOrManufacturers.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Known Manufacturers / Trade Brands
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.knownBrandsOrManufacturers.map((brand, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.variants && product.variants.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Detected Product Variants
              </span>
              <div className="space-y-2">
                {product.variants.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800">{v.title}</span>
                      {v.approximateRelativeCost && (
                        <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600">
                          {v.approximateRelativeCost} cost tier
                        </span>
                      )}
                    </div>
                    {v.distinguishingFeatures && v.distinguishingFeatures.length > 0 && (
                      <div className="text-[11px] text-slate-500 flex flex-wrap gap-1.5 mt-1">
                        {v.distinguishingFeatures.map((feat, idx) => (
                          <span key={idx} className="bg-white border border-slate-200/60 px-1.5 py-0.5 rounded font-mono">
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
