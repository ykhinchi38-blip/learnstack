"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { hasAnalyticsConsent } from "@/lib/cookieConsent";

export default function ConsentAwareAnalytics({ measurementId }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function updateConsent() {
      setEnabled(hasAnalyticsConsent());
    }

    updateConsent();
    window.addEventListener("learnstack:cookie-consent", updateConsent);
    return () => window.removeEventListener("learnstack:cookie-consent", updateConsent);
  }, []);

  return enabled ? <GoogleAnalytics gaId={measurementId} /> : null;
}
