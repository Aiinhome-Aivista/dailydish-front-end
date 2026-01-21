import { createContext, useContext, useRef, type ReactNode } from "react";
import { Toast } from "primereact/toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";




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
      toast.current.show({
        severity,
        summary,
        detail,
        life,
        className: "p-0 bg-transparent border-none shadow-none",
       content: (props: any) => {
  const styles = {
    success: {
      bg: "bg-[#829F70]",
      border: "border-[#95B974]",
      icon: <CheckCircle className="w-6 h-6 text-[#95B974]" />,
    },
    info: {
      bg: "bg-blue-900",
      border: "border-blue-500",
      icon: <Info className="w-6 h-6 text-blue-400" />,
    },
    warn: {
      bg: "bg-yellow-900",
      border: "border-yellow-500",
      icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
    },
    error: {
      bg: "bg-red-900",
      border: "border-red-500",
      icon: <AlertCircle className="w-6 h-6 text-red-400" />,
    },
  };

  const style = styles[severity];

  return (
    <div
      className={`relative flex items-center gap-4 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl min-w-[350px] transition-all duration-300 hover:scale-[1.02] ${style.bg} ${style.border}`}
    >
      {/* Left Icon */}
      <div className="p-2 bg-white/10 rounded-full shadow-inner">
        {style.icon}
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3 className="text-[#FAF1E4] font-bold text-lg tracking-wide">
          {props.message.summary}
        </h3>
        <p className="text-white/80 text-sm font-medium mt-0.5 leading-relaxed">
          {props.message.detail}
        </p>
      </div>

      {/* Divider */}
      <div className="h-12 w-[1px] bg-white/10 mx-2"></div>

      {/* Custom Close Icon */}
      <button
        onClick={props.onClose}
        className="p-2 rounded-full bg-white/10 shadow-inner hover:bg-white/20 active:scale-90 transition"
        aria-label="Close"
      >
        {/* <AlertCircle className="w-5 h-5 text-white/70" /> */}
        <span className="material-symbols-outlined">
close
</span>
      </button>
    </div>
  );
}

      });
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
