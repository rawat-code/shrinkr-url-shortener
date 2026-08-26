# Deployment

Deploy the Next.js app to Vercel, set the variables in `.env.example`, provision PostgreSQL and Upstash Redis, run `npx prisma migrate deploy`, and configure Google OAuth callback URLs. Add the Sentry DSN to the Vercel project. CI should run `npm ci`, `npm run lint`, `npm run typecheck`, unit tests, and `npm run build`.