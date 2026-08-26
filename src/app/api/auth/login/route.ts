import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const token = await loginUser(body.email ?? "", body.password ?? "");
    const response = NextResponse.json({ data: { authenticated: true } });
    response.cookies.set("shrinkr_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return response;
  } catch (error) { return NextResponse.json({ error: { code: "AUTH_FAILED", message: error instanceof Error ? error.message : "Could not sign in." } }, { status: 401 }); }
}