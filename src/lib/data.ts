import { readFileSync } from "fs";
import path from "path";
import type {
  ProProject,
  ProProjectsData,
  ProSkillsData,
  ProTimelineData,
  TimelineItem,
} from "@/types";

function readJson<T>(relativePath: string): T {
  const full = path.join(process.cwd(), relativePath);
  const raw = readFileSync(full, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as T;
}

export function getProjects(): ProProject[] {
  return readJson<ProProjectsData>("src/data/proProjects.json").projects;
}

export function getFeaturedProjects(): ProProject[] {
  return getProjects().filter((p) => p.featured);
}

export function getTimeline(): TimelineItem[] {
  return readJson<ProTimelineData>("src/data/proTimeline.json").timeline;
}

export function getTimelineExcerpt(count = 3): TimelineItem[] {
  return getTimeline().slice(0, count);
}

export function getSkills(): string[] {
  return readJson<ProSkillsData>("src/data/proSkills.json").skills;
}

export type ProSiteSettings = {
  headshot: string;
  ogImage: string;
  cvPath: string;
  favicon: string;
};

export function getSiteSettings(): ProSiteSettings {
  return readJson<ProSiteSettings>("src/data/proSite.json");
}
