# URL Extractor

A Next.js 15 web application that helps users extract URLs from hyperlinked text content copied from various sources like Google Sheets, documents, Excel files, or any text with embedded hyperlinks.

## Features

- **URL Extraction**: Parse hyperlinked content and extract all URLs
- **Visual Display**: Show original content with blue hyperlinks preserved
- **URL Management**: Edit, delete, and organize extracted URLs
- **Bulk Operations**: Copy all URLs or open all URLs at once
- **Apple-Style Design**: Clean, modern interface with yellow and gray color scheme
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Privacy-First**: Client-side processing, no data storage
- **Analytics**: Google Analytics integration with privacy compliance

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd url-extractor

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Required for production
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional configuration
NEXT_PUBLIC_MAX_CONTENT_LENGTH=50000
NEXT_PUBLIC_MAX_URL_COUNT=100
```

## Usage

1. **Paste Content**: Copy hyperlinked text from any source and paste it into the text area
2. **Extract URLs**: Click the "GET URL" button to extract all embedded links
3. **Manage URLs**: Edit, delete, or organize the extracted URLs as needed
4. **Take Action**: Copy all URLs to clipboard or open them all in new tabs

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:run     # Run tests once
npm run validate:build # Validate build configuration
```

### Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── URLExtractor.tsx  # Main extraction component
│   ├── URLList.tsx       # URL management component
│   └── Navigation.tsx    # Navigation component
├── lib/                  # Utility functions
│   ├── url-parser.ts     # URL extraction logic
│   ├── clipboard.ts      # Clipboard operations
│   ├── analytics.ts      # Google Analytics
│   └── types.ts          # TypeScript definitions
└── styles/
    └── globals.css       # Global styles
```

### Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:run

# Run specific test file
npm run test url-parser.test.ts
```

## Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Preview**
   ```bash
   npm run deploy:preview
   ```

3. **Deploy to Production**
   ```bash
   npm run deploy:production
   ```

### Environment Variables for Production

Set these in your Vercel dashboard:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics Measurement ID
- `NEXT_PUBLIC_APP_URL` - Your production domain
- `NODE_ENV` - Set to "production"

### Custom Domain Setup

1. Add domain in Vercel dashboard
2. Configure DNS records:
   ```
   Type: A, Name: @, Value: 76.76.19.61
   Type: CNAME, Name: www, Value: cname.vercel-dns.com
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Security

The application includes comprehensive security measures:

- **Content Security Policy (CSP)** headers
- **Security headers** (X-Frame-Options, X-XSS-Protection, etc.)
- **HTTPS enforcement** via Strict-Transport-Security
- **Input sanitization** to prevent XSS attacks
- **Privacy-compliant analytics** with user consent

## Performance

- **Optimized bundle size** with Next.js 15
- **Static generation** for better performance
- **Responsive images** and lazy loading
- **Core Web Vitals** optimization
- **Performance monitoring** with Vercel Analytics

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Maintain Apple-style design consistency
- Ensure mobile responsiveness
- Follow accessibility guidelines (WCAG 2.1)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Check the [docs](./docs) folder
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

## Changelog

### v1.0.0 (Current)
- Initial release
- URL extraction from hyperlinked content
- Apple-style design implementation
- Mobile responsive design
- Google Analytics integration
- Comprehensive security headers
- Vercel deployment configuration

---

**Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS**