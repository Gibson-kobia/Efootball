'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/me')
      .then(res => res.ok)
      .then(ok => setIsLoggedIn(ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/rules', label: 'Rules' },
    { href: '/prizes', label: 'Prizes' },
    { href: '/bracket', label: 'Bracket' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-dark-blue/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gradient glow-text">
              EFOOTBALL SHOWDOWN
            </span>
            <span className="text-xs text-neon-green">2025</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg transition-all ${
                  pathname === link.href
                    ? 'text-neon-green font-bold'
                    : 'text-gray-300 hover:text-neon-green'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="btn-secondary text-sm">
                  Dashboard
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button type="submit" className="btn-primary text-sm">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-neon-green transition">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neon-green"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-lg ${
                  pathname === link.href
                    ? 'text-neon-green font-bold bg-gray-800'
                    : 'text-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-800 space-y-2">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-lg text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <form action="/api/auth/logout" method="post">
                    <button
                      type="submit"
                      className="w-full text-left px-3 py-2 rounded-lg text-neon-green"
                    >
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-lg text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-lg bg-neon-green text-black font-bold text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

