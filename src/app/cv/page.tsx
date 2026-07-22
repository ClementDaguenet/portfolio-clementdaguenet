import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FloatingCvButton } from "@/components/FloatingCvButton";
import { PageTransition } from "@/components/PageTransition";
import { Timeline } from "@/components/Timeline";
import { getSiteSettings, getTimeline } from "@/lib/data";
import { OG_IMAGE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  const site = getSiteSettings();
  const og = site.ogImage || OG_IMAGE;
  return {
    title: t("cvTitle"),
    description: t("cvDescription"),
    openGraph: {
      title: t("cvTitle"),
      description: t("cvDescription"),
      images: [{ url: og }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("cvTitle"),
      description: t("cvDescription"),
      images: [og],
    },
  };
}

export default async function CvPage() {
  const t = await getTranslations("cv");
  const timeline = getTimeline();
  const site = getSiteSettings();

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl text-[var(--color-primary)] md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-2xl text-[var(--color-muted)]">{t("subtitle")}</p>
          </div>
          <a
            href={site.cvPath}
            download
            className="inline-flex items-center rounded-md bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-accent)]"
          >
            {t("download")}
          </a>
        </div>
        <Timeline items={timeline} />
      </div>
      <FloatingCvButton href={site.cvPath} />
    </PageTransition>
  );
}
