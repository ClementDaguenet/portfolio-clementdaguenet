import { readFileSync } from "fs";
import path from "path";
import {
  NAF_SECTIONS,
  type CompanySearchError,
  type CompanySearchInput,
  type CompanySearchResponse,
  type EstablishmentCard,
} from "@/lib/entreprise-types";

const SEARCH_URL = "https://recherche-entreprises.api.gouv.fr/search";
const NEAR_URL = "https://recherche-entreprises.api.gouv.fr/near_point";
const PER_PAGE = 10;
const MATCHING_LIMIT = 20;

const BADGE_FIELDS: [string, string][] = [
  ["est_rge", "rge"],
  ["est_bio", "bio"],
  ["est_qualiopi", "qualiopi"],
  ["est_ess", "ess"],
  ["est_association", "association"],
  ["est_societe_mission", "mission"],
  ["est_organisme_formation", "training"],
  ["est_entrepreneur_individuel", "individual"],
  ["est_siae", "siae"],
  ["est_patrimoine_vivant", "heritage"],
  ["est_service_public", "public"],
];

export class CompanySearchException extends Error {
  constructor(
    public code: CompanySearchError,
    public status: number,
  ) {
    super(code);
  }
}

let nafCache: Record<string, string> | null = null;

function nafDict(): Record<string, string> {
  if (nafCache) return nafCache;
  const full = path.join(process.cwd(), "src/data/nafRev2.json");
  const raw = readFileSync(full, "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/[\u0000-\u001F]/g, " ");
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  const dict: Record<string, string> = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === "string") dict[key.toUpperCase()] = value;
  }
  nafCache = dict;
  return dict;
}

function normalizeNaf(code: string): string {
  let value = code.trim().toUpperCase();
  if (value.length === 5 && value[2] !== ".") {
    value = `${value.slice(0, 2)}.${value.slice(2)}`;
  }
  return value;
}

function nafLabel(code: string): string {
  const dict = nafDict();
  const normalized = normalizeNaf(code);
  if (!normalized) return "";
  if (dict[normalized]) return dict[normalized];
  if (normalized.length === 6 && /[A-Z]$/.test(normalized)) {
    const withoutLetter = normalized.slice(0, 5);
    if (dict[withoutLetter]) return dict[withoutLetter];
  }
  if (normalized.length >= 5 && dict[normalized.slice(0, 5)]) {
    return dict[normalized.slice(0, 5)];
  }
  if (normalized.length >= 4) {
    const division = `${normalized.slice(0, 2)}.${normalized.slice(3, 5)}`;
    if (dict[division]) return dict[division];
  }
  return "";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function str(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function bool(value: unknown): boolean {
  return value === true;
}

function int(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === "string" && /^-?\d+$/.test(value)) return Number(value);
  return 0;
}

function optionalNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return null;
}

function fail(code: CompanySearchError, status: number): never {
  throw new CompanySearchException(code, status);
}

function parseCoord(value: string): number | null {
  const parsed = Number(value.trim().replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function mapDirectors(company: Record<string, unknown>) {
  if (!Array.isArray(company.dirigeants)) return [];
  const list: EstablishmentCard["directors"] = [];
  for (const item of company.dirigeants) {
    const row = asRecord(item);
    if (!row) continue;
    const person = [str(row.prenoms), str(row.nom)].filter(Boolean).join(" ");
    const name = person || str(row.denomination);
    if (!name) continue;
    list.push({ name, role: str(row.qualite) });
    if (list.length >= 12) break;
  }
  return list;
}

function mapFinances(company: Record<string, unknown>) {
  const finances = asRecord(company.finances);
  if (!finances) return [];
  const rows: EstablishmentCard["finances"] = [];
  for (const [year, value] of Object.entries(finances)) {
    const row = asRecord(value);
    if (!row || !/^\d{4}$/.test(year)) continue;
    const revenue = optionalNumber(row.ca);
    const netIncome = optionalNumber(row.resultat_net);
    if (revenue === null && netIncome === null) continue;
    rows.push({ year, revenue, netIncome });
  }
  rows.sort((a, b) => b.year.localeCompare(a.year));
  return rows.slice(0, 4);
}

function mapBadges(company: Record<string, unknown>): string[] {
  const complements = asRecord(company.complements);
  if (!complements) return [];
  return BADGE_FIELDS.filter(([field]) => bool(complements[field])).map(([, key]) => key);
}

function mapCard(
  company: Record<string, unknown>,
  establishment: Record<string, unknown>,
  index: number,
): EstablishmentCard {
  const siren = str(company.siren);
  const siret = str(establishment.siret);
  const activityCode =
    str(establishment.activite_principale) || str(company.activite_principale);
  const status = (
    str(establishment.etat_administratif) || str(company.etat_administratif)
  ).toUpperCase();

  return {
    id: `${siret || siren || "row"}-${index}`,
    name:
      str(company.nom_complet) ||
      str(company.nom_raison_sociale) ||
      str(establishment.nom_commercial) ||
      siren,
    siren,
    siret,
    address: str(establishment.adresse) || str(establishment.geo_adresse),
    city: str(establishment.libelle_commune),
    postalCode: str(establishment.code_postal),
    activityCode,
    activityLabel: nafLabel(activityCode),
    section: str(company.section_activite_principale).toUpperCase(),
    status,
    isHeadOffice: bool(establishment.est_siege),
    createdAt: str(establishment.date_creation) || str(company.date_creation),
    category: str(company.categorie_entreprise).toUpperCase(),
    headcount:
      str(establishment.tranche_effectif_salarie) || str(company.tranche_effectif_salarie),
    openEstablishments: int(company.nombre_etablissements_ouverts),
    totalEstablishments: int(company.nombre_etablissements),
    lat: str(establishment.latitude),
    lon: str(establishment.longitude),
    directors: mapDirectors(company),
    finances: mapFinances(company),
    badges: mapBadges(company),
  };
}

function flatten(payload: unknown): CompanySearchResponse {
  const root = asRecord(payload);
  if (!root) fail("upstream", 502);
  const results = Array.isArray(root.results) ? root.results : [];
  const cards: EstablishmentCard[] = [];

  results.forEach((item, companyIndex) => {
    const company = asRecord(item);
    if (!company) return;
    const matching = Array.isArray(company.matching_etablissements)
      ? company.matching_etablissements.flatMap((entry) => {
          const row = asRecord(entry);
          return row ? [row] : [];
        })
      : [];
    const siege = asRecord(company.siege);
    const establishments = matching.length > 0 ? matching : siege ? [siege] : [];
    establishments.forEach((establishment, establishmentIndex) => {
      cards.push(mapCard(company, establishment, companyIndex * 100 + establishmentIndex));
    });
  });

  const totalPages = Math.max(1, int(root.total_pages) || 1);
  return {
    page: Math.max(1, int(root.page) || 1),
    totalPages,
    totalResults: Math.max(0, int(root.total_results)),
    results: cards,
  };
}

type Prepared =
  | { mode: "name"; q: string; cp: string; page: number }
  | { mode: "id"; q: string; page: number }
  | { mode: "geo"; lat: string; lon: string; radius: string; sections: string; page: number };

function prepare(input: CompanySearchInput): Prepared {
  const page = Math.min(400, Math.max(1, int(input.page) || 1));

  if (input.mode === "name") {
    const q = input.q.trim().slice(0, 200);
    if (q.length < 3) fail("query_short", 400);
    const cp = input.cp.replace(/\s/g, "").slice(0, 80);
    if (cp && !cp.split(",").every((part) => /^\d{5}$/.test(part))) {
      fail("invalid_postal", 400);
    }
    return { mode: "name", q, cp, page };
  }

  if (input.mode === "id") {
    const q = input.q.replace(/\s/g, "");
    if (!/^\d{9}$|^\d{14}$/.test(q)) fail("invalid_id", 400);
    return { mode: "id", q, page };
  }

  if (input.mode === "geo") {
    const lat = parseCoord(input.lat);
    const lon = parseCoord(input.lon);
    if (lat === null || lat < -90 || lat > 90) fail("invalid_lat", 400);
    if (lon === null || lon < -180 || lon > 180) fail("invalid_lon", 400);
    const radiusRaw = input.radius.trim();
    const radius = radiusRaw ? parseCoord(radiusRaw) : 10;
    if (radius === null || radius <= 0 || radius > 50) fail("invalid_radius", 400);
    const sections = [
      ...new Set(
        input.sections
          .toUpperCase()
          .split(",")
          .map((part) => part.trim())
          .filter((part): part is (typeof NAF_SECTIONS)[number] =>
            (NAF_SECTIONS as readonly string[]).includes(part),
          ),
      ),
    ];
    return {
      mode: "geo",
      lat: String(lat),
      lon: String(lon),
      radius: String(Math.round(radius * 10) / 10),
      sections: sections.length > 0 && sections.length < NAF_SECTIONS.length ? sections.join(",") : "",
      page,
    };
  }

  fail("upstream", 400);
}

function buildUrl(prepared: Prepared): string {
  const params = new URLSearchParams();
  params.set("page", String(prepared.page));
  params.set("per_page", String(PER_PAGE));
  params.set("limite_matching_etablissements", String(MATCHING_LIMIT));

  if (prepared.mode === "geo") {
    params.set("lat", prepared.lat);
    params.set("long", prepared.lon);
    params.set("radius", prepared.radius);
    if (prepared.sections) params.set("section_activite_principale", prepared.sections);
    return `${NEAR_URL}?${params}`;
  }

  params.set("q", prepared.q);
  if (prepared.mode === "name" && prepared.cp) params.set("code_postal", prepared.cp);
  return `${SEARCH_URL}?${params}`;
}

export async function searchEntreprises(
  input: CompanySearchInput,
): Promise<CompanySearchResponse> {
  const url = buildUrl(prepare(input));
  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "ClementDaguenetPortfolio/1.0 (+https://clement-daguenet.fr)",
      },
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    fail("upstream", 502);
  }

  if (response.status === 429) fail("rate_limited", 429);
  if (!response.ok) fail("upstream", 502);

  try {
    return flatten(await response.json());
  } catch (error) {
    if (error instanceof CompanySearchException) throw error;
    fail("upstream", 502);
  }
}
