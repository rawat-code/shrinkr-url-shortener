import { NextResponse } from "next/server";
import { createShortUrl, listShortUrls, validateAlias } from "@/lib/urls";

export async function GET() { return NextResponse.json({ data: listShortUrls() }); }
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { originalUrl?: unknown; customAlias?: unknown };
    const alias = validateAlias(body.customAlias);
    const item = createShortUrl(String(body.originalUrl ?? ""), alias);
    const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    return NextResponse.json({ ...item, shortUrl: `${base}/${item.shortCode}` }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: { code: "INVALID_URL", message: error instanceof Error ? error.message : "Invalid request." } }, { status: 400 }); }
}