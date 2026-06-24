"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const OFFLINE_PATH = "/offline";
const PREVIOUS_PATH_KEY = "learnstack_previous_online_path";

export default function NetworkStatusManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return undefined;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline support is progressive; the site should still work without it.
    });

    return undefined;
  }, []);

  useEffect(() => {
    function saveCurrentPath() {
      if (window.location.pathname !== OFFLINE_PATH) {
        window.sessionStorage.setItem(
          PREVIOUS_PATH_KEY,
          `${window.location.pathname}${window.location.search}${window.location.hash}`
        );
      }
    }

    function handleOffline() {
      if (window.location.pathname === OFFLINE_PATH) return;
      saveCurrentPath();
      window.location.assign(OFFLINE_PATH);
    }

    function handleOnline() {
      saveCurrentPath();
    }

    if (navigator.onLine === false) {
      handleOffline();
    } else {
      saveCurrentPath();
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [pathname]);

  return null;
}
