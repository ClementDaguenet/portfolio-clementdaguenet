"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LanguageToggle() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function setLocale(next: "fr" | "en") {
    if (next === locale || pending) return;
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div
      className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-card)] p-0.5 text-sm shadow-sm"
      role="group"
      aria-label={t("label")}
    >
      <button
        type="button"
        onClick={() => setLocale("fr")}
        disabled={pending}
        className={`rounded px-2 py-1 transition ${
          locale === "fr"
            ? "bg-[var(--color-primary)] text-white"
            : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
        }`}
        aria-pressed={locale === "fr"}
      >
        {t("fr")}
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        disabled={pending}
        className={`rounded px-2 py-1 transition ${
          locale === "en"
            ? "bg-[var(--color-primary)] text-white"
            : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
        }`}
        aria-pressed={locale === "en"}
      >
        {t("en")}
      </button>
    </div>
  );
}
