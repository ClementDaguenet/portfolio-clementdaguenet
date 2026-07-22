"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { TimelineItem } from "@/types";

type Props = {
  items: TimelineItem[];
};

export function Timeline({ items }: Props) {
  const t = useTranslations("timeline");
  const locale = useLocale();

  return (
    <ol className="relative space-y-8 border-l border-[var(--color-border)] pl-6 md:pl-8">
      {items.map((item, index) => {
        const title = locale === "en" ? item.titleEn : item.titleFr;
        const description =
          locale === "en" ? item.descriptionEn : item.descriptionFr;

        return (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
            className="relative"
          >
            <span
              className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-card)] md:-left-[2.4rem]"
              aria-hidden
            />
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
              <time>{item.date}</time>
              <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5">
                {t(`types.${item.type}`)}
              </span>
            </div>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--color-primary)]">
              {title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
              {description}
            </p>
          </motion.li>
        );
      })}
    </ol>
  );
}
