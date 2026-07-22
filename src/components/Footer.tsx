"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { GAMING_URL } from "@/lib/site";

export function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-card)]/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="space-y-1 text-sm text-[var(--color-muted)]">
          <p className="font-[family-name:var(--font-display)] text-[var(--color-primary)]">
            Clément Daguenet
          </p>
          <p>
            © {year} · {t("rights")}
          </p>
          <p className="text-xs">{t("builtWith")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link
            href="/mentions-legales"
            className="text-[var(--color-muted)] transition hover:text-[var(--color-accent)]"
          >
            {t("legal")}
          </Link>
          <a
            href={GAMING_URL}
            className="text-[var(--color-muted)] transition hover:text-[var(--color-accent)]"
          >
            {t("mirror")}
          </a>
        </div>
      </div>
    </footer>
  );
}
