"use client";

const toastMeta = {
  success: { icon: "✓", color: "#22c55e" },
  error: { icon: "✕", color: "#e53e3e" },
  info: { icon: "ℹ", color: "#2d6be4" }
};

export default function Toast({ toasts }) {
  return (
    <div className="toastStack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => {
        const meta = toastMeta[toast.type] || toastMeta.info;

        return (
          <div className={`toast ${toast.exiting ? "exiting" : ""}`} style={{ "--toast-color": meta.color }} key={toast.id}>
            <span className="toastIcon" aria-hidden="true">{meta.icon}</span>
            <span>{toast.message}</span>
          </div>
        );
      })}
      <style jsx>{`
        .toastStack {
          position: fixed;
          right: 24px;
          bottom: 90px;
          z-index: 1200;
          display: grid;
          gap: 8px;
          pointer-events: none;
        }

        .toast {
          min-width: 220px;
          max-width: min(360px, calc(100vw - 32px));
          display: flex;
          align-items: center;
          gap: 10px;
          border: 2px solid #0d1b3e;
          border-left: 4px solid var(--toast-color);
          background: #ffffff;
          box-shadow: 4px 4px 0 #0d1b3e;
          color: #0d1b3e;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 900;
          line-height: 1.3;
          animation: toastIn 0.3s ease both;
        }

        .toast.exiting {
          animation: toastOut 0.3s ease both;
        }

        .toastIcon {
          color: var(--toast-color);
          font-weight: 900;
        }

        @keyframes toastIn {
          from {
            transform: translateX(120%);
          }

          to {
            transform: translateX(0);
          }
        }

        @keyframes toastOut {
          to {
            transform: translateX(120%);
          }
        }

        @media (max-width: 680px) {
          .toastStack {
            right: 14px;
            left: 14px;
            bottom: 144px;
          }

          .toast {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
