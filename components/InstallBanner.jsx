"use client";

import { useEffect, useRef, useState } from "react";

const DISMISSED_KEY = "learnstack_install_banner_dismissed";

function isIosSafari() {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(userAgent);
  const isStandalone = window.navigator.standalone === true;
  return isIos && !isStandalone;
}

export default function InstallBanner() {
  const deferredPrompt = useRef(null);
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return undefined;
    if (window.localStorage.getItem(DISMISSED_KEY)) return undefined;

    const isIos = isIosSafari();
    setIos(isIos);

    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      deferredPrompt.current = event;
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const timer = window.setTimeout(() => {
      if (!window.localStorage.getItem(DISMISSED_KEY) && (deferredPrompt.current || isIos)) {
        setVisible(true);
      }
    }, 30000);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function install() {
    const prompt = deferredPrompt.current;
    if (!prompt) return;

    await prompt.prompt();
    const choice = await prompt.userChoice;
    deferredPrompt.current = null;
    setVisible(false);

    if (choice?.outcome === "accepted") {
      window.localStorage.setItem(DISMISSED_KEY, "true");
    }
  }

  function dismiss() {
    window.localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="installBanner" role="region" aria-label="Install LearnStack app">
      <p>{ios ? "Tap Share -> Add to Home Screen" : "Add LearnStack to your home screen for quick access"}</p>
      <div>
        {!ios && <button type="button" className="install" onClick={install}>Install</button>}
        <button type="button" className="dismiss" onClick={dismiss}>Not now</button>
      </div>
      <style jsx>{`
        .installBanner {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1080;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-top: 2px solid #2d6be4;
          background: #0d1b3e;
          color: #ffffff;
          padding: 14px max(18px, calc((100vw - var(--container)) / 2));
        }

        p {
          color: #ffffff;
          font-weight: 900;
        }

        div {
          display: flex;
          gap: 10px;
          flex: 0 0 auto;
        }

        button {
          min-height: 38px;
          border: 2px solid #ffffff;
          padding: 8px 12px;
          font-weight: 900;
        }

        .install {
          background: #2d6be4;
          color: #ffffff;
        }

        .dismiss {
          background: #ffffff;
          color: #0d1b3e;
        }

        @media (max-width: 680px) {
          .installBanner,
          div {
            display: grid;
          }

          div,
          button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
