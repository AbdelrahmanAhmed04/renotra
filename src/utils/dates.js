export const MAX_RENTAL_DAYS = 30;

export function todayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(dateString, amount) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount));
  return date.toISOString().slice(0, 10);
}

export function rentalDays(pickupDate, returnDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pickupDate || '') || !/^\d{4}-\d{2}-\d{2}$/.test(returnDate || '')) return 0;
  const [py, pm, pd] = pickupDate.split('-').map(Number);
  const [ry, rm, rd] = returnDate.split('-').map(Number);
  return Math.round((Date.UTC(ry, rm - 1, rd) - Date.UTC(py, pm - 1, pd)) / 86400000);
}

export function validateRentalDates(pickupDate, returnDate) {
  if (!pickupDate || !returnDate) return 'Choose both pickup and return dates.';
  if (pickupDate < todayDateString()) return 'Pickup date cannot be in the past.';
  const days = rentalDays(pickupDate, returnDate);
  if (days < 1) return 'Return date must be after the pickup date.';
  if (days > MAX_RENTAL_DAYS) return `Rental requests are limited to ${MAX_RENTAL_DAYS} days.`;
  return '';
}
