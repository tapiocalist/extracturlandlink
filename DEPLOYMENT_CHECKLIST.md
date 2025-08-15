# Deployment Checklist

## Pre-Deployment Checklist

### Environment Setup
- [ ] Copy `.env.production.example` to `.env.production.local`
- [ ] Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` with actual Google Analytics ID
- [ ] Set `NEXT_PUBLIC_APP_URL` with production domain
- [ ] Verify all environment variables are configured

### Code Quality
- [ ] Run `npm run lint` - no errors
- [ ] Run `npm run test:run` - all tests pass
- [ ] Run `npm run build` - build succeeds
- [ ] Run `npm run validate:build` - validation passes

### Security Configuration
- [ ] Content Security Policy headers configured
- [ ] Security headers in place (X-Frame-Options, etc.)
- [ ] HTTPS enforced via Strict-Transport-Security
- [ ] X-Powered-By header disabled

## Vercel Deployment Steps

### Initial Setup
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link Project**
   ```bash
   vercel link
   ```

### Environment Variables in Vercel Dashboard
Set these in Project Settings > Environment Variables:

**Production Environment:**
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX` (your actual GA ID)
- `NEXT_PUBLIC_APP_URL` = `https://your-domain.com`
- `NODE_ENV` = `production`
- `NEXT_PUBLIC_ENABLE_ANALYTICS` = `true`
- `NEXT_PUBLIC_ENABLE_CSP` = `true`

**Preview Environment:**
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX` (can be test ID)
- `NEXT_PUBLIC_APP_URL` = `https://your-preview-domain.vercel.app`
- `NODE_ENV` = `preview`
- `NEXT_PUBLIC_ENABLE_ANALYTICS` = `false`

### Deployment Commands
```bash
# Preview deployment
npm run deploy:preview

# Production deployment
npm run deploy:production
```

## Custom Domain Setup

### DNS Configuration
1. **Add Domain in Vercel Dashboard**
   - Go to Project Settings > Domains
   - Add your custom domain

2. **Configure DNS Records**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS Propagation** (24-48 hours)

## Post-Deployment Verification

### Functionality Tests
- [ ] Homepage loads correctly
- [ ] URL extraction works with sample content
- [ ] Copy to clipboard functionality works
- [ ] Open all URLs functionality works
- [ ] Navigation between pages works
- [ ] Mobile responsive design works

### Performance Tests
- [ ] Page load speed < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Bundle size optimized

### Security Tests
- [ ] Security headers present (check with securityheaders.com)
- [ ] HTTPS enforced
- [ ] CSP headers working
- [ ] No console errors or warnings

### Analytics Tests
- [ ] Google Analytics tracking works
- [ ] Page views recorded
- [ ] Custom events tracked
- [ ] Privacy compliance (GDPR/CCPA)

## Monitoring Setup

### Vercel Analytics
- [ ] Enable Vercel Analytics in dashboard
- [ ] Configure performance monitoring
- [ ] Set up error tracking

### Google Analytics
- [ ] Verify tracking code installation
- [ ] Set up goals and conversions
- [ ] Configure privacy settings

## Rollback Plan

### Emergency Rollback
1. **Via Vercel Dashboard**
   - Go to Deployments tab
   - Find previous stable deployment
   - Click "Promote to Production"

2. **Via CLI**
   ```bash
   vercel rollback [deployment-url]
   ```

### Troubleshooting Common Issues

**Build Failures:**
- Check TypeScript errors: `npm run build`
- Verify dependencies: `npm install`
- Check environment variables

**Domain Issues:**
- Verify DNS records
- Check domain status in Vercel dashboard
- Wait for DNS propagation

**Performance Issues:**
- Check bundle analyzer: `npm run build:analyze`
- Optimize images and assets
- Review Core Web Vitals

## Support Contacts

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Next.js Documentation:** [nextjs.org/docs](https://nextjs.org/docs)
- **Project Repository:** [Link to your repo]

## Deployment History

| Date | Version | Environment | Status | Notes |
|------|---------|-------------|--------|-------|
| YYYY-MM-DD | 1.0.0 | Production | ✅ | Initial deployment |

---

**Last Updated:** [Current Date]
**Deployment Status:** Ready for Production ✅