"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { NAF_SECTIONS } from "@/lib/entreprise-types";
import type { CompanySearchResponse, EstablishmentCard } from "@/lib/entreprise-types";

type Mode = "name" | "id" | "geo";

const ERRORS = new Set([
  "query_short",
  "invalid_id",
  "invalid_postal",
  "invalid_lat",
  "invalid_lon",
  "invalid_radius",
  "rate_limited",
  "upstream",
]);

const HEADCOUNTS = new Set([
  "00",
  "01",
  "02",
  "03",
  "11",
  "12",
  "21",
  "22",
  "31",
  "32",
  "41",
  "42",
  "51",
  "52",
  "53",
  "NN",
]);

const CATEGORIES = new Set(["PME", "ETI", "GE"]);
const STATUSES = new Set(["A", "C", "F"]);
const BADGES = new Set([
  "rge",
  "bio",
  "qualiopi",
  "ess",
  "association",
  "mission",
  "training",
  "individual",
  "siae",
  "heritage",
  "public",
]);

const fieldClass =
  "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-[var(--color-text)] outline-none ring-[var(--color-accent)] focus:ring-2";

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatIsoDate(value: string, locale: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR").format(date);
}

function formatMoney(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function officialRecordHref(siren: string, siret: string) {
  if (/^\d{14}$/.test(siret)) {
    return `https://annuaire-entreprises.data.gouv.fr/etablissement/${siret}`;
  }
  if (/^\d{9}$/.test(siren)) {
    return `https://annuaire-entreprises.data.gouv.fr/entreprise/${siren}`;
  }
  return "";
}

function mapHref(lat: string, lon: string) {
  const latitude = Number(lat);
  const longitude = Number(lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return "";
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
}

export function CompanySearch() {
  const t = useTranslations("entreprises");
  const locale = useLocale();
  const detailRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>("name");
  const [name, setName] = useState("");
  const [postal, setPostal] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [radius, setRadius] = useState("10");
  const [sections, setSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<CompanySearchResponse | null>(null);
  const [filter, setFilter] = useState("");
  const [debounced, setDebounced] = useState("");
  const [showClosed, setShowClosed] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(filter), 300);
    return () => clearTimeout(timeout);
  }, [filter]);

  const filtered = useMemo(() => {
    const results = payload?.results ?? [];
    const query = fold(debounced.trim());
    let list = showClosed
      ? results
      : results.filter((item) => item.status === "A" || item.status === "");
    if (query) {
      list = list.filter((item) =>
        fold(
          [
            item.name,
            item.siren,
            item.siret,
            item.address,
            item.city,
            item.postalCode,
            item.activityCode,
            item.activityLabel,
          ].join(" "),
        ).includes(query),
      );
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, locale));
    }
    return list;
  }, [payload, debounced, showClosed, locale]);

  const hiddenClosed = showClosed
    ? 0
    : (payload?.results ?? []).filter((item) => item.status && item.status !== "A").length;

  const selected = filtered.find((item) => item.id === selectedId) ?? null;

  function errorMessage(code: string) {
    if (ERRORS.has(code)) return t(`errors.${code}`);
    return t("errors.generic");
  }

  function select(id: string) {
    setSelectedId(id);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  async function runSearch(nextPage: number) {
    const params = new URLSearchParams();
    params.set("mode", mode);
    params.set("page", String(nextPage));
    if (mode === "name") {
      params.set("q", name.trim());
      if (postal.trim()) params.set("cp", postal.trim());
    } else if (mode === "id") {
      params.set("q", identifier.replace(/\s/g, ""));
    } else {
      params.set("lat", lat.trim());
      params.set("lon", lon.trim());
      params.set("radius", radius.trim() || "10");
      if (sections.length > 0) params.set("sections", sections.join(","));
    }

    setLoading(true);
    setError("");
    setFilter("");
    setDebounced("");
    setSelectedId(null);

    try {
      const response = await fetch(`/api/entreprises?${params}`);
      const data = (await response.json().catch(() => null)) as
        | (CompanySearchResponse & { error?: string })
        | null;
      if (!response.ok || !data || !Array.isArray(data.results)) {
        setPayload(null);
        setError(errorMessage(data?.error ?? "generic"));
        return;
      }
      setPayload(data);
    } catch {
      setPayload(null);
      setError(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runSearch(1);
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] md:p-6"
      >
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("modesLabel")}>
          {(["name", "id", "geo"] as const).map((key) => {
            const active = mode === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(key)}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-accent)]"
                }`}
              >
                {t(`modes.${key}`)}
              </button>
            );
          })}
        </div>

        {mode === "name" ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="company-name" className="mb-1 block text-sm">
                {t("nameLabel")}
              </label>
              <input
                id="company-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t("namePlaceholder")}
                autoComplete="off"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="company-postal" className="mb-1 block text-sm">
                {t("postalLabel")}
              </label>
              <input
                id="company-postal"
                value={postal}
                onChange={(event) => setPostal(event.target.value)}
                placeholder={t("postalPlaceholder")}
                autoComplete="off"
                className={fieldClass}
              />
              <p className="mt-1 text-xs text-[var(--color-muted)]">{t("postalHint")}</p>
            </div>
          </div>
        ) : null}

        {mode === "id" ? (
          <div className="mt-5 max-w-md">
            <label htmlFor="company-id" className="mb-1 block text-sm">
              {t("idLabel")}
            </label>
            <input
              id="company-id"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder={t("idPlaceholder")}
              inputMode="numeric"
              autoComplete="off"
              className={fieldClass}
            />
          </div>
        ) : null}

        {mode === "geo" ? (
          <div className="mt-5 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="company-lat" className="mb-1 block text-sm">
                  {t("latLabel")}
                </label>
                <input
                  id="company-lat"
                  value={lat}
                  onChange={(event) => setLat(event.target.value)}
                  placeholder="48.8566"
                  autoComplete="off"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="company-lon" className="mb-1 block text-sm">
                  {t("lonLabel")}
                </label>
                <input
                  id="company-lon"
                  value={lon}
                  onChange={(event) => setLon(event.target.value)}
                  placeholder="2.3522"
                  autoComplete="off"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="company-radius" className="mb-1 block text-sm">
                  {t("radiusLabel")}
                </label>
                <input
                  id="company-radius"
                  value={radius}
                  onChange={(event) => setRadius(event.target.value)}
                  inputMode="decimal"
                  className={fieldClass}
                />
              </div>
            </div>
            <fieldset>
              <legend className="mb-2 text-sm">{t("sectionsLabel")}</legend>
              <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto">
                <button
                  type="button"
                  aria-pressed={sections.length === 0}
                  onClick={() => setSections([])}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    sections.length === 0
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-accent)]"
                  }`}
                >
                  {t("sectionsAll")}
                </button>
                {NAF_SECTIONS.map((code) => {
                  const active = sections.includes(code);
                  const label = t(`sections.${code}`);
                  return (
                    <button
                      key={code}
                      type="button"
                      aria-pressed={active}
                      aria-label={`${code}. ${label}`}
                      title={label}
                      onClick={() =>
                        setSections((current) =>
                          current.includes(code)
                            ? current.filter((item) => item !== code)
                            : [...current, code],
                        )
                      }
                      className={`rounded-full border px-2.5 py-1 text-xs transition ${
                        active
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                          : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
                      }`}
                    >
                      {code} · {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-md bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-accent)] disabled:opacity-60"
          >
            {loading ? t("searching") : t("search")}
          </button>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </form>

      {payload ? (
        <section className="mt-8" aria-live="polite">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-md">
              <label htmlFor="company-filter" className="mb-1 block text-sm">
                {t("filterLabel")}
              </label>
              <input
                id="company-filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder={t("filterPlaceholder")}
                className={fieldClass}
              />
              <p className="mt-1 text-xs text-[var(--color-muted)]">{t("filterHint")}</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
              <input
                type="checkbox"
                checked={showClosed}
                onChange={(event) => setShowClosed(event.target.checked)}
                className="size-4 accent-[var(--color-accent)]"
              />
              {t("showClosed")}
            </label>
          </div>

          <p className="mt-4 text-sm text-[var(--color-muted)]">
            {t("shown", { count: filtered.length })}
            {" · "}
            {payload.totalResults === 0
              ? t("totalNone")
              : t("total", { count: payload.totalResults })}
            {payload.totalPages > 1
              ? ` · ${t("pageLabel", { page: payload.page, pages: payload.totalPages })}`
              : ""}
          </p>
          {hiddenClosed > 0 ? (
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {t("closedHidden", { count: hiddenClosed })}
            </p>
          ) : null}

          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="order-2 lg:order-1">
              {filtered.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-8 text-center text-sm text-[var(--color-muted)]">
                  {t("empty")}
                </p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {filtered.map((item) => (
                    <li key={item.id}>
                      <ResultCard
                        item={item}
                        selected={item.id === selectedId}
                        onSelect={() => select(item.id)}
                        statusLabel={statusLabel(t, item.status)}
                        activity={activityLine(item)}
                      />
                    </li>
                  ))}
                </ul>
              )}

              {payload.totalPages > 1 ? (
                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={loading || payload.page <= 1}
                    onClick={() => void runSearch(payload.page - 1)}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-primary)] transition hover:border-[var(--color-accent)] disabled:opacity-50"
                  >
                    {t("prev")}
                  </button>
                  <button
                    type="button"
                    disabled={loading || payload.page >= payload.totalPages}
                    onClick={() => void runSearch(payload.page + 1)}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-primary)] transition hover:border-[var(--color-accent)] disabled:opacity-50"
                  >
                    {t("next")}
                  </button>
                </div>
              ) : null}
            </div>

            <aside
              ref={detailRef}
              className={`scroll-mt-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] lg:sticky lg:top-24 lg:order-2 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto ${
                selected ? "order-1" : "order-2 hidden lg:block"
              }`}
            >
              {selected ? (
                <Detail
                  item={selected}
                  locale={locale}
                  onClose={() => setSelectedId(null)}
                />
              ) : (
                <p className="text-sm text-[var(--color-muted)]">{t("selectHint")}</p>
              )}
            </aside>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function statusLabel(
  t: ReturnType<typeof useTranslations<"entreprises">>,
  status: string,
) {
  if (STATUSES.has(status)) return t(`status.${status}`);
  return status;
}

function activityLine(item: EstablishmentCard) {
  if (item.activityCode && item.activityLabel) {
    return `${item.activityCode} · ${item.activityLabel}`;
  }
  return item.activityLabel || item.activityCode;
}

function ResultCard({
  item,
  selected,
  onSelect,
  statusLabel: status,
  activity,
}: {
  item: EstablishmentCard;
  selected: boolean;
  onSelect: () => void;
  statusLabel: string;
  activity: string;
}) {
  const t = useTranslations("entreprises");
  const closed = item.status !== "" && item.status !== "A";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex h-full w-full flex-col gap-2 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]"
          : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
      } ${closed ? "bg-[#f1f5f9]" : "bg-[var(--color-card)]"}`}
    >
      <span className="font-[family-name:var(--font-display)] text-lg leading-snug text-[var(--color-primary)]">
        {item.name}
      </span>
      <span className="text-xs text-[var(--color-muted)]">
        {[item.siren, item.siret].filter(Boolean).join(" · ")}
      </span>
      {item.address ? (
        <span className="line-clamp-2 text-sm text-[var(--color-text)]">{item.address}</span>
      ) : null}
      {activity ? (
        <span className="line-clamp-2 text-sm text-[var(--color-muted)]">{activity}</span>
      ) : null}
      <span className="mt-auto flex flex-wrap gap-1.5 pt-1">
        {status ? (
          <span className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--color-text)]">
            {status}
          </span>
        ) : null}
        {item.isHeadOffice ? (
          <span className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--color-accent)]">
            {t("headOffice")}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function Detail({
  item,
  locale,
  onClose,
}: {
  item: EstablishmentCard;
  locale: string;
  onClose: () => void;
}) {
  const t = useTranslations("entreprises");
  const activity = activityLine(item);
  const official = officialRecordHref(item.siren, item.siret);
  const map = mapHref(item.lat, item.lon);
  const section =
    item.section && (NAF_SECTIONS as readonly string[]).includes(item.section)
      ? `${item.section} · ${t(`sections.${item.section}`)}`
      : item.section;
  const category = CATEGORIES.has(item.category) ? t(`categories.${item.category}`) : item.category;
  const headcount = HEADCOUNTS.has(item.headcount)
    ? t(`headcounts.${item.headcount}`)
    : item.headcount;

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-2xl text-[var(--color-primary)]">{item.name}</h2>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-sm text-[var(--color-accent)] hover:underline lg:hidden"
        >
          {t("closeDetail")}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {statusLabel(t, item.status) ? (
          <span className="rounded border border-[var(--color-border)] px-2 py-0.5 text-[10px] uppercase tracking-wide">
            {statusLabel(t, item.status)}
          </span>
        ) : null}
        {item.isHeadOffice ? (
          <span className="rounded border border-[var(--color-border)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--color-accent)]">
            {t("headOffice")}
          </span>
        ) : null}
        {item.badges.map((badge) =>
          BADGES.has(badge) ? (
            <span
              key={badge}
              className="rounded border border-[var(--color-border)] px-2 py-0.5 text-[10px] uppercase tracking-wide"
            >
              {t(`badges.${badge}`)}
            </span>
          ) : null,
        )}
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        {item.address ? <Row label={t("address")} value={item.address} /> : null}
        {item.siren ? <Row label={t("siren")} value={item.siren} /> : null}
        {item.siret ? <Row label={t("siret")} value={item.siret} /> : null}
        {activity ? (
          <Row
            label={t("activity")}
            value={
              <>
                {activity}
                {item.activityLabel ? (
                  <span className="mt-1 block text-xs text-[var(--color-muted)]">{t("nafNote")}</span>
                ) : null}
              </>
            }
          />
        ) : null}
        {section ? <Row label={t("section")} value={section} /> : null}
        {item.createdAt ? (
          <Row label={t("created")} value={formatIsoDate(item.createdAt, locale)} />
        ) : null}
        {category ? <Row label={t("category")} value={category} /> : null}
        {headcount ? <Row label={t("headcount")} value={headcount} /> : null}
        {item.totalEstablishments > 0 ? (
          <Row
            label={t("establishments")}
            value={t("establishmentsValue", {
              open: item.openEstablishments,
              total: item.totalEstablishments,
            })}
          />
        ) : null}
      </dl>

      {official || map ? (
        <div className="mt-4 flex flex-col items-start gap-2">
          {official ? (
            <a
              href={official}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm font-medium text-[var(--color-accent)] hover:underline"
            >
              {t("official")}
            </a>
          ) : null}
          {map ? (
            <a
              href={map}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm font-medium text-[var(--color-accent)] hover:underline"
            >
              {t("map")}
            </a>
          ) : null}
        </div>
      ) : null}

      {item.directors.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg text-[var(--color-primary)]">{t("directors")}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {item.directors.map((director) => (
              <li key={`${director.name}-${director.role}`}>
                <span className="text-[var(--color-text)]">{director.name}</span>
                {director.role ? (
                  <span className="block text-[var(--color-muted)]">{director.role}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {item.finances.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg text-[var(--color-primary)]">{t("finances")}</h3>
          <ul className="mt-2 space-y-3 text-sm">
            {item.finances.map((year) => (
              <li key={year.year}>
                <p className="font-medium text-[var(--color-primary)]">{year.year}</p>
                {year.revenue !== null ? (
                  <p>
                    {t("revenue")} · {formatMoney(year.revenue, locale)}
                  </p>
                ) : null}
                {year.netIncome !== null ? (
                  <p>
                    {t("netIncome")} · {formatMoney(year.netIncome, locale)}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">{label}</dt>
      <dd className="mt-0.5 text-[var(--color-text)]">{value}</dd>
    </div>
  );
}
