export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__content" role="dialog" aria-modal="true">
        <header className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            x
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
