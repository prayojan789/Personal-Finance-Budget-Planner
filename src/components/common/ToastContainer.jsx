import { useToast } from "../../context/toastCore.js";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getAriaLive = (toastType) => {
    return toastType === "error" ? "assertive" : "polite";
  };

  return (
    <div
      className="toast-container"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          role="alert"
          aria-live={getAriaLive(toast.type)}
          aria-atomic="true"
        >
          <div className="toast__icon" aria-hidden="true">
            {toast.type === "success" && "✓"}
            {toast.type === "error" && "✗"}
            {toast.type === "warning" && "⚠"}
            {toast.type === "info" && "ℹ"}
          </div>
          <div className="toast__message">{toast.message}</div>
          <button
            type="button"
            className="toast__close"
            onClick={(e) => {
              e.stopPropagation();
              removeToast(toast.id);
            }}
            aria-label={`Dismiss ${toast.type} notification: ${toast.message}`}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      ))}
    </div>
  );
}
