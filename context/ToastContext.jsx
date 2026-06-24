"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import Toast from "@/components/Toast";

export const ToastContext = createContext({
  showToast: () => {}
});

const TOAST_DURATION = 2500;
const EXIT_DURATION = 300;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, message, type, exiting: false }]);

    window.setTimeout(() => {
      setToasts((current) => current.map((toast) => (
        toast.id === id ? { ...toast, exiting: true } : toast
      )));
    }, TOAST_DURATION);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, TOAST_DURATION + EXIT_DURATION);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toasts={toasts} />
    </ToastContext.Provider>
  );
}
