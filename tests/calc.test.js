const { DENOMINATIONS, isWholeNonNegativeInteger, toCurrency, computeTotals, validateCounts } = require('../src/lib/calc');

describe('calc library', () => {
  test('isWholeNonNegativeInteger validates correctly', () => {
    expect(isWholeNonNegativeInteger('')).toBe(true);
    expect(isWholeNonNegativeInteger('0')).toBe(true);
    expect(isWholeNonNegativeInteger('10')).toBe(true);
    expect(isWholeNonNegativeInteger(5)).toBe(true);

    expect(isWholeNonNegativeInteger('-1')).toBe(false);
    expect(isWholeNonNegativeInteger('1.2')).toBe(false);
    expect(isWholeNonNegativeInteger('abc')).toBe(false);
    expect(isWholeNonNegativeInteger(-3)).toBe(false);
  });

  test('toCurrency formats cents to USD', () => {
    expect(toCurrency(0)).toBe('$0.00');
    expect(toCurrency(1)).toBe('$0.01');
    expect(toCurrency(75)).toBe('$0.75');
    expect(toCurrency(12345)).toBe('$123.45');
  });

  test('computeTotals sums correctly for all zeros', () => {
    const counts = Object.fromEntries(DENOMINATIONS.map(d => [d.key, 0]));
    const { totalCents, totalFormatted, rows } = computeTotals(counts);
    expect(totalCents).toBe(0);
    expect(totalFormatted).toBe('$0.00');
    expect(rows).toHaveLength(DENOMINATIONS.length);
    rows.forEach(r => expect(r.subtotalCents).toBe(0));
  });

  test('validateCounts flags invalid inputs', () => {
    const counts = { bill100: '2', bill50: 'x', bill20: '-1' };
    const errors = validateCounts(counts);
    const keys = errors.map(e => e.key);
    expect(keys).toContain('bill50');
    expect(keys).toContain('bill20');
    expect(keys).not.toContain('bill100');
  });

  test('computeTotals matches PRD example totals', () => {
    // From docs/prd.md example table
    const counts = {
      bill100: 5,
      bill50: 2,
      bill20: 7,
      bill10: 3,
      bill5: 4,
      bill2: 0,
      bill1: 12,
      coin50: 6,
      coin25: 8,
      coin10: 10,
      coin5: 15,
      coin1: 23,
    };
    const { totalCents, totalFormatted } = computeTotals(counts);
    expect(totalCents).toBe(80898);
    expect(totalFormatted).toBe('$808.98');
  });
});
