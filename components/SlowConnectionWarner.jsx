"use client";

import { useEffect, useState } from "react";

const DISMISSED_KEY = "learnstack_slow_connection_dismissed";
const SHOWN_KEY = "learnstack_slow_connection_shown";
const SLOW_TYPES = new Set(["slow-2g", "2g"]);

export default function SlowConnectionWarner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(DISMISSED_KEY) || window.sessionStorage.getItem(SHOWN_KEY)) {
      return undefined;
    }

    let cancelled = false;
    let hideTimer;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    function showWarning() {
      if (cancelled || window.sessionStorage.getItem(DISMISSED_KEY) || window.sessionStorage.getItem(SHOWN_KEY)) {
        return;
      }

      window.sessionStorage.setItem(SHOWN_KEY, "true");
      setClosing(false);
      setVisible(true);
      hideTimer = window.setTimeout(() => {
        setClosing(true);
        window.setTimeout(() => setVisible(false), 260);
      }, 7000);
    }

    function updateFromConnection() {
      if (cancelled) return;

      if (connection && SLOW_TYPES.has(connection.effectiveType)) {
        showWarning();
        return;
      }

      setVisible(false);
    }

    async function checkFetchSpeed() {
      const startedAt = performance.now();

      try {
        await fetch(`/network-check.txt?slow-check=${Date.now()}`, { cache: "no-store" });
        if (!cancelled && performance.now() - startedAt > 3000) {
          showWarning();
        }
      } catch {
        if (!cancelled && navigator.onLine) {
          showWarning();
        }
      }
    }

    updateFromConnection();
    checkFetchSpeed();
    connection?.addEventListener?.("change", updateFromConnection);

    return () => {
      cancelled = true;
      window.clearTimeout(hideTimer);
      connection?.removeEventListener?.("change", updateFromConnection);
    };
  }, []);

  function dismiss() {
    window.sessionStorage.setItem(DISMISSED_KEY, "true");
    setClosing(true);
    window.setTimeout(() => setVisible(false), 260);
  }

  if (!visible) return null;

  return (
    <div className={`slowToast ${closing ? "closing" : ""}`} role="status">
      <span className="statusDot" aria-hidden="true" />
      <p>Slow network detected. Some previews may take a little longer to load.</p>
      <button type="button" aria-label="Dismiss slow network warning" onClick={dismiss}>x</button>
      <style jsx>{`
        .slowToast {
          position: fixed;
          right: 22px;
          bottom: 156px;
          z-index: 1090;
          width: min(360px, calc(100vw - 32px));
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 10px;
          border: 2px solid #2d6be4;
          background: #0d1b3e;
          color: #ffffff;
          box-shadow: 4px 4px 0 #ffde59;
          padding: 12px;
          animation: toastIn 0.28s ease both;
          transition: transform 0.26s ease, opacity 0.26s ease;
        }

        .slowToast.closing {
          opacity: 0;
          transform: translateY(18px);
        }

        .statusDot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ffde59;
          box-shadow: 0 0 0 5px rgba(255, 222, 89, 0.18);
        }

        p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          font-weight: 800;
          line-height: 1.35;
        }

        button {
          width: 26px;
          height: 26px;
          border: 2px solid rgba(255, 255, 255, 0.72);
          background: transparent;
          color: #ffffff;
          font-weight: 900;
          line-height: 1;
        }

        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 680px) {
          .slowToast {
            left: 12px;
            right: 12px;
            bottom: 132px;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}
