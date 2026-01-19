import { createContext, useContext, useRef, type ReactNode } from "react";
import { Toast } from "primereact/toast";




// --- Types ---
// PrimeReact accepts specific strings for severity
type ToastSeverity = "success" | "info" | "warn" | "error";
interface ToastContextType {
  showToast: (
    severity: ToastSeverity,
    summary: string,
    detail: string,
    life?: number
  ) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}


// --- Context Creation ---
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// --- Provider Component ---
export const ToastProvider = ({ children }: ToastProviderProps) => {
  // We type the ref as <Toast> so TypeScript knows .show() exists on it
  const toast = useRef<Toast>(null);

  const showToast = (
    severity: ToastSeverity,
    summary: string,
    detail: string,
    life = 3000
  ) => {
    if (toast.current) {
      toast.current.show({ severity, summary, detail, life });
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toast} position="top-right" />
      {children}
    </ToastContext.Provider>
  );
};

// --- Custom Hook ---
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
