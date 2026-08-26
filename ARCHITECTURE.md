# Architecture

The App Router owns the HTTP boundary. Route handlers validate input, then delegate to services and repositories. The redirect route resolves a short code from Redis first and falls back to PostgreSQL; click collection is deliberately separate from destination resolution so it can move to a queue or analytics store later.

`src/lib/urls.ts` currently provides a dependency-free local repository for development. The Prisma schema in `prisma/schema.prisma` is the production persistence contract. Replace the repository implementation with Prisma and add an Upstash adapter without changing route consumers.