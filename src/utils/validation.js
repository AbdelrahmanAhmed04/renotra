export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^(?:\+?20|0)?1[0125]\d{8}$/;

export function normalizePhone(value) {
  return String(value || '').replace(/[\s()-]/g, '');
}

export function validateEmail(value) {
  return emailPattern.test(String(value || '').trim());
}

export function validatePhone(value) {
  return phonePattern.test(normalizePhone(value));
}

export function passwordMessage(value) {
  if ((value || '').length < 8) return 'Use at least 8 characters.';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Include at least one letter and one number.';
  return '';
}
