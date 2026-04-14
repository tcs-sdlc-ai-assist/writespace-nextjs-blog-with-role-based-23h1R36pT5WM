# Deployment Guide — WriteSpace

## Overview

WriteSpace is a Next.js (App Router) application designed for deployment on **Vercel**. This guide covers environment setup, build configuration, deployment steps, SPA routing considerations, and troubleshooting.

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or **yarn** / **pnpm**)
- A [Vercel](https://vercel.com) account
- Git repository hosted on GitHub, GitLab, or Bitbucket

---

## Environment Setup

### Local Environment Variables

Create a `.env.local` file in the project root for local development:

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

> **Note:** All client-accessible environment variables **must** be prefixed with `NEXT_PUBLIC_`. Server-only variables (database URLs, API secrets) should **not** use this prefix.

### Vercel Environment Variables

In the Vercel dashboard:

1. Navigate to your project → **Settings** → **Environment Variables**
2. Add each variable for the appropriate environment(s): **Production**, **Preview**, **Development**

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Public-facing application URL | Yes |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for API routes | Yes |
| `DATABASE_URL` | Database connection string (server-only) | If using a database |
| `NEXTAUTH_SECRET` | Auth secret for NextAuth.js (server-only) | If using auth |
| `NEXTAUTH_URL` | Canonical URL for auth callbacks | If using auth |

---

## Build Configuration

### Next.js Configuration

The project uses the Next.js App Router. The `next.config.js` should be configured as follows:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
```

### Build & Dev Scripts

Defined in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Vercel Build Settings

Vercel auto-detects Next.js projects. If you need to override settings:

| Setting | Value |
|---|---|
| **Framework Preset** | Next.js |
| **Build Command** | `next build` (or `npm run build`) |
| **Output Directory** | `.next` (auto-detected) |
| **Install Command** | `npm install` (auto-detected) |
| **Node.js Version** | 18.x or 20.x |

---

## Deployment Steps

### Option 1: Git Integration (Recommended)

1. **Connect Repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel auto-detects the Next.js framework

2. **Configure Environment Variables**
   - Add all required environment variables in the Vercel dashboard before the first deployment

3. **Deploy**
   - Click **Deploy** — Vercel runs `npm install` and `npm run build` automatically
   - Every push to `main` triggers a **production deployment**
   - Every push to other branches triggers a **preview deployment**

### Option 2: Vercel CLI

```bash
# Install the Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy from the project root
vercel

# Deploy to production
vercel --prod
```

### Option 3: Manual Deployment

```bash
# Build locally
npm run build

# The .next directory contains the build output
# Use `vercel --prebuilt` if you want to upload a local build
vercel build
vercel deploy --prebuilt --prod
```

---

## Routing Notes

### App Router

WriteSpace uses the **Next.js App Router** (`app/` directory). Key routing behaviors:

- **File-based routing**: Each `page.js` file inside `app/` defines a route
- **Layouts**: `layout.js` files provide shared UI that wraps child routes
- **Loading states**: `loading.js` files provide automatic loading UI during navigation
- **Error boundaries**: `error.js` files catch and display errors per route segment
- **Server Components**: All components in the App Router are **Server Components** by default. Add `"use client"` at the top of a file to make it a Client Component.

### Dynamic Routes

Dynamic segments use folder naming conventions:

```
app/posts/[slug]/page.js    → /posts/my-first-post
app/users/[id]/page.js      → /users/123
```

### API Routes

API routes live under `app/api/`:

```
app/api/posts/route.js       → GET/POST /api/posts
app/api/posts/[id]/route.js  → GET/PUT/DELETE /api/posts/123
```

### SPA-like Navigation

Next.js App Router handles client-side navigation automatically via the `<Link>` component and `useRouter` hook. Unlike traditional SPAs:

- **No catch-all redirect needed**: Vercel natively understands Next.js routing — no `rewrites` or `vercel.json` fallback configuration is required
- **Prefetching**: `<Link>` components automatically prefetch linked routes in production
- **Soft navigation**: Route transitions happen client-side without full page reloads when using `<Link>` or `router.push()`

> **Important:** If you add `output: 'export'` to `next.config.js` for static export, you lose API routes and server-side features. Only use static export if the app is purely client-rendered.

---

## Custom Domain Setup

1. Go to your Vercel project → **Settings** → **Domains**
2. Add your custom domain (e.g., `writespace.app`)
3. Update DNS records as instructed by Vercel:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
4. SSL certificates are provisioned automatically

---

## Performance Optimization

### Recommended Practices

- **Image Optimization**: Use `next/image` for automatic image optimization and lazy loading
- **Font Optimization**: Use `next/font` to self-host fonts with zero layout shift
- **Metadata**: Use the `metadata` export or `generateMetadata` function in `layout.js` / `page.js` for SEO
- **Caching**: Leverage Next.js built-in caching for `fetch()` calls in Server Components
- **Bundle Analysis**: Run `ANALYZE=true npm run build` (requires `@next/bundle-analyzer`)

### Vercel-Specific Optimizations

- **Edge Functions**: Use `export const runtime = 'edge'` in API routes for lower latency
- **ISR (Incremental Static Regeneration)**: Use `revalidate` in `fetch()` options or page-level `export const revalidate = 60`
- **Vercel Analytics**: Add `@vercel/analytics` for Web Vitals monitoring

---

## Troubleshooting

### Build Failures

| Issue | Solution |
|---|---|
| `Module not found` | Verify all imports match actual file paths (case-sensitive on Linux/Vercel) |
| `"use client"` errors | Ensure Client Components that use hooks (`useState`, `useEffect`, etc.) have `"use client"` at the top |
| Environment variable undefined | Confirm the variable is set in Vercel dashboard for the correct environment. Client-side vars must start with `NEXT_PUBLIC_` |
| Build timeout | Vercel free tier has a 45-minute build limit. Optimize build by reducing dependencies or using caching |
| Node.js version mismatch | Set the Node.js version in Vercel project settings or add `"engines": { "node": ">=18" }` to `package.json` |

### Runtime Errors

| Issue | Solution |
|---|---|
| 404 on dynamic routes | Ensure `[param]` folder naming is correct and `page.js` exists inside it |
| API route returns 405 | Verify you export the correct HTTP method handler (`GET`, `POST`, etc.) from `route.js` |
| Hydration mismatch | Avoid rendering browser-only values (e.g., `window`, `localStorage`) during server render. Wrap in `useEffect` or check `typeof window !== 'undefined'` |
| CORS errors | Add appropriate headers in API route responses or use `next.config.js` headers configuration |
| Stale data after deploy | Clear the Vercel cache: **Settings** → **Data Cache** → **Purge Everything**, or redeploy with `vercel --force` |

### Preview Deployments

- Preview deployments use a unique URL (e.g., `project-git-branch.vercel.app`)
- Environment variables scoped to **Preview** apply to these deployments
- Use Vercel's **Comments** feature to collaborate on preview URLs

### Logs & Monitoring

- **Build Logs**: Available in the Vercel dashboard under each deployment
- **Runtime Logs**: Go to your project → **Logs** tab for real-time function logs
- **Vercel Analytics**: Enable in project settings for performance monitoring
- **Error Tracking**: Consider integrating Sentry or a similar service for production error tracking

---

## Rollback

If a deployment introduces issues:

1. Go to your project → **Deployments** tab
2. Find the last known good deployment
3. Click the **⋮** menu → **Promote to Production**

This instantly rolls back production to the selected deployment with zero downtime.

---

## CI/CD Integration

For additional CI checks before deployment, add a `vercel.json` in the project root:

```json
{
  "github": {
    "silent": true
  }
}
```

Or configure GitHub Actions to run tests before Vercel deploys:

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

---

## Support

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)