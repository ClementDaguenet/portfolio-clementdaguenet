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

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}
