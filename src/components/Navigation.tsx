'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { trackPageNavigation } from '@/lib/analytics'
import { Logo } from '@/components/Logo'

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/' as const, label: 'Home' },
    { href: '/about' as const, label: 'About' },
    { href: '/blog' as const, label: 'Blog' },
    { href: '/contact' as const, label: 'Contact' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavClick = (page: string) => {
    trackPageNavigation(page);
    setIsMobileMenuOpen(false);
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-apple-gray/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.label.toLowerCase())}
                  className={`px-3 py-2 rounded-apple-sm text-apple-body font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-apple-yellow/20 text-black border border-apple-yellow/30'
                      : 'text-black hover:text-black hover:bg-apple-yellow/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-apple-sm text-apple-gray hover:text-apple-text hover:bg-apple-background focus:outline-none focus:ring-2 focus:ring-apple-yellow focus:ring-offset-2 transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-apple-gray/20">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.label.toLowerCase())}
              className={`block px-3 py-2 rounded-apple-sm text-apple-body font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-apple-yellow/20 text-black border border-apple-yellow/30'
                  : 'text-black hover:text-black hover:bg-apple-yellow/10'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}