import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageTransition } from "@/components/PageTransition";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <PageTransition>
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-16 md:px-6">
        <div className="w-full overflow-hidden rounded-xl border border-[#1e293b] bg-[#0f172a] shadow-[0_20px_50px_-20px_rgba(15,23,42,0.6)]">
          <div className="flex items-center gap-2 border-b border-[#1e293b] bg-[#1e293b] px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#eab308]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
            <span className="ml-3 font-mono text-xs text-[#94a3b8]">{t("prompt")}</span>
          </div>
          <div className="space-y-3 p-6 font-mono text-sm leading-relaxed text-[#e2e8f0] md:p-8 md:text-base">
            <p>
              <span className="text-[#22c55e]">$</span> cat error.log
            </p>
            <p className="text-[#f87171]">{t("line1")}</p>
            <p className="text-[#94a3b8]">{t("line2")}</p>
            <p className="text-[#94a3b8]">{t("line3")}</p>
            <p className="pt-2">
              <span className="text-[#22c55e]">$</span>{" "}
              <Link href="/" className="text-[#60a5fa] underline">
                cd /
              </Link>
              <span className="ml-2 animate-pulse text-[#64748b]">█</span>
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex rounded-md border border-[#334155] px-4 py-2 text-[#e2e8f0] transition hover:border-[#60a5fa] hover:text-[#60a5fa]"
            >
              {t("home")}
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
