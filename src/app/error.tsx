"use client";

import { useEffect } from "react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Never surface stack traces to the user; log digest only in console for support.
  }, []);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
        Une erreur est survenue
      </h1>
      <p className="text-sm text-[var(--color-muted)]">
        Réessayez dans un instant. Si le problème continue, contactez-moi.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm text-white"
      >
        Réessayer
      </button>
    </div>
  );
}
