import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageTransition } from "@/components/PageTransition";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillBadges } from "@/components/SkillBadges";
import { Timeline } from "@/components/Timeline";
import { getProjects, getSiteSettings, getSkills, getTimelineExcerpt } from "@/lib/data";
import { OG_IMAGE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  const site = getSiteSettings();
  const og = site.ogImage || OG_IMAGE;
  return {
    title: {
      absolute: `${t("homeTitle")} · ${t("siteName")}`,
    },
    description: t("homeDescription"),
    openGraph: {
      title: t("defaultTitle"),
      description: t("homeDescription"),
      images: [{ url: og }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("defaultTitle"),
      description: t("homeDescription"),
      images: [og],
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations();
  const projects = getProjects();
  const excerpt = getTimelineExcerpt(3);
  const site = getSiteSettings();
  const skills = getSkills();

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.14),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-24">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {t("hero.location")}
            </p>
            <h1 className="text-4xl leading-tight text-[var(--color-primary)] md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--color-accent)] md:text-2xl">
              {t("hero.subtitle")}
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted)] md:text-lg">
              {t("hero.hook")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center rounded-md bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-accent)]"
              >
                {t("hero.ctaProjects")}
              </a>
              <a
                href={site.cvPath}
                download
                className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary)] shadow-sm transition hover:border-[var(--color-accent)]"
              >
                {t("hero.ctaCv")}
              </a>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-56 md:w-72">
            <Image
              src={site.headshot}
              alt={t("hero.title")}
              fill
              priority
              className="rounded-full object-cover"
              sizes="288px"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h2 className="text-3xl text-[var(--color-primary)]">{t("skills.title")}</h2>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">{t("skills.subtitle")}</p>
        <div className="mt-8">
          <SkillBadges skills={skills} />
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h2 className="text-3xl text-[var(--color-primary)]">{t("projects.title")}</h2>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
          {t("projects.subtitle")}
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl text-[var(--color-primary)]">{t("timeline.title")}</h2>
            <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
              {t("timeline.subtitle")}
            </p>
          </div>
          <Link
            href="/cv"
            className="text-sm font-medium text-[var(--color-accent)] hover:underline"
          >
            {t("timeline.seeAll")}
          </Link>
        </div>
        <Timeline items={excerpt} />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/80 px-6 py-12 text-center shadow-[0_16px_40px_-24px_rgba(15,23,42,0.25)] md:px-12">
          <h2 className="text-3xl text-[var(--color-primary)]">{t("cta.title")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-[var(--color-muted)]">
            {t("cta.subtitle")}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center rounded-md bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-accent)]"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
