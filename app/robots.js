import { site } from "@/lib/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      },
      {
        userAgent: "Googlebot",
        allow: "/"
      }
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url
  };
}
