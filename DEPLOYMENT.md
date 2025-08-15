# Deployment Guide

## Overview

This document outlines the deployment process for the URL Extractor application using Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Environment Variables**: Configure required environment variables

## Environment Variables

### Required Variables

Copy `.env.production.example` to `.env.production.local` and update:

```bash
# Google Analytics (required for production)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Vercel Environment Variables

Set these in your Vercel dashboard under Project Settings > Environment Variables:

1. `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Your Google Analytics Measurement ID
2. `NEXT_PUBLIC_APP_URL` - Your production domain URL
3. `NODE_ENV` - Set to "production"

## Deployment Steps

### 1. Initial Setup

```bash
# Login to Vercel
vercel login

# Link your project
vercel link
```

### 2. Preview Deployment

```bash
# Deploy to preview environment
npm run deploy:preview
# or
vercel
```

### 3. Production Deployment

```bash
# Deploy to production
npm run deploy:production
# or
vercel --prod
```

### 4. Custom Domain Setup

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to Settings > Domains
4. Add your custom domain
5. Configure DNS records as instructed by Vercel

## Domain Configuration

### DNS Records

For a custom domain, configure these DNS records:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### SSL Certificates

Vercel automatically provisions SSL certificates for:
- All `.vercel.app` domains
- Custom domains added through the dashboard

## Security Headers

The application includes comprehensive security headers:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build:analyze

# Production build
npm run build:production
```

### Vercel Configuration

The `vercel.json` file includes:
- Build configuration
- Route handling
- Security headers
- Environment variables

## Monitoring and Analytics

### Google Analytics

Ensure `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set for production analytics.

### Vercel Analytics

Enable Vercel Analytics in your project dashboard for:
- Performance monitoring
- User analytics
- Error tracking

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npm run lint`
   - Verify all dependencies: `npm install`
   - Test build locally: `npm run build`

2. **Environment Variables**
   - Ensure all required variables are set in Vercel dashboard
   - Check variable names match exactly (case-sensitive)
   - Redeploy after changing environment variables

3. **Domain Issues**
   - Verify DNS records are correctly configured
   - Allow 24-48 hours for DNS propagation
   - Check domain status in Vercel dashboard

### Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Next.js Documentation: [nextjs.org/docs](https://nextjs.org/docs)
- Project Issues: Create an issue in the repository

## Rollback Process

If issues occur after deployment:

1. **Revert to Previous Deployment**
   ```bash
   vercel rollback [deployment-url]
   ```

2. **Emergency Rollback**
   - Go to Vercel dashboard
   - Select Deployments tab
   - Click "Promote to Production" on a previous stable deployment

## Post-Deployment Checklist

- [ ] Verify application loads correctly
- [ ] Test URL extraction functionality
- [ ] Check Google Analytics tracking
- [ ] Verify all pages are accessible
- [ ] Test responsive design on mobile
- [ ] Confirm security headers are present
- [ ] Test clipboard functionality
- [ ] Verify error handling works
- [ ] Check performance metrics
- [ ] Test custom domain (if applicable)