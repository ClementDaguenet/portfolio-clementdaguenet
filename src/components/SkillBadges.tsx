export function SkillBadges({ skills }: { skills: string[] }) {
  return (
    <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
      {skills.map((skill) => (
        <li
          key={skill}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-sm text-[var(--color-text)] shadow-sm"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}
