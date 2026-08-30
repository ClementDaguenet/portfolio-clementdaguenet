import type { Metadata } from "next";
import { ApeLegalPage } from "@/components/ApeLegalPage";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy · À Politique Égale" },
  description: "Privacy Policy for the À Politique Égale editorial tool.",
  robots: { index: false, follow: false },
};

export default function ApePrivacyPage() {
  return (
    <ApeLegalPage
      title="Privacy Policy"
      otherPage={{ href: "/ape/terms", label: "Terms of Service" }}
    >
      <section>
        <h2>1. Who we are</h2>
        <p>
          This policy describes how Clément Daguenet, operator of the TikTok account{" "}
          <a href="https://www.tiktok.com/@a.politique.egale">@a.politique.egale</a>, handles data
          in the local editorial tool &ldquo;À Politique Égale&rdquo;.
        </p>
        <p>
          The tool is single-user and runs on the operator&apos;s own computer. It is not a public
          website that collects visitor accounts.
        </p>
      </section>

      <section>
        <h2>2. Data stored locally</h2>
        <p>On the operator&apos;s machine, the tool may store:</p>
        <ul>
          <li>editorial content (topics, sources, post drafts, slides)</li>
          <li>planning dates and publication status</li>
          <li>exported images</li>
          <li>if TikTok is connected: access token, refresh token, and open ID issued by TikTok</li>
        </ul>
        <p>
          This data is kept in a local database and environment file. It is not sold and not used for
          advertising.
        </p>
      </section>

      <section>
        <h2>3. Data received from TikTok</h2>
        <p>
          If the operator connects TikTok via the official OAuth flow, TikTok may provide a user
          identifier and tokens needed to publish content the operator has approved. We request only
          the scopes needed to identify the account and to post photo carousels (
          <code>user.info.basic</code>, <code>video.publish</code>, <code>video.upload</code>).
        </p>
        <p>
          Tokens stay on the operator&apos;s computer. They are not committed to Git and not shared
          with third parties.
        </p>
      </section>

      <section>
        <h2>4. Data sent to TikTok</h2>
        <p>
          Only when the operator explicitly publishes: the chosen images, title/description, and the
          privacy options required by TikTok&apos;s Content Posting API. TikTok then processes that
          content under{" "}
          <a href="https://www.tiktok.com/legal/page/eea/privacy-policy/en">
            TikTok&apos;s privacy policy
          </a>
          .
        </p>
      </section>

      <section>
        <h2>5. These public pages</h2>
        <p>
          The static pages that host these legal texts do not use analytics cookies and do not create
          user accounts. A hosting provider may collect standard server logs (IP, date, pages
          requested).
        </p>
      </section>

      <section>
        <h2>6. Retention</h2>
        <p>
          Local editorial data stays until the operator deletes it. TikTok tokens are kept until the
          operator disconnects the account or the token expires. Published posts remain on TikTok
          until the operator removes them in TikTok.
        </p>
      </section>

      <section>
        <h2>7. Your rights</h2>
        <p>
          There is no public end-user database. If you are a person whose information appears in a
          published TikTok post, contact the operator via{" "}
          <a href="https://www.tiktok.com/@a.politique.egale">@a.politique.egale</a>. The operator
          is based in France. Applicable rules include the GDPR for any personal data processed in
          this tool.
        </p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>
          Privacy questions:{" "}
          <a href="mailto:a.politique.egale@gmail.com">a.politique.egale@gmail.com</a> or{" "}
          <a href="https://www.tiktok.com/@a.politique.egale">@a.politique.egale</a>.
        </p>
      </section>

      <section>
        <h2>Politique de confidentialité (FR)</h2>
        <p>
          L&apos;outil tourne en local, pour un seul éditeur. Les contenus, sources et jetons TikTok
          restent sur son ordinateur. Rien n&apos;est vendu. Une connexion TikTok n&apos;envoie des
          images que si l&apos;éditeur valide explicitement une publication, via l&apos;API
          officielle. Les visiteurs de ces pages légales n&apos;ont pas de compte. Contact :{" "}
          <a href="https://www.tiktok.com/@a.politique.egale">@a.politique.egale</a>.
        </p>
      </section>
    </ApeLegalPage>
  );
}
