import { NextResponse } from "next/server";

const ALLOWED = new Set(["fr", "en"]);

export async function POST(request: Request) {
  let locale = "fr";
  try {
    const body = (await request.json()) as { locale?: string };
    if (body.locale && ALLOWED.has(body.locale)) {
      locale = body.locale;
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
