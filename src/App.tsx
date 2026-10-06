/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from '@/src/components/layout/Navbar';
import { Footer } from '@/src/components/layout/Footer';
import { ArchitectureModal } from '@/src/components/layout/ArchitectureModal';
import { HomePage } from '@/src/pages/HomePage';

export default function App() {
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header Navigation */}
      <Navbar
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
      />

      {/* Main Page Content */}
      <HomePage
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
      />

      {/* Footer */}
      <Footer
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
      />

      {/* System Architecture Roadmap Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
}
