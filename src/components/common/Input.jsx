export default function Input({
  label,
  id,
  className = "",
  required,
  error,
  disabled,
  placeholder,
  type = "text",
  ariaLabel,
  helpText,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-") || undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const helpTextId = helpText ? `${inputId}-help` : undefined;
  const describedByIds = [errorId, helpTextId].filter(Boolean).join(" ");

  return (
    <div className={`field ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="field__label">
          {label}
          {required && <span className="required" aria-label="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`field__input ${error ? "field__input--error" : ""}`}
        type={type}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel || label}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedByIds || undefined}
        {...props}
      />
      {error && (
        <span id={errorId} className="error-message" role="alert">
          {error}
        </span>
      )}
      {helpText && (
        <span id={helpTextId} className="help-text">
          {helpText}
        </span>
      )}
    </div>
  );
}
