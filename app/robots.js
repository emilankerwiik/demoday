export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // Allow AI crawlers explicitly (GEO / LLM discovery).
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "DuckDuckBot", allow: "/" },
    ],
    sitemap: "https://demoday.work/sitemap.xml",
    host: "https://demoday.work",
  };
}
