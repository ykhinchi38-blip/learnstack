import { GoogleAnalytics } from "@next/third-parties/google";
import NextTopLoader from "nextjs-toploader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import NetworkStatusManager from "@/components/NetworkStatusManager";
import CookieBanner from "@/components/CookieBanner";
import ScrollToTop from "@/components/ScrollToTop";
import SlowConnectionWarner from "@/components/SlowConnectionWarner";
import InstallBanner from "@/components/InstallBanner";
import { ToastProvider } from "@/context/ToastContext";
import { createMetadata, defaultDescription, defaultTitle, seoKeywords, titleTemplate } from "@/lib/seo";
import "@/styles/globals.css";

export const metadata = {
  ...createMetadata({
    title: defaultTitle,
    description: defaultDescription,
    path: "/"
  }),
  title: {
    default: defaultTitle,
    template: titleTemplate
  },
  description: defaultDescription,
  keywords: seoKeywords,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LearnStack"
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  },
  other: {
    "mobile-web-app-capable": "yes"
  }
};

export const viewport = {
  themeColor: "#2d6be4"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body>
        <NextTopLoader
          color="#2d6be4"
          height={3}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2d6be4, 0 0 5px #2d6be4"
        />
        <ToastProvider>
          <LoadingScreen />
          <NetworkStatusManager />
          <SlowConnectionWarner />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CookieBanner />
          <ScrollToTop />
          <InstallBanner />
        </ToastProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
)}
    </html>
  );
}
