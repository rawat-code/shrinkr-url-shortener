import { NextResponse } from "next/server";
import { findShortUrl } from "@/lib/urls";

export async function GET(request: Request, { params }: { params: Promise<{ shortCode: string }> }) {
  const { shortCode } = await params; const item = findShortUrl(shortCode);
  if (!item || !item.isActive || (item.expiresAt && new Date(item.expiresAt) <= new Date())) return NextResponse.json({ error: { code: "URL_NOT_FOUND", message: "This link is unavailable." } }, { status: 404 });
  item.clicks += 1; return NextResponse.redirect(item.originalUrl, 302);
}