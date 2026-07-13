"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export function TrackedLink({ eventName, eventParams, onClick, ...props }) {
  function handleClick(event) {
    trackEvent(eventName, eventParams);
    onClick?.(event);
  }

  return <Link {...props} onClick={handleClick} />;
}

export function TrackedExternalLink({ eventName, eventParams, onClick, ...props }) {
  function handleClick(event) {
    trackEvent(eventName, eventParams);
    onClick?.(event);
  }

  return <a {...props} onClick={handleClick} />;
}
