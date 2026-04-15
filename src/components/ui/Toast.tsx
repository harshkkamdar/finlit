"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantConfig: Record<
  ToastVariant,
  { icon: typeof CheckCircle; bg: string; border: string; text: string }
> = {
  success: {
    icon: CheckCircle,
    bg: "bg-primary-light",
    border: "border-primary/20",
    text: "text-primary",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-50",
    border: "border-error/20",
    text: "text-error",
  },
  info: {
    icon: Info,
    bg: "bg-blue-50",
    border: "border-blue-300/30",
    text: "text-blue-600",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, variant }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const config = variantConfig[t.variant];
            const Icon = config.icon;

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`
                  pointer-events-auto flex items-center gap-3
                  px-4 py-3 rounded-xl border shadow-lg
                  min-w-[320px] max-w-[420px]
                  ${config.bg} ${config.border}
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${config.text}`} />
                <p className="text-sm font-body text-dark flex-1">
                  {t.message}
                </p>
                <button
                  onClick={() => removeToast(t.id)}
                  className="shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4 text-muted" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
