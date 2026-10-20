import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { PageTransition } from "@/components/PageTransition";
import { getPricing, getSiteSettings, isPageEnabled, requirePage } from "@/lib/data";
import { OG_IMAGE } from "@/lib/site";
import type { PricingLine, PricingOffer } from "@/types";

function txt(locale: string, fr: string, en: string) {
  return locale === "en" ? en : fr;
}

function lines(locale: string, fr: string[], en: string[]) {
  return locale === "en" ? en : fr;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const pricing = getPricing();
  const site = getSiteSettings();
  const title = txt(locale, pricing.titleFr, pricing.titleEn);
  const description = txt(locale, pricing.descriptionFr, pricing.descriptionEn);
  const og = site.ogImage || OG_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: og }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og],
    },
  };
}

function OfferGrid({
  offers,
  locale,
}: {
  offers: PricingOffer[];
  locale: string;
}) {
  const showBadge = offers.some((offer) =>
    txt(locale, offer.badgeFr ?? "", offer.badgeEn ?? ""),
  );

  return (
    <div
      className={`mt-8 grid gap-4 ${
        offers.length === 2 ? "md:max-w-3xl md:grid-cols-2" : "md:grid-cols-3"
      }`}
    >
      {offers.map((offer) => {
        const items = lines(locale, offer.itemsFr, offer.itemsEn);
        const badge = txt(locale, offer.badgeFr ?? "", offer.badgeEn ?? "");
        return (
          <article
            key={offer.id}
            className={`flex flex-col border bg-[var(--color-card)] px-5 py-5 ${
              offer.featured
                ? "border-[var(--color-accent)]"
                : "border-[var(--color-border)]"
            }`}
          >
            {showBadge ? (
              <p className="h-4 text-[11px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
                {badge}
              </p>
            ) : null}
            <h3 className="mt-2 text-xl text-[var(--color-primary)]">
              {txt(locale, offer.nameFr, offer.nameEn)}
            </h3>
            <p className="mt-1 text-lg text-[var(--color-primary)]">
              {txt(locale, offer.priceFr, offer.priceEn)}
            </p>
            <ul className="mt-4 space-y-1.5 text-sm leading-relaxed">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

function PriceList({ items, locale }: { items: PricingLine[]; locale: string }) {
  return (
    <ul className="mt-6 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
        >
          <span>{txt(locale, item.labelFr, item.labelEn)}</span>
          <span className="shrink-0 text-[var(--color-primary)]">
            {txt(locale, item.priceFr, item.priceEn)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function TarifsPage() {
  requirePage("tarifs");
  const locale = await getLocale();
  const pricing = getPricing();
  const t = await getTranslations("cta");
  const showContact = isPageEnabled("contact");

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <header className="max-w-2xl">
          <h1 className="text-4xl text-[var(--color-primary)] md:text-5xl">
            {txt(locale, pricing.titleFr, pricing.titleEn)}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)] md:text-lg">
            {txt(locale, pricing.introFr, pricing.introEn)}
          </p>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            {txt(locale, pricing.vatNoteFr, pricing.vatNoteEn)}
          </p>
        </header>

        <section className="mt-16">
          <h2 className="text-3xl text-[var(--color-primary)]">
            {txt(locale, pricing.web.titleFr, pricing.web.titleEn)}
          </h2>
          {txt(locale, pricing.web.introFr, pricing.web.introEn) ? (
            <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
              {txt(locale, pricing.web.introFr, pricing.web.introEn)}
            </p>
          ) : null}
          <OfferGrid offers={pricing.web.offers} locale={locale} />
        </section>

        <section className="mt-16">
          <h2 className="text-3xl text-[var(--color-primary)]">
            {txt(locale, pricing.extras.titleFr, pricing.extras.titleEn)}
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
            {txt(locale, pricing.extras.noteFr, pricing.extras.noteEn)}
          </p>
          <PriceList items={pricing.extras.items} locale={locale} />
        </section>

        <section className="mt-16">
          <h2 className="text-3xl text-[var(--color-primary)]">
            {txt(locale, pricing.maintenance.titleFr, pricing.maintenance.titleEn)}
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
            {txt(locale, pricing.maintenance.noteFr, pricing.maintenance.noteEn)}
          </p>
          <OfferGrid offers={pricing.maintenance.plans} locale={locale} />
        </section>

        <section className="mt-16">
          <h2 className="text-3xl text-[var(--color-primary)]">
            {txt(locale, pricing.writing.titleFr, pricing.writing.titleEn)}
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
            {txt(locale, pricing.writing.introFr, pricing.writing.introEn)}
          </p>
          <PriceList items={pricing.writing.items} locale={locale} />
        </section>

        <section className="mt-16 max-w-2xl border-l-2 border-[var(--color-primary)] pl-4">
          <h2 className="text-xl text-[var(--color-primary)]">
            {txt(locale, pricing.custom.titleFr, pricing.custom.titleEn)}
          </h2>
          <p className="mt-2 leading-relaxed text-[var(--color-muted)]">
            {txt(locale, pricing.custom.bodyFr, pricing.custom.bodyEn)}
          </p>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-xl text-[var(--color-primary)]">
            {txt(locale, pricing.conditions.titleFr, pricing.conditions.titleEn)}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--color-muted)]">
            {lines(locale, pricing.conditions.itemsFr, pricing.conditions.itemsEn).map(
              (item) => (
                <li key={item}>{item}</li>
              ),
            )}
          </ul>
        </section>

        {showContact ? (
          <section className="mt-16">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/80 px-6 py-12 text-center shadow-[0_16px_40px_-24px_rgba(15,23,42,0.25)] md:px-12">
              <h2 className="text-3xl text-[var(--color-primary)]">
                {txt(locale, pricing.cta.titleFr, pricing.cta.titleEn)}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[var(--color-muted)]">
                {txt(locale, pricing.cta.bodyFr, pricing.cta.bodyEn)}
              </p>
              <Link
                href="/contact"
                prefetch={false}
                className="mt-8 inline-flex items-center rounded-md bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-accent)]"
              >
                {t("button")}
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </PageTransition>
  );
}
