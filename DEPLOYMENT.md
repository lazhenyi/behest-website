# Deployment Guide

## Vercel Deployment

This project is optimized for deployment on Vercel.

### Automatic Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the repository in Vercel
3. Vercel will automatically detect the Next.js framework and deploy

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel
```

### Configuration

The `vercel.json` file is already configured for this project:

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "outputDirectory": ".next"
}
```

## Environment Variables

No environment variables are required for basic deployment. If you need to add analytics or other services, add the environment variables in the Vercel dashboard.

## Custom Domain

To add a custom domain:

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

## Performance Optimization

The project is already optimized for production:

- Static site generation (SSG) for all documentation pages
- Automatic code splitting
- Image optimization (disabled for static export)
- CSS optimization with Tailwind CSS

## Monitoring

Vercel Analytics and Speed Insights are included:

- **Vercel Analytics** - Track page views and user behavior
- **Speed Insights** - Monitor Core Web Vitals

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Check the build logs in Vercel dashboard
2. Run `pnpm build` locally to reproduce
3. Ensure all dependencies are installed

### Routing Issues

The project uses Next.js App Router with i18n support. If routes aren't working:

1. Check the middleware configuration
2. Verify the `[lang]` dynamic route
3. Ensure dictionary files are present

### Styling Issues

If styles aren't loading:

1. Check Tailwind CSS configuration
2. Verify `globals.css` is imported
3. Clear browser cache
