import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageTransition } from "@/components/PageTransition";
import { OG_IMAGE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("legalTitle"),
    description: t("legalDescription"),
    openGraph: {
      title: t("legalTitle"),
      description: t("legalDescription"),
      images: [{ url: OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("legalTitle"),
      description: t("legalDescription"),
      images: [OG_IMAGE],
    },
  };
}

export default async function MentionsLegalesPage() {
  const t = await getTranslations("legal");

  const sections = [
    { title: t("editorTitle"), body: t("editorBody") },
    { title: t("hostTitle"), body: t("hostBody") },
    { title: t("ipTitle"), body: t("ipBody") },
    { title: t("dataTitle"), body: t("dataBody") },
  ];

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <h1 className="text-4xl text-[var(--color-primary)] md:text-5xl">
          {t("title")}
        </h1>
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl text-[var(--color-primary)]">{section.title}</h2>
              <p className="mt-2 whitespace-pre-line text-[var(--color-muted)] leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
