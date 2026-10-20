export type Locale = "fr" | "en";

export type TimelineType = "work" | "education" | "project" | "life";

export interface ProProject {
  id: string;
  title: string;
  summaryFr: string;
  summaryEn: string;
  techs: string[];
  url: string;
  image: string;
  featured: boolean;
}

export interface ProProjectsData {
  projects: ProProject[];
}

export interface TimelineItem {
  id: string;
  date: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  type: TimelineType;
}

export interface ProTimelineData {
  timeline: TimelineItem[];
}

export interface ProSkillsData {
  skills: string[];
}

export interface PricingOffer {
  id: string;
  nameFr: string;
  nameEn: string;
  priceFr: string;
  priceEn: string;
  featured?: boolean;
  badgeFr?: string;
  badgeEn?: string;
  itemsFr: string[];
  itemsEn: string[];
}

export interface PricingLine {
  id: string;
  labelFr: string;
  labelEn: string;
  priceFr: string;
  priceEn: string;
}

export interface ProPricingData {
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  introFr: string;
  introEn: string;
  vatNoteFr: string;
  vatNoteEn: string;
  web: {
    titleFr: string;
    titleEn: string;
    introFr: string;
    introEn: string;
    offers: PricingOffer[];
  };
  extras: {
    titleFr: string;
    titleEn: string;
    noteFr: string;
    noteEn: string;
    items: PricingLine[];
  };
  maintenance: {
    titleFr: string;
    titleEn: string;
    noteFr: string;
    noteEn: string;
    plans: PricingOffer[];
  };
  writing: {
    titleFr: string;
    titleEn: string;
    introFr: string;
    introEn: string;
    items: PricingLine[];
  };
  custom: {
    titleFr: string;
    titleEn: string;
    bodyFr: string;
    bodyEn: string;
  };
  conditions: {
    titleFr: string;
    titleEn: string;
    itemsFr: string[];
    itemsEn: string[];
  };
  cta: {
    titleFr: string;
    titleEn: string;
    bodyFr: string;
    bodyEn: string;
  };
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}
