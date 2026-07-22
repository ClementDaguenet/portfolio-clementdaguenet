"use client";

import { FileDown } from "lucide-react";
import { useTranslations } from "next-intl";

export function FloatingCvButton({ href }: { href: string }) {
  const t = useTranslations("cv");

  return (
    <a
      href={href}
      download
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white shadow-[0_12px_30px_-10px_rgba(30,58,95,0.55)] transition hover:scale-[1.03] hover:bg-[var(--color-accent)]"
    >
      <FileDown size={16} />
      <span>{t("floatingLabel")}</span>
    </a>
  );
}
