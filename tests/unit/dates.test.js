import { describe, expect, it } from 'vitest';
import { addDays, rentalDays, validateRentalDates } from '../../src/utils/dates.js';

describe('rental calendar calculations', () => {
  it('counts UTC calendar days across month and DST boundaries', () => {
    expect(rentalDays('2026-03-27', '2026-03-30')).toBe(3);
    expect(rentalDays('2026-01-31', '2026-02-02')).toBe(2);
  });

  it('rejects reversed and overlong rentals', () => {
    expect(validateRentalDates('2099-06-10', '2099-06-10')).toMatch(/after/);
    expect(validateRentalDates('2099-06-10', '2099-07-11')).toMatch(/30/);
  });

  it('adds calendar days without local timezone drift', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });
});
