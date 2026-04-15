import "./globals.css";

const SITE_URL = "https://demoday.work";
const GITHUB_URL = "https://github.com/emilankerwiik/demoday";
const TITLE = "Demoday — Beautiful clickable product demos, open source";
const DESCRIPTION =
  "Demoday is an open-source coding agent skill that turns your product into an embeddable clickable demo — works with Claude Code, Cursor, and Codex. Self-contained HTML dropped into your landing page as a single iframe. Free forever.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Demoday",
  },
  description: DESCRIPTION,
  keywords: [
    "clickable demo",
    "clickable product demo",
    "interactive product demo",
    "embeddable demo",
    "embeddable product demo",
    "product walkthrough",
    "landing page demo",
    "SaaS demo tool",
    "product demo software",
    "iframe demo",
    "HTML product demo",
    "Arcade alternative",
    "Storylane alternative",
    "Navattic alternative",
    "free product demo tool",
    "open source demo tool",
    "open source product demo",
    "Claude Code skill",
    "Claude Code",
    "Cursor skill",
    "Cursor",
    "Codex skill",
    "Codex",
    "coding agent skill",
    "AI product demo",
    "demo for startups",
    "YC startup landing page",
    "demoday",
  ],
  applicationName: "Demoday",
  authors: [{ name: "Demoday" }],
  creator: "Demoday",
  publisher: "Demoday",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Demoday",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1678,
        height: 1674,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@demoday",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Demoday",
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Marketing & Sales Software",
  operatingSystem: "Any",
  description: DESCRIPTION,
  url: SITE_URL,
  downloadUrl: "https://www.npmjs.com/package/@demoday/skill",
  installUrl: "https://www.npmjs.com/package/@demoday/skill",
  codeRepository: GITHUB_URL,
  license: "https://github.com/emilankerwiik/demoday/blob/main/LICENSE",
  isAccessibleForFree: true,
  softwareVersion: "1.0",
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
      description: "Unlimited demos with a Demoday badge.",
    },
    {
      "@type": "Offer",
      name: "Your Brand",
      price: "20",
      priceCurrency: "USD",
      description:
        "One-time upgrade that replaces the Demoday badge with your own brand across every demo.",
    },
  ],
  aggregateRating: undefined,
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Demoday",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  sameAs: [
    "https://www.npmjs.com/package/@demoday/skill",
    GITHUB_URL,
  ],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Demoday",
  url: SITE_URL,
  description: DESCRIPTION,
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a clickable demo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An interactive walkthrough visitors can click through right on your landing page — no video, no signup. Demoday ships it as a single self-contained HTML file.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I use it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Anywhere you can paste a single iframe tag — Webflow, Framer, WordPress, Next.js, Astro, Ghost, MDX, or plain HTML.",
      },
    },
    {
      "@type": "Question",
      name: "How do I update it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Re-run the skill. The demo is a file in your repo, so updating it is a normal code change — reviewable via pull request.",
      },
    },
    {
      "@type": "Question",
      name: "What is the alternative?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Screen recordings. They are stiff, not interactive, and go stale the moment your UI changes. Demoday ships a playful, clickable surface you refresh whenever you ship.",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </body>
    </html>
  );
}
