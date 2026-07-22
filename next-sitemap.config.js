/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://clement-daguenet.fr",
  generateRobotsTxt: true,
  exclude: ["/admin", "/api/*"],
  changefreq: "monthly",
  priority: 0.7,
};
