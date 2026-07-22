"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MirrorFlipOverlay } from "@/components/MirrorFlipOverlay";
import { GAMING_URL } from "@/lib/site";

export function SiteSwitch() {
  const t = useTranslations("mirror");
  const [flipping, setFlipping] = useState(false);

  function handleSwitch() {
    if (flipping) return;
    setFlipping(true);
    window.setTimeout(() => {
      window.location.href = GAMING_URL;
    }, 550);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleSwitch}
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 py-1.5 text-sm text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        aria-label={t("label")}
        title={t("label")}
      >
        <span aria-hidden>💼</span>
        <span className="hidden sm:inline text-[var(--color-muted)]">/</span>
        <span aria-hidden>🎮</span>
      </button>
      <MirrorFlipOverlay active={flipping} label={t("switching")} />
    </>
  );
}
