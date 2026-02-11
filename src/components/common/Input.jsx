export default function Input({ label, id, className = "", ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-") || undefined;

  return (
    <label className={`field ${className}`.trim()}>
      {label ? <span className="field__label">{label}</span> : null}
      <input id={inputId} className="field__input" {...props} />
    </label>
  );
}
