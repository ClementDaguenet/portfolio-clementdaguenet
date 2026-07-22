import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";
import { PRO_CONTENT_FILES } from "@/lib/admin-files";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const files = Object.entries(PRO_CONTENT_FILES).map(([key, value]) => ({
  key,
  label: value.label,
}));

const imageSpecs = [
  {
    label: "Favicon (onglet navigateur)",
    size: "32 × 32 px (ou 48 × 48)",
    hint: "fichier .ico",
    jsonField: "Images / chemins site → favicon",
  },
  {
    label: "Photo portrait (headshot)",
    size: "400 × 400 px",
    hint: "carré, visage centré",
    jsonField: "Images / chemins site → headshot",
  },
  {
    label: "Aperçu projet",
    size: "1200 × 750 px",
    hint: "16:10, une par projet",
    jsonField: "proProjects.json → image",
  },
  {
    label: "Open Graph / partage",
    size: "1200 × 630 px",
    hint: "réseaux sociaux",
    jsonField: "Images / chemins site → ogImage",
  },
];

export default function AdminPage() {
  return (
    <AdminPanel title="Admin PRO" files={files} imageSpecs={imageSpecs} />
  );
}
