# Security

Validate every external URL and only permit `http:` and `https:`. Never store raw visitor IP addresses: hash them before analytics persistence. Production deployments must use HTTPS, secure Auth.js cookies, Prisma parameterized queries, ownership checks on protected routes, Redis-backed rate limits, and a pluggable safety provider before publication.