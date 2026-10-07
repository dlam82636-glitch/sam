import React, { useState } from 'react';
import { Menu, X, ArrowRight, Search, Layers } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

export interface NavbarProps {
  onOpenArchitectureModal: () => void;
  onResetSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenArchitectureModal,
  onResetSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onResetSearch?.();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onResetSearch?.();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-xl p-1 -m-1 cursor-pointer"
            title="PRICERA Home"
          >
            {/* PRICERA brand emblem */}
            <div className="w-8.5 h-8.5 rounded-xl bg-[#0F766E] flex items-center justify-center text-white font-extrabold shadow-sm shadow-teal-950/20 transition-transform duration-200 group-hover:scale-105 border border-teal-600/40">
              <span className="font-mono text-sm tracking-tighter text-teal-100">P</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-xl leading-none">
                PRICERA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 self-center" />
            </div>
          </button>
        </div>

        {/* Center Nav Zone: Desktop Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600"
        >
          <button
            onClick={() => scrollToSection('search')}
            className="hover:text-slate-900 transition-colors duration-150 py-1 relative group cursor-pointer"
          >
            <span>Search</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-200 group-hover:w-full rounded-full" />
          </button>

          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-slate-900 transition-colors duration-150 py-1 relative group cursor-pointer"
          >
            <span>How it works</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-200 group-hover:w-full rounded-full" />
          </button>

          <button
            onClick={() => scrollToSection('spotlight')}
            className="hover:text-slate-900 transition-colors duration-150 py-1 relative group cursor-pointer"
          >
            <span>Market Spotlight</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-200 group-hover:w-full rounded-full" />
          </button>
        </nav>

        {/* Action Controls & Strong CTA */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenArchitectureModal}
            className="hidden lg:inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium px-2 py-1 cursor-pointer"
            title="View Technical Architecture"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Architecture</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            pill
            onClick={() => scrollToSection('search')}
            leftIcon={<Search className="w-3.5 h-3.5" />}
            className="text-xs font-semibold px-4.5 py-2"
          >
            Search the market
          </Button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-4 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => scrollToSection('search')}
            className="w-full text-left py-2.5 px-3 text-sm font-semibold text-slate-700 hover:text-teal-800 hover:bg-teal-50/50 rounded-xl transition-colors"
          >
            Search
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full text-left py-2.5 px-3 text-sm font-semibold text-slate-700 hover:text-teal-800 hover:bg-teal-50/50 rounded-xl transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection('spotlight')}
            className="w-full text-left py-2.5 px-3 text-sm font-semibold text-slate-700 hover:text-teal-800 hover:bg-teal-50/50 rounded-xl transition-colors"
          >
            Market Spotlight
          </button>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenArchitectureModal();
              }}
              className="text-xs text-slate-500 hover:text-slate-800 py-2 px-3 inline-flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Technical Architecture</span>
            </button>
            <Button
              variant="primary"
              size="sm"
              pill
              onClick={() => scrollToSection('search')}
              className="text-xs"
            >
              Search the market
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
