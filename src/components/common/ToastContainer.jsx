import { useToast } from "../../context/toastCore.js";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          <div className="toast__icon">
            {toast.type === "success" && "✓"}
            {toast.type === "error" && "✗"}
            {toast.type === "warning" && "⚠"}
            {toast.type === "info" && "ℹ"}
          </div>
          <div className="toast__message">{toast.message}</div>
          <button
            className="toast__close"
            onClick={(e) => {
              e.stopPropagation();
              removeToast(toast.id);
            }}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
