/* ============================================
   Header Component
   Glassmorphism navigation bar with brand
   ============================================ */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-surface-950/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Logo icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow duration-300">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xl font-display font-bold gradient-text">
            RateMyResume
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-surface-300 hover:text-white transition-colors duration-200 text-sm font-medium">
            Home
          </Link>
          <Link href="#features" className="text-surface-300 hover:text-white transition-colors duration-200 text-sm font-medium">
            Features
          </Link>
          <Link href="#how-it-works" className="text-surface-300 hover:text-white transition-colors duration-200 text-sm font-medium">
            How It Works
          </Link>
        </div>

        {/* CTA */}
        <Link href="#upload" className="btn-glow text-sm !px-6 !py-2.5">
          <span>Analyze Resume</span>
        </Link>
      </nav>
    </header>
  );
}
