import React, { useState } from 'react';
import {
  ShoppingCart,
  ExternalLink,
  Store,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  ArrowUpRight,
  MapPin,
  TrendingDown,
  Building,
} from 'lucide-react';
import { CommercialOffer, BuyOpportunitiesSummary } from '@/src/types/commercial';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { formatCurrency } from '@/src/lib/utils';

export interface BuyOpportunitiesSectionProps {
  buyOpportunities?: BuyOpportunitiesSummary;
  offers?: CommercialOffer[];
  productName: string;
  marketCurrency?: string | null;
  marketEstimatedPrice?: number | null;
}

export const BuyOpportunitiesSection: React.FC<BuyOpportunitiesSectionProps> = ({
  buyOpportunities,
  offers: directOffers,
  productName,
  marketCurrency,
  marketEstimatedPrice,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'EXACT' | 'NIGERIA'>('ALL');

  const offers = buyOpportunities?.offers || directOffers || [];

  if (offers.length === 0) {
    return (
      <Card className="border-slate-200/90 shadow-card" padding="none">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-teal-600" />
              <span>Where to Buy Verified Listings</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Authentic merchant listings and store links for {productName}
            </p>
          </div>
        </div>
        <div className="p-8 text-center space-y-2">
          <Store className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-700">No direct commercial stores indexed yet</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Market research found reference information, but no direct storefront URLs were confirmed for ordering.
          </p>
        </div>
      </Card>
    );
  }

  const filteredOffers = offers.filter((o) => {
    if (filterType === 'EXACT') return o.matchConfidence === 'EXACT';
    if (filterType === 'NIGERIA') return o.isNigerianMerchant || o.currency === 'NGN';
    return true;
  });

  const exactCount = offers.filter((o) => o.matchConfidence === 'EXACT').length;
  const nigCount = offers.filter((o) => o.isNigerianMerchant || o.currency === 'NGN').length;

  const topOffer = buyOpportunities?.topRecommendation || offers[0];

  return (
    <div className="space-y-4">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-teal-600 shrink-0" />
            <span>Best Places to Buy Verified Offers</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare verified store links, merchant ratings, and price quotes. No synthetic links.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-white text-teal-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Offers ({offers.length})
          </button>
          {exactCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterType('EXACT')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === 'EXACT'
                  ? 'bg-white text-teal-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exact Matches ({exactCount})
            </button>
          )}
          {nigCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterType('NIGERIA')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === 'NIGERIA'
                  ? 'bg-white text-teal-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇳🇬 Nigeria ({nigCount})
            </button>
          )}
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredOffers.map((offer) => {
          const isTop = topOffer?.id === offer.id;
          const isExact = offer.matchConfidence === 'EXACT';

          return (
            <Card
              key={offer.id}
              padding="none"
              className={`flex flex-col justify-between overflow-hidden border-slate-200 hover:border-teal-400 hover:shadow-md transition-all ${
                isTop ? 'ring-2 ring-teal-500/30' : ''
              }`}
            >
              <div className="p-4 space-y-3">
                {/* Seller & Match Badges */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="font-bold text-xs text-slate-900 truncate max-w-[150px]">
                      {offer.seller}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    {offer.isNigerianMerchant && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        🇳🇬 NG
                      </span>
                    )}
                    {isExact ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                        Exact Match
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        Similar
                      </span>
                    )}
                    {offer.isOfficialOrVerified && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Listing Title */}
                <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">
                  {offer.title}
                </h4>

                {/* Price Display */}
                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      Listed Price
                    </span>
                    <span className="text-base font-extrabold font-mono text-slate-900">
                      {offer.price !== null
                        ? formatCurrency(offer.price, offer.currency || 'NGN')
                        : 'Contact for Quote'}
                    </span>
                  </div>

                  {offer.availability && (
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      {offer.availability}
                    </span>
                  )}
                </div>

                {/* Specs or Domain Info */}
                <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
                  <span className="text-slate-400 truncate max-w-[180px]">
                    {offer.sellerDomain}
                  </span>
                  {offer.location && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3" />
                      <span>{offer.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={offer.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-xs transition-colors group cursor-pointer"
                >
                  <span>{offer.isDirectListing ? 'View Store Listing' : 'Visit Store'}</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {offer.fallbackSearchUrl && (
                  <a
                    href={offer.fallbackSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Search for "${productName}" on ${offer.seller}`}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs transition-colors cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
