import path from "path";

export const PRO_CONTENT_FILES = {
  projects: {
    label: "Projets",
    relativePath: "src/data/proProjects.json",
  },
  timeline: {
    label: "Timeline / CV",
    relativePath: "src/data/proTimeline.json",
  },
  skills: {
    label: "Competences",
    relativePath: "src/data/proSkills.json",
  },
  site: {
    label: "Images / chemins site",
    relativePath: "src/data/proSite.json",
  },
  textsFr: {
    label: "Textes UI (FR)",
    relativePath: "src/messages/fr.json",
  },
  textsEn: {
    label: "Textes UI (EN)",
    relativePath: "src/messages/en.json",
  },
} as const;

export type ProContentKey = keyof typeof PRO_CONTENT_FILES;

export function resolveProDataPath(key: ProContentKey) {
  return path.join(process.cwd(), PRO_CONTENT_FILES[key].relativePath);
}

export const PRO_UPLOAD_DIR = path.join(process.cwd(), "public", "images", "pro");
export const PRO_UPLOAD_PUBLIC = "/images/pro";
