'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm'
        : 'bg-white dark:bg-gray-900'} border-b border-gray-200/70 dark:border-gray-800/70`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark hover-lift">
              BaseSave
            </Link>
            <div className="ml-2 flex items-center">
              <img
                src="/base-logo.svg"
                alt="Base"
                className="h-5 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            href="/goals"
            className="px-4 py-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 dark:text-gray-300 dark:hover:text-primary dark:hover:bg-primary/10 transition-colors"
          >
            My Goals
          </Link>
          <Link
            href="/create"
            className="px-4 py-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 dark:text-gray-300 dark:hover:text-primary dark:hover:bg-primary/10 transition-colors"
          >
            Create Goal
          </Link>
          <Link
            href="/rewards"
            className="px-4 py-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 dark:text-gray-300 dark:hover:text-primary dark:hover:bg-primary/10 transition-colors"
          >
            Rewards
          </Link>
        </nav>

        {/* Connect Button & Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <ConnectButton showBalance={false} />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`}
            >
              {mobileMenuOpen ? (
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 border-t border-gray-200 dark:border-gray-800' : 'max-h-0'}`}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/goals"
              className="px-4 py-3 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 dark:text-gray-300 dark:hover:text-primary dark:hover:bg-primary/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Goals
            </Link>
            <Link
              href="/create"
              className="px-4 py-3 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 dark:text-gray-300 dark:hover:text-primary dark:hover:bg-primary/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Goal
            </Link>
            <Link
              href="/rewards"
              className="px-4 py-3 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 dark:text-gray-300 dark:hover:text-primary dark:hover:bg-primary/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Rewards
            </Link>
          </nav>

          <div className="py-2">
            <ConnectButton showBalance={false} chainStatus="icon" />
          </div>
        </div>
      </div>
    </header>
  );
}
