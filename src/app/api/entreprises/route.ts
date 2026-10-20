import { NextResponse } from "next/server";
import { CompanySearchException, searchEntreprises } from "@/lib/entreprises";
import type { CompanySearchInput } from "@/lib/entreprise-types";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = clientIp(request);
  const limited = rateLimit(`entreprises:${ip}`, 40, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  const url = new URL(request.url);
  const input: CompanySearchInput = {
    mode: url.searchParams.get("mode") ?? "",
    q: url.searchParams.get("q") ?? "",
    cp: url.searchParams.get("cp") ?? "",
    lat: url.searchParams.get("lat") ?? "",
    lon: url.searchParams.get("lon") ?? "",
    radius: url.searchParams.get("radius") ?? "",
    sections: url.searchParams.get("sections") ?? "",
    page: url.searchParams.get("page") ?? "1",
  };

  try {
    const data = await searchEntreprises(input);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof CompanySearchException) {
      return NextResponse.json({ error: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
