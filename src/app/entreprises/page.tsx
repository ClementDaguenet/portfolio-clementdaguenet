import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CompanySearch } from "@/components/CompanySearch";
import { PageTransition } from "@/components/PageTransition";
import { requirePage } from "@/lib/data";
import { OG_IMAGE } from "@/lib/site";

const SOURCE_URL =
  "https://www.data.gouv.fr/dataservices/api-recherche-dentreprises";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("entreprisesTitle"),
    description: t("entreprisesDescription"),
    openGraph: {
      title: t("entreprisesTitle"),
      description: t("entreprisesDescription"),
      images: [{ url: OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("entreprisesTitle"),
      description: t("entreprisesDescription"),
      images: [OG_IMAGE],
    },
  };
}

export default async function EntreprisesPage() {
  requirePage("entreprises");
  const t = await getTranslations("entreprises");

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <h1 className="text-4xl text-[var(--color-primary)] md:text-5xl">{t("title")}</h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">{t("subtitle")}</p>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] hover:underline"
          >
            {t("source")}
          </a>
        </p>
        <CompanySearch />
      </div>
    </PageTransition>
  );
}
