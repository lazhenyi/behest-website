# Deployment

## Build for Production

```bash
./build.sh
```

This will create a `doc_build` directory with the production build.

## Deploy to GitHub Pages

1. Build the website:
   ```bash
   ./build.sh
   ```

2. Push the `doc_build` directory to the `gh-pages` branch:
   ```bash
   cd doc_build
   git init
   git add -A
   git commit -m 'deploy'
   git push -f git@github.com:lazhenyi/behest.git main:gh-pages
   ```

## Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set the build command to `pnpm build`
3. Set the output directory to `doc_build`
4. Deploy!

## Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set the build command to `pnpm build`
3. Set the publish directory to `doc_build`
4. Deploy!

## Environment Variables

No environment variables are required for the basic build.

## Custom Domain

To use a custom domain, add a `CNAME` file to the `docs/public` directory with your domain name.
