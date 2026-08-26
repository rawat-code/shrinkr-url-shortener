import { randomBytes } from "node:crypto";

export const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const RESERVED_ALIASES = new Set(["api", "admin", "dashboard", "login", "signup", "logout", "settings", "analytics", "about", "pricing", "favicon.ico", "robots.txt", "sitemap.xml"]);

export function validateUrl(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error("Enter a URL to shorten.");
  let parsed: URL;
  try { parsed = new URL(value.trim()); } catch { throw new Error("Enter a valid URL, including https://."); }
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Only http and https links are supported.");
  return parsed.toString();
}

export function validateAlias(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{3,32}$/.test(value) || RESERVED_ALIASES.has(value.toLowerCase())) throw new Error("Aliases must be 3-32 letters, numbers, hyphens, or underscores.");
  return value.toLowerCase();
}

export function generateCode(length = Number(process.env.URL_CODE_LENGTH ?? 7)): string {
  const bytes = randomBytes(length); return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

export type ShortUrl = { id: string; shortCode: string; originalUrl: string; createdAt: string; clicks: number; isActive: boolean; expiresAt: string | null };
const urls = new Map<string, ShortUrl>();
export function createShortUrl(originalUrl: string, alias?: string): ShortUrl {
  const shortCode = alias ?? generateCode();
  if (urls.has(shortCode)) throw new Error("That alias is already in use.");
  const item: ShortUrl = { id: randomBytes(12).toString("hex"), shortCode, originalUrl: validateUrl(originalUrl), createdAt: new Date().toISOString(), clicks: 0, isActive: true, expiresAt: null };
  urls.set(shortCode, item); return item;
}
export function listShortUrls(): ShortUrl[] { return [...urls.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
export function findShortUrl(code: string): ShortUrl | undefined { return urls.get(code); }