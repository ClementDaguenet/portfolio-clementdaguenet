import { cookies } from "next/headers";
import { readFileSync } from "fs";
import path from "path";
import { getRequestConfig } from "next-intl/server";

export const locales = ["fr", "en"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "fr";

function loadMessages(locale: AppLocale) {
  const full = path.join(process.cwd(), "src", "messages", `${locale}.json`);
  const raw = readFileSync(full, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as Record<string, unknown>;
}

export default getRequestConfig(async () => {
  const store = await cookies();
  const raw = store.get("NEXT_LOCALE")?.value;
  const locale: AppLocale =
    raw === "en" || raw === "fr" ? raw : defaultLocale;

  return {
    locale,
    messages: loadMessages(locale),
  };
});
