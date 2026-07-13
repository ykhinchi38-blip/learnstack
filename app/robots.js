import { site } from "@/lib/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/maintenance", "/offline"]
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/maintenance", "/offline"]
      }
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url
  };
}
