import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Navigation from '../Navigation';

// Mock Next.js navigation hooks
const mockPush = vi.fn();
const mockPathname = '/';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Link component
vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href, onClick, className }: any) => (
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
    ),
  };
});

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  trackPageNavigation: vi.fn(),
}));

import { trackPageNavigation } from '@/lib/analytics';
const mockTrackPageNavigation = trackPageNavigation as ReturnType<typeof vi.fn>;

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all navigation items', () => {
    render(<Navigation />);
    
    expect(screen.getByText('URL Extractor')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    render(<Navigation />);
    
    const homeLink = screen.getAllByText('Home')[0]; // Get desktop version
    expect(homeLink).toHaveClass('bg-apple-yellow');
  });

  it('shows mobile menu button on mobile', () => {
    render(<Navigation />);
    
    const menuButton = screen.getByRole('button', { name: /open main menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', () => {
    render(<Navigation />);
    
    const menuButton = screen.getByRole('button', { name: /open main menu/i });
    
    // Initially mobile menu should be hidden
    expect(screen.getByText('Home').closest('div')).toHaveClass('hidden');
    
    // Click to open
    fireEvent.click(menuButton);
    expect(screen.getByText('Home').closest('div')).toHaveClass('block');
    
    // Click to close
    fireEvent.click(menuButton);
    expect(screen.getByText('Home').closest('div')).toHaveClass('hidden');
  });

  it('closes mobile menu when navigation item is clicked', () => {
    render(<Navigation />);
    
    const menuButton = screen.getByRole('button', { name: /open main menu/i });
    
    // Open mobile menu
    fireEvent.click(menuButton);
    expect(screen.getByText('Home').closest('div')).toHaveClass('block');
    
    // Click on a navigation item in mobile menu
    const mobileHomeLink = screen.getAllByText('Home')[1]; // Get mobile version
    fireEvent.click(mobileHomeLink);
    
    // Menu should close
    expect(screen.getByText('Home').closest('div')).toHaveClass('hidden');
  });

  it('tracks navigation clicks', () => {
    render(<Navigation />);
    
    const aboutLink = screen.getAllByText('About')[0]; // Get desktop version
    fireEvent.click(aboutLink);
    
    expect(mockTrackPageNavigation).toHaveBeenCalledWith('about');
  });

  it('has proper accessibility attributes', () => {
    render(<Navigation />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    const menuButton = screen.getByRole('button', { name: /open main menu/i });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows correct hamburger/close icons', () => {
    render(<Navigation />);
    
    const menuButton = screen.getByRole('button', { name: /open main menu/i });
    
    // Initially should show hamburger icon
    const hamburgerIcon = menuButton.querySelector('svg.block');
    const closeIcon = menuButton.querySelector('svg.hidden');
    expect(hamburgerIcon).toBeInTheDocument();
    expect(closeIcon).toBeInTheDocument();
    
    // After clicking, icons should toggle
    fireEvent.click(menuButton);
    
    const hamburgerIconAfter = menuButton.querySelector('svg.hidden');
    const closeIconAfter = menuButton.querySelector('svg.block');
    expect(hamburgerIconAfter).toBeInTheDocument();
    expect(closeIconAfter).toBeInTheDocument();
  });

  it('applies correct styling for active and inactive links', () => {
    render(<Navigation />);
    
    const homeLink = screen.getAllByText('Home')[0];
    const aboutLink = screen.getAllByText('About')[0];
    
    // Home should be active (highlighted)
    expect(homeLink).toHaveClass('bg-apple-yellow', 'text-apple-text');
    
    // About should be inactive
    expect(aboutLink).toHaveClass('text-apple-gray');
    expect(aboutLink).not.toHaveClass('bg-apple-yellow');
  });
});