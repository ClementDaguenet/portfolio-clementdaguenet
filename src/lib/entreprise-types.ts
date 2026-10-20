export const NAF_SECTIONS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
] as const;

export type NafSection = (typeof NAF_SECTIONS)[number];

export type CompanySearchError =
  | "query_short"
  | "invalid_id"
  | "invalid_postal"
  | "invalid_lat"
  | "invalid_lon"
  | "invalid_radius"
  | "rate_limited"
  | "upstream";

export type CompanyDirector = {
  name: string;
  role: string;
};

export type CompanyFinance = {
  year: string;
  revenue: number | null;
  netIncome: number | null;
};

export type EstablishmentCard = {
  id: string;
  name: string;
  siren: string;
  siret: string;
  address: string;
  city: string;
  postalCode: string;
  activityCode: string;
  activityLabel: string;
  section: string;
  status: string;
  isHeadOffice: boolean;
  createdAt: string;
  category: string;
  headcount: string;
  openEstablishments: number;
  totalEstablishments: number;
  lat: string;
  lon: string;
  directors: CompanyDirector[];
  finances: CompanyFinance[];
  badges: string[];
};

export type CompanySearchResponse = {
  page: number;
  totalPages: number;
  totalResults: number;
  results: EstablishmentCard[];
};

export type CompanySearchInput = {
  mode: string;
  q: string;
  cp: string;
  lat: string;
  lon: string;
  radius: string;
  sections: string;
  page: string;
};
