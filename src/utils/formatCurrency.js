export default function formatCurrency(value, currency = "NPR", locale = "en-US") {
  const amount = Number(value || 0);
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(safe);
}
