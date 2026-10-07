import React, { useState } from 'react';
import { Layers, Menu, X } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onResetSearch?.();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-lg p-1 -m-1 cursor-pointer"
            title="PRICERA Home"
          >
            {/* PRICERA brand emblem */}
            <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center text-white font-extrabold shadow-2xs transition-transform duration-200 group-hover:scale-105 border border-teal-700">
              <span className="font-mono text-sm tracking-tighter text-teal-200">P</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg leading-none">
                PRICERA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 self-center" />
            </div>
          </button>
        </div>

        {/* Center Nav Zone: Desktop Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600"
        >
          <button
            onClick={() => scrollToSection('search')}
            className="hover:text-teal-800 transition-colors duration-200 py-1 relative group cursor-pointer"
          >
            <span>Search</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-200 group-hover:w-full" />
          </button>

          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-teal-800 transition-colors duration-200 py-1 relative group cursor-pointer"
          >
            <span>How it works</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-200 group-hover:w-full" />
          </button>

          <button
            onClick={() => scrollToSection('spotlight')}
            className="hover:text-teal-800 transition-colors duration-200 py-1 relative group cursor-pointer"
          >
            <span>Market Spotlight</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-200 group-hover:w-full" />
          </button>
        </nav>

        {/* Action Controls & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenArchitectureModal}
            leftIcon={<Layers className="w-3.5 h-3.5 text-teal-700" />}
            className="text-xs font-semibold border-slate-200 hover:border-teal-500 hover:text-teal-900 transition-colors"
          >
            <span className="hidden sm:inline">System</span> Architecture
          </Button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => scrollToSection('search')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors"
          >
            Search
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection('spotlight')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors"
          >
            Market Spotlight
          </button>
        </div>
      )}
    </header>
  );
};
