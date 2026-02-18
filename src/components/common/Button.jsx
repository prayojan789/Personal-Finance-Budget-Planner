export default function Button({
  children,
  className = "",
  disabled = false,
  loading = false,
  ariaLabel,
  type = "button",
  onClick,
  ...props
}) {
  const isDisabled = disabled || loading;

  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      type={type}
      className={`btn ${className}`.trim()}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {loading && <span aria-hidden="true" className="btn__loader">⟳</span>}
      <span className="btn__text">{children}</span>
    </button>
  );
}
