"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ExternalLink, Lock } from "lucide-react";
import type { ProProject } from "@/types";

type Props = {
  project: ProProject;
};

export function ProjectCard({ project }: Props) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const summary = locale === "en" ? project.summaryEn : project.summaryFr;
  const hasUrl = Boolean(project.url);

  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-primary)]/5">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-primary)]">
            {project.title}
          </h3>
          {project.featured ? (
            <span className="shrink-0 text-[10px] uppercase tracking-wide text-[var(--color-accent)]">
              {t("featured")}
            </span>
          ) : null}
        </div>
        <p className="text-sm leading-relaxed text-[var(--color-muted)]">
          {summary}
        </p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.techs.map((tech) => (
            <li
              key={tech}
              className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-0.5 text-xs text-[var(--color-text)]"
            >
              {tech}
            </li>
          ))}
        </ul>
        {hasUrl ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:underline"
          >
            {t("viewProject")}
            <ExternalLink size={14} />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
            <Lock size={14} />
            {t("private")}
          </span>
        )}
      </div>
    </motion.article>
  );
}
