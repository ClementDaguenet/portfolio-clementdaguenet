import type { Metadata } from "next";
import { ApeLegalPage } from "@/components/ApeLegalPage";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service · À Politique Égale" },
  description: "Terms of Service for the À Politique Égale editorial tool.",
  robots: { index: false, follow: false },
};

export default function ApeTermsPage() {
  return (
    <ApeLegalPage
      title="Terms of Service"
      otherPage={{ href: "/ape/privacy", label: "Privacy Policy" }}
    >
      <section>
        <h2>1. What this is</h2>
        <p>
          À Politique Égale is a private, local editorial tool operated by Clément Daguenet for the
          TikTok account{" "}
          <a href="https://www.tiktok.com/@a.politique.egale">@a.politique.egale</a>. It prepares
          sourced political-information carousels (images) and may publish them through TikTok&apos;s
          official Content Posting API after human review.
        </p>
        <p>
          The tool does not support any candidate, party, or movement. It is not a public social
          network and it is not open to other users.
        </p>
      </section>

      <section>
        <h2>2. Who may use it</h2>
        <p>
          Only the operator of @a.politique.egale. There are no third-party accounts. If you reached
          these pages from TikTok&apos;s developer review, you are reading the legal terms of that
          operator&apos;s integration, not a consumer app store listing.
        </p>
      </section>

      <section>
        <h2>3. TikTok</h2>
        <p>
          Connecting TikTok is optional. When connected, the operator authorizes this tool to request
          official scopes (identity and content posting) and to publish photo carousels that the
          operator has already validated. TikTok remains a separate service. TikTok&apos;s own terms
          apply to anything that happens on TikTok.
        </p>
        <p>No unofficial automation, scraping, or simulated posting is used.</p>
      </section>

      <section>
        <h2>4. Content</h2>
        <p>
          The operator is solely responsible for the accuracy, sources, and legality of published
          content. Drafts stay on the operator&apos;s computer until they choose to export or publish.
          A draft is never sent to TikTok automatically.
        </p>
      </section>

      <section>
        <h2>5. Availability</h2>
        <p>
          The software runs locally. There is no uptime commitment. Features may change. TikTok may
          refuse, delay, or limit API publishing.
        </p>
      </section>

      <section>
        <h2>6. Liability</h2>
        <p>
          The tool is provided as-is for the operator&apos;s editorial work. To the extent permitted
          by French law, the operator is not liable for TikTok outages, API policy changes, or
          third-party use of content once it is public on TikTok.
        </p>
      </section>

      <section>
        <h2>7. Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a href="mailto:a.politique.egale@gmail.com">a.politique.egale@gmail.com</a> or the TikTok
          account <a href="https://www.tiktok.com/@a.politique.egale">@a.politique.egale</a>.
        </p>
      </section>

      <section>
        <h2>Conditions d&apos;utilisation (FR)</h2>
        <p>
          À Politique Égale est un outil éditorial local, privé, utilisé uniquement par l&apos;éditeur
          du compte TikTok @a.politique.egale. Il prépare des carrousels d&apos;information politique
          sourcée. Aucun soutien à un candidat, parti ou mouvement. La publication vers TikTok, si
          elle est activée, passe uniquement par l&apos;API officielle, après validation humaine. Un
          brouillon n&apos;est jamais envoyé automatiquement. TikTok reste un service distinct,
          soumis à ses propres conditions.
        </p>
      </section>
    </ApeLegalPage>
  );
}
