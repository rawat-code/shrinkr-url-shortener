# Shrinkr

Fast, secure URL shortener with analytics and custom aliases, built on Next.js.

🔗 **Live demo:** [shrinkr-url-shortener.vercel.app](https://shrinkr-url-shortener.vercel.app)

## Features

- 🔗 Shorten any `http`/`https` URL, with optional custom aliases (lowercase, globally unique, reserved routes blocked)
- ⚡ Fast redirects — short codes resolve from Redis first, falling back to PostgreSQL
- 🔐 Google sign-in via NextAuth, with separate rate limits for anonymous and authenticated users
- 📊 Click analytics, decoupled from redirect resolution so it can move to a queue/analytics store later
- 🛡️ Structured error handling for inactive or expired links
- 🚦 Configurable rate limiting per time window

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL via [Prisma](https://www.prisma.io) |
| Cache / rate limiting | Redis ([Upstash](https://upstash.com)) |
| Auth | [NextAuth](https://next-auth.js.org) (Google OAuth) |
| Error tracking | Sentry |
| Testing | Vitest (unit) + Playwright (e2e) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL database
- An Upstash Redis instance
- A Google OAuth client (for sign-in)

### Installation

```bash
git clone https://github.com/rawat-code/shrinkr-url-shortener.git
cd shrinkr-url-shortener
npm install
```

### Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_URL` | Direct (non-pooled) PostgreSQL connection, used by Prisma migrations |
| `REDIS_URL` / `REDIS_TOKEN` | Upstash Redis credentials |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | NextAuth session config |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `NEXT_PUBLIC_APP_URL` | Public base URL of the app |
| `SENTRY_DSN` | Sentry error tracking DSN |
| `URL_CODE_LENGTH` | Length of generated short codes |
| `ANONYMOUS_URL_LIMIT` / `AUTHENTICATED_URL_LIMIT` | Max URLs per user type, per window |
| `RATE_LIMIT_WINDOW_SECONDS` | Rate limit window, in seconds |

### Set up the database

```bash
npm run db:generate
npm run db:migrate
npm run db:seed   # optional
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler in check mode |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database |

## API

```
POST /api/urls
```
Creates a short URL. Body: `{ "originalUrl": "https://example.com", "customAlias": "docs" }`. Only `http`/`https` schemes are accepted; aliases must be lowercase, globally unique, and not a reserved route.

```
GET /api/urls
```
Returns the current user's URLs.

```
GET /:shortCode
```
302-redirects to the destination if the mapping is active and not expired, otherwise returns a structured 404.

See [`API.md`](./API.md) for the full reference.

## Architecture

The App Router owns the HTTP boundary — route handlers validate input and delegate to services and repositories. The redirect path checks Redis before falling back to PostgreSQL, and click tracking is kept separate from redirect resolution. See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for details.

## Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Security

See [`SECURITY.md`](./SECURITY.md) for the security policy and how to report vulnerabilities.

## License

Licensed under the [MIT License](./LICENSE).
