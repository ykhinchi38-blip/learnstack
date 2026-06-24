import { createRequire } from "module";

const require = createRequire(import.meta.url);

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  sw: "pwa-sw.js",
  scope: "/pwa/"
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "public-files.gumroad.com" },
      { protocol: "https", hostname: "gumroad.com" },
      { protocol: "https", hostname: "static-2.gumroad.com" },
      { protocol: "https", hostname: "public-files.gumroad.com" }
    ]
  }
};

export default withPWA(nextConfig);
