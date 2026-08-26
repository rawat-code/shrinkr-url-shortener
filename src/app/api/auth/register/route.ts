import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; email?: string; password?: string };
    const token = await registerUser(body.name ?? "", body.email ?? "", body.password ?? "");
    const response = NextResponse.json({ data: { authenticated: true } }, { status: 201 });
    response.cookies.set("shrinkr_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return response;
  } catch (error) { return NextResponse.json({ error: { code: "AUTH_FAILED", message: error instanceof Error ? error.message : "Could not create account." } }, { status: 400 }); }
}