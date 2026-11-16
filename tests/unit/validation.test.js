import { describe, expect, it } from 'vitest';
import { normalizePhone, passwordMessage, validateEmail, validatePhone } from '../../src/utils/validation.js';

describe('form validation', () => {
  it('accepts practical emails and rejects incomplete ones', () => {
    expect(validateEmail('student@example.edu')).toBe(true);
    expect(validateEmail('student@')).toBe(false);
  });

  it('normalizes and validates Egyptian mobile numbers', () => {
    expect(normalizePhone('+20 10 1234 5678')).toBe('+201012345678');
    expect(validatePhone('+20 10 1234 5678')).toBe(true);
    expect(validatePhone('555')).toBe(false);
  });

  it('requires a useful password shape', () => {
    expect(passwordMessage('short')).toBeTruthy();
    expect(passwordMessage('abcdefgh')).toMatch(/number/);
    expect(passwordMessage('secure123')).toBe('');
  });
});
