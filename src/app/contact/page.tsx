import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/ContactForm";
import { PageTransition } from "@/components/PageTransition";
import { OG_IMAGE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
    openGraph: {
      title: t("contactTitle"),
      description: t("contactDescription"),
      images: [{ url: OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("contactTitle"),
      description: t("contactDescription"),
      images: [OG_IMAGE],
    },
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-10 text-center">
          <h1 className="text-4xl text-[var(--color-primary)] md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[var(--color-muted)]">
            {t("subtitle")}
          </p>
        </div>
        <ContactForm />
      </div>
    </PageTransition>
  );
}
