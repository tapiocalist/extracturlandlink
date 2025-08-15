# Design Document

## Overview

The URL Extractor is a Next.js 15 web application that provides a simple, efficient way to extract URLs from hyperlinked text content. The application follows Apple's design principles with a yellow and gray color scheme, prioritizing desktop experience while maintaining mobile responsiveness.

## Architecture

### Technology Stack
- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Analytics**: Google Analytics

### Application Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Homepage with main functionality
│   ├── about/
│   │   └── page.tsx        # About page
│   └── contact/
│       └── page.tsx        # Contact page
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── URLExtractor.tsx    # Main extraction component
│   ├── URLList.tsx         # URL display and management
│   └── Navigation.tsx      # Top navigation
├── lib/
│   ├── url-parser.ts       # URL extraction logic
│   ├── clipboard.ts        # Clipboard operations
│   └── types.ts            # TypeScript definitions
└── styles/
    └── globals.css         # Global styles and Tailwind config
```

## Components and Interfaces

### Core Components

#### URLExtractor Component
```typescript
interface URLExtractorProps {
  onURLsExtracted: (urls: ExtractedURL[]) => void;
}

interface URLExtractorState {
  inputContent: string;
  isLoading: boolean;
  error: string | null;
  extractedUrls: ExtractedURL[];
}
```

**Responsibilities:**
- Handle text input with HTML formatting preservation
- Parse and extract URLs from hyperlinked content
- Display original content with blue hyperlinks
- Manage extraction state and error handling

#### URLList Component
```typescript
interface URLListProps {
  urls: ExtractedURL[];
  onUrlsChange: (urls: ExtractedURL[]) => void;
  onCopyAll: () => void;
  onOpenAll: () => void;
}
```

**Responsibilities:**
- Display extracted URLs in an editable list
- Handle individual URL deletion and modification
- Provide bulk actions (Copy All, Open All)
- Manage URL list state

#### Navigation Component
```typescript
interface NavigationProps {
  currentPath: string;
}
```

**Responsibilities:**
- Render top navigation with Apple-style design
- Handle routing between pages
- Maintain consistent branding

### Utility Functions

#### URL Parser
```typescript
interface ParsedContent {
  originalHtml: string;
  extractedUrls: ExtractedURL[];
}

function parseHyperlinkedContent(content: string): ParsedContent;
function validateUrl(url: string): boolean;
function sanitizeHtml(html: string): string;
```

#### Clipboard Manager
```typescript
function copyToClipboard(text: string): Promise<boolean>;
function pasteFromClipboard(): Promise<string>;
function handleClipboardPermissions(): Promise<boolean>;
```

## Data Models

### ExtractedURL Interface
```typescript
interface ExtractedURL {
  id: string;
  url: string;
  displayText: string;
  isValid: boolean;
  originalIndex: number;
}
```

### ApplicationState Interface
```typescript
interface ApplicationState {
  inputContent: string;
  extractedUrls: ExtractedURL[];
  isProcessing: boolean;
  error: string | null;
  clipboardSupported: boolean;
}
```

### Configuration Types
```typescript
interface AppConfig {
  maxContentLength: number;
  maxUrlCount: number;
  supportedBrowsers: string[];
  analytics: {
    enabled: boolean;
    trackingId: string;
  };
}
```

## Error Handling

### Error Types
```typescript
enum ErrorType {
  PARSING_ERROR = 'PARSING_ERROR',
  CLIPBOARD_ERROR = 'CLIPBOARD_ERROR',
  BROWSER_COMPATIBILITY = 'BROWSER_COMPATIBILITY',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

interface AppError {
  type: ErrorType;
  message: string;
  recoverable: boolean;
}
```

### Error Handling Strategy
1. **Parsing Errors**: Display "ERROR, PLEASE TRY AGAIN" with option to clear input
2. **Clipboard Errors**: Fallback to manual copy with user instructions
3. **Browser Compatibility**: Graceful degradation with feature detection
4. **Popup Blocking**: Inform user and provide alternative opening methods

### Error Boundaries
- Implement React Error Boundaries for component-level error catching
- Global error handler for unhandled promise rejections
- Logging integration for production error monitoring

## Testing Strategy

### Unit Testing
- **URL Parser**: Test various input formats (HTML, plain text, mixed content)
- **Clipboard Operations**: Mock clipboard API and test fallbacks
- **URL Validation**: Test edge cases and malformed URLs
- **Component Logic**: Test state management and user interactions

### Integration Testing
- **End-to-End Workflows**: Complete user journey from paste to URL opening
- **Browser Compatibility**: Automated testing across target browsers
- **Responsive Design**: Test layouts across different screen sizes
- **Error Scenarios**: Test error handling and recovery flows

### Performance Testing
- **Large Content Handling**: Test with substantial amounts of hyperlinked text
- **Multiple URL Processing**: Verify performance with many extracted URLs
- **Memory Usage**: Monitor for memory leaks during extended usage

## User Experience Design

### Apple-Style Design System
- **Typography**: San Francisco font family with appropriate weights
- **Spacing**: 8px grid system following Apple's spacing principles
- **Colors**: 
  - Primary Yellow: #FFD60A (Apple-inspired yellow)
  - Secondary Gray: #8E8E93 (Apple system gray)
  - Background: #F2F2F7 (Apple light background)
  - Text: #1C1C1E (Apple primary text)

### Simplified Color Scheme for Icons and UI Elements (IMPLEMENTED)
- **Primary Palette**: Yellow (#FFD60A) + White/Black combinations only
- **Icon Colors**: 
  - Primary actions: Yellow backgrounds with black icons
  - Secondary actions: Black icons with hover states on white backgrounds
  - Eliminated: Blue, green, red, and other accent colors
- **Numbers and Indicators**: Yellow circular badges with black text (replacing "Valid" status)
- **Interactive Elements**: Yellow for primary actions, black/white for secondary
- **Links**: Black text with underlines (replacing blue links)
- **Feedback Messages**: Yellow background with black text
- **Consistency Rule**: Maximum of 2 colors per UI element (yellow + black/white)

### Implementation Details
- **URL Numbers**: Circular yellow badges (1, 2, 3...) replace green "Valid" status indicators
- **Action Icons**: Copy, edit, delete buttons use yellow + black or black + white only
- **Hyperlinks**: All links use black text with underlines instead of blue
- **Focus States**: Yellow outline for accessibility instead of blue
- **Button Variants**: Primary (yellow + black), Outline (black border + black text)

### Layout Structure
- **Header**: Top navigation with logo and page links
- **Main Content**: Centered layout with maximum width constraints
- **Input Section**: Large textarea with clear labeling
- **Action Buttons**: Prominent "GET URL" button with Apple-style styling
- **Results Section**: Clean list layout with individual URL controls

### Responsive Breakpoints
- **Desktop**: 1024px+ (primary focus)
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

### Accessibility
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliance for all text and UI elements
- **Focus Management**: Clear focus indicators and logical tab order

## Security Considerations

### Input Sanitization
- HTML sanitization to prevent XSS attacks
- URL validation to prevent malicious redirects
- Content length limits to prevent DoS attacks

### Browser Security
- Respect browser popup blocking policies
- Handle clipboard permissions appropriately
- Implement Content Security Policy headers

### Privacy
- No data storage or tracking beyond Google Analytics
- Client-side only processing of user content
- Clear privacy policy regarding data handling