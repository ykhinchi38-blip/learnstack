"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isAnalyticsConfigured, trackEvent } from "@/lib/analytics";

export default function AnalyticsPageView({ eventName, eventParams = {} }) {
  const pathname = usePathname();
  const tracked = useRef("");
  const paramsKey = JSON.stringify(eventParams);

  useEffect(() => {
    const key = `${eventName}:${pathname}:${paramsKey}`;
    function sendPageView() {
      if (tracked.current === key || !isAnalyticsConfigured()) return;

      tracked.current = key;
      trackEvent(eventName, { ...eventParams, page_path: pathname });
    }

    sendPageView();
    window.addEventListener("learnstack:cookie-consent", sendPageView);
    return () => window.removeEventListener("learnstack:cookie-consent", sendPageView);
  }, [eventName, eventParams, paramsKey, pathname]);

  return null;
}
