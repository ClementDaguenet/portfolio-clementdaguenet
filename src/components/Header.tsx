"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SiteSwitch } from "@/components/SiteSwitch";
import type { ProPageKey } from "@/lib/data";

const links: { href: string; key: "home" | ProPageKey; page?: ProPageKey }[] = [
  { href: "/", key: "home" },
  { href: "/cv", key: "cv", page: "cv" },
  { href: "/tarifs", key: "tarifs", page: "tarifs" },
  { href: "/entreprises", key: "entreprises", page: "entreprises" },
  { href: "/contact", key: "contact", page: "contact" },
];

export function Header({
  pages,
}: {
  pages?: Partial<Record<ProPageKey, boolean>>;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/ape")) return null;

  const visible = links.filter((link) => {
    if (!link.page) return true;
    if (!pages || !(link.page in pages)) return true;
    return pages[link.page] !== false;
  });

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)]/80 bg-[var(--color-bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 whitespace-nowrap font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-primary)] md:gap-2.5 md:text-xl"
        >
          <Image
            src="/images/pro/logo_cd_square.webp"
            alt=""
            width={36}
            height={36}
            priority
            className="h-7 w-7 rounded-md md:h-9 md:w-9"
          />
          {t("brand")}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {visible.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className={`text-sm transition ${
                  active
                    ? "font-semibold text-[var(--color-primary)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <SiteSwitch />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-[var(--color-border)] p-2 text-[var(--color-text)] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          className="border-t border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-2">
            {visible.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2 text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
