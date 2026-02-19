import { useEffect, useId, useRef } from 'react';

export default function Modal({ open, title, children, onClose }) {
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);
  const modalTitleId = useId();

  useEffect(() => {
    if (!open) return;

    // Store previously focused element to restore focus on close
    previouslyFocusedElement.current = document.activeElement;

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Focus the close button or first focusable element
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }, 100);

    // Handle keyboard events
    const handleKeyDown = (e) => {
      // Close modal on Escape key
      if (e.key === 'Escape') {
        onClose();
      }

      // Focus trap: keep focus within modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      document.body.style.overflow = '';

      // Restore focus to previously focused element
      if (previouslyFocusedElement.current && previouslyFocusedElement.current.focus) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal">
      <div
        className="modal__backdrop"
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className="modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
      >
        <header className="modal__header">
          <h2 className="modal__title" id={modalTitleId}>
            {title}
          </h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label={`Close ${title}`}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
