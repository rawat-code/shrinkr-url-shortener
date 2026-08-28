
# Security Policy

## Reporting a Vulnerability

If you find a security vulnerability in Shrinkr, please report it privately rather than opening a public issue.

- Open a [GitHub Security Advisory](https://github.com/rawat-code/shrinkr-url-shortener/security/advisories/new) for this repository, **or**
- Email the maintainer with details (replace with your preferred contact address)

Please include:
- A description of the vulnerability and its potential impact
- Steps to reproduce it
- Any relevant logs, requests, or proof-of-concept code

You should receive an acknowledgement within a few days. Please don't disclose the issue publicly until it's been addressed.

## Supported Versions

Shrinkr does not currently maintain multiple release lines. Security fixes are applied to the `main` branch and deployed to production as soon as they're available.

| Version | Supported |
|---|---|
| `main` | ✅ |

## Scope

This policy covers the application code in this repository — the Next.js app, API routes, and Prisma schema. It does not cover the security of third-party infrastructure providers (Vercel, your Postgres host, Upstash) beyond how this app is configured to use them.

## Security Measures in Place

- **Input validation** — `POST /api/urls` only accepts `http`/`https` schemes; custom aliases are normalized to lowercase, checked for global uniqueness, and validated against a reserved-route list to prevent path collisions or spoofing of app routes.
- **Authentication** — sign-in is handled via NextAuth using Google OAuth; no passwords are stored by the application.
- **Rate limiting** — requests are throttled per `RATE_LIMIT_WINDOW_SECONDS`, with separate, lower limits for anonymous users (`ANONYMOUS_URL_LIMIT`) than authenticated users (`AUTHENTICATED_URL_LIMIT`), to reduce abuse and enumeration.
- **Redirect integrity** — `GET /:shortCode` only redirects for links that are active and not expired; invalid or expired codes return a structured 404 instead of leaking internal state.
- **Secrets management** — credentials (database, Redis, OAuth, `NEXTAUTH_SECRET`) are supplied via environment variables and are never committed to the repository (see `.env.example` for the required keys, all left blank).
- **Error monitoring** — runtime errors are reported to Sentry via `SENTRY_DSN` for early detection of anomalous behavior.

## Reporting Abuse (Malicious Short Links)

If you encounter a Shrinkr-generated short link that points to phishing, malware, or other malicious content, please report it the same way as a vulnerability above so it can be disabled.

## Disclosure Policy

This project does not currently offer a bug bounty. Valid reports will be credited in the repository's release notes or commit history on request, unless you prefer to remain anonymous.
