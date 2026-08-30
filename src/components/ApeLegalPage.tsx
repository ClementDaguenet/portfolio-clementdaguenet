import Link from "next/link";

type ApeLegalPageProps = {
  title: string;
  otherPage: { href: string; label: string };
  children: React.ReactNode;
};

export function ApeLegalPage({ title, otherPage, children }: ApeLegalPageProps) {
  return (
    <main className="mx-auto max-w-[42rem] px-5 py-10 font-[family-name:var(--font-body)] leading-relaxed text-[var(--color-text)]">
      <p className="text-sm font-semibold text-[var(--color-primary)]">À Politique Égale</p>
      <nav className="mt-2 text-sm text-[var(--color-muted)]">
        <Link href={otherPage.href} className="text-[var(--color-accent)] hover:underline">
          {otherPage.label}
        </Link>
      </nav>
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl text-[var(--color-primary)]">
        {title}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">Last updated: 30 August 2026</p>
      <div className="mt-8 space-y-8 [&_a]:text-[var(--color-accent)] [&_a]:underline [&_code]:rounded [&_code]:bg-[var(--color-border)] [&_code]:px-1 [&_code]:text-sm [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-xl [&_h2]:text-[var(--color-primary)] [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </main>
  );
}
