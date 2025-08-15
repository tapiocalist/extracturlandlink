import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'apple-yellow': '#FFD60A',
        'apple-gray': '#8E8E93',
        'content-gray': 'rgb(68, 65, 65)',
        'apple-background': '#F2F2F7',
        'apple-text': '#1C1C1E',
        'apple-secondary': '#3A3A3C',
        'apple-blue': '#007AFF',
        'apple-green': '#30D158',
        'apple-orange': '#FF9F0A',
        'apple-red': '#FF3B30',
        'apple-purple': '#BF5AF2',
      },
      fontFamily: {
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'apple-caption2': ['0.6875rem', { lineHeight: '1.09091', letterSpacing: '0.066em' }],
        'apple-caption1': ['0.75rem', { lineHeight: '1.33333', letterSpacing: '0.024em' }],
        'apple-footnote': ['0.8125rem', { lineHeight: '1.23077', letterSpacing: '0.012em' }],
        'apple-subheadline': ['0.9375rem', { lineHeight: '1.26667', letterSpacing: '0.003em' }],
        'apple-callout': ['1rem', { lineHeight: '1.25', letterSpacing: '-0.012em' }],
        'apple-body': ['1.0625rem', { lineHeight: '1.23529', letterSpacing: '-0.022em' }],
        'apple-headline': ['1.125rem', { lineHeight: '1.22222', letterSpacing: '0.009em' }],
        'apple-title3': ['1.25rem', { lineHeight: '1.2', letterSpacing: '0.004em' }],
        'apple-title2': ['1.375rem', { lineHeight: '1.18182', letterSpacing: '-0.003em' }],
        'apple-title1': ['1.75rem', { lineHeight: '1.14286', letterSpacing: '-0.022em' }],
        'apple-large-title': ['2.125rem', { lineHeight: '1.11765', letterSpacing: '-0.022em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        // Apple's 8px grid system
        '1.5': '0.375rem', // 6px
        '2.5': '0.625rem', // 10px
        '3.5': '0.875rem', // 14px
        '4.5': '1.125rem', // 18px
        '5.5': '1.375rem', // 22px
        '6.5': '1.625rem', // 26px
        '7.5': '1.875rem', // 30px
        '8.5': '2.125rem', // 34px
        '9.5': '2.375rem', // 38px
        '11': '2.75rem',   // 44px (Apple's minimum touch target)
        '13': '3.25rem',   // 52px
        '15': '3.75rem',   // 60px
        '17': '4.25rem',   // 68px
        '19': '4.75rem',   // 76px
      },
      borderRadius: {
        'apple': '12px',
        'apple-sm': '8px',
        'apple-lg': '16px',
        'apple-xl': '20px',
      },
      boxShadow: {
        'apple': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'apple-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'apple-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config