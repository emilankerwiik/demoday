export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://demoday.work/sitemap.xml",
    host: "https://demoday.work",
  };
}
