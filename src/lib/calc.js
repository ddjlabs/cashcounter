// src/lib/calc.js
// Denominations in cents for precision
const DENOMINATIONS = [
  { key: 'bill100', label: '$100 Bill', value: 10000 },
  { key: 'bill50',  label: '$50 Bill',  value: 5000 },
  { key: 'bill20',  label: '$20 Bill',  value: 2000 },
  { key: 'bill10',  label: '$10 Bill',  value: 1000 },
  { key: 'bill5',   label: '$5 Bill',   value: 500 },
  { key: 'bill2',   label: '$2 Bill',   value: 200 },
  { key: 'bill1',   label: '$1 Bill',   value: 100 },
  { key: 'coin50',  label: 'Half Dollar (50¢)',  value: 50 },
  { key: 'coin25',  label: 'Quarter (25¢)',  value: 25 },
  { key: 'coin10',  label: 'Dime (10¢)',  value: 10 },
  { key: 'coin5',   label: 'Nickel (5¢)',   value: 5 },
  { key: 'coin1',   label: 'Penny (1¢)',   value: 1 }
];

function isWholeNonNegativeInteger(value) {
  if (value === '' || value === null || value === undefined) return true; // treat empty as 0
  if (typeof value === 'number') return Number.isInteger(value) && value >= 0;
  if (typeof value === 'string') {
    if (!/^\d+$/.test(value.trim())) return false;
    const n = Number(value);
    return Number.isInteger(n) && n >= 0;
  }
  return false;
}

function toCurrency(amountCents) {
  const dollars = (amountCents / 100).toFixed(2);
  return `$${dollars}`;
}

function computeTotals(countsByKey) {
  // countsByKey: { key: string -> quantity: number|string }
  let totalCents = 0;
  const rows = DENOMINATIONS.map(d => {
    const raw = countsByKey[d.key];
    const qty = raw === '' || raw === undefined || raw === null ? 0 : Number(raw);
    const subtotal = qty * d.value;
    totalCents += subtotal;
    return { key: d.key, label: d.label, quantity: qty, subtotalCents: subtotal };
  });
  return { rows, totalCents, totalFormatted: toCurrency(totalCents) };
}

function validateCounts(countsByKey) {
  const errors = [];
  for (const d of DENOMINATIONS) {
    const v = countsByKey[d.key];
    if (!isWholeNonNegativeInteger(v)) {
      errors.push({ key: d.key, message: `${d.label} must be a whole non-negative integer` });
    }
  }
  return errors;
}

const CashCalc = { DENOMINATIONS, isWholeNonNegativeInteger, toCurrency, computeTotals, validateCounts };

// CommonJS export for Node/Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CashCalc;
}

// Browser global for renderer
if (typeof window !== 'undefined') {
  window.CashCalc = CashCalc;
}
