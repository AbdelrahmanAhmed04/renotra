import { shell } from '../components/layout.js';
import { getPublishedCar } from '../services/cars.js';
import { getUserProfile } from '../services/auth.js';
import { createBooking, getBooking } from '../services/bookings.js';
import { addDays, rentalDays, todayDateString, validateRentalDates } from '../utils/dates.js';
import { formatCurrency, formatDate, escapeHtml } from '../utils/format.js';
import { validateEmail, validatePhone } from '../utils/validation.js';

const DRAFT_KEY = 'rentoraBookingDraft';
const locations = ['Cairo International Airport', 'New Cairo', 'Downtown Cairo', 'Giza', 'Sheikh Zayed City', 'Alexandria City Centre'];

function summary(car, draft = {}) {
  const days = rentalDays(draft.pickupDate, draft.returnDate);
  const total = days * Number(car.pricePerDay || 0);
  return `<aside class="summary-card surface"><div class="summary-image"><img src="${escapeHtml(car.images?.[0] || '/assets/cars/placeholder.svg')}" alt="${escapeHtml(car.name)}" onerror="this.src='/assets/cars/placeholder.svg'"></div><div class="summary-body"><span class="pill">${escapeHtml(car.category)}</span><h2 style="margin-top:12px">${escapeHtml(car.name)}</h2><div class="summary-line"><span>Daily rate</span><strong>${formatCurrency(car.pricePerDay, car.currency)}</strong></div><div class="summary-line"><span>Rental days</span><strong id="summary-days">${days || '—'}</strong></div><div class="summary-line summary-total"><span>Estimated total</span><strong id="summary-total">${days ? formatCurrency(total, car.currency) : '—'}</strong></div><p class="small muted">Estimate only. Availability and final rental terms require manual review.</p></div></aside>`;
}

export function renderBooking(context) {
  return shell('<div class="container section"><div class="skeleton" style="min-height:600px" aria-label="Loading booking form"></div></div>', { user: context.user, path: '/booking' });
}

export async function mountBooking({ url, user, router }) {
  const main = document.querySelector('#main-content');
  const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || '{}');
  const searchDates = JSON.parse(sessionStorage.getItem('rentoraSearchDates') || '{}');
  const carId = url.searchParams.get('car') || saved.carId;
  const car = await getPublishedCar(carId).catch(() => null);
  if (!car) {
    main.innerHTML = '<div class="container state-panel" style="padding-block:120px"><h1 style="font-size:3rem">Choose a car first</h1><p class="lead" style="margin-inline:auto">A published vehicle is needed before a booking request can begin.</p><a class="btn" href="/cars" data-link>Browse cars</a></div>';
    router.bindLinks(); return;
  }
  const profile = user ? await getUserProfile(user.uid).catch(() => null) : null;
  const draft = saved.carId === car.id ? saved : {};
  const pickup = url.searchParams.get('pickup') || draft.pickupDate || searchDates.pickupDate || addDays(todayDateString(), 1);
  const returnDate = url.searchParams.get('return') || draft.returnDate || searchDates.returnDate || addDays(pickup, 3);
  const min = todayDateString();
  main.innerHTML = `<section class="page-hero"><div class="container"><nav class="breadcrumbs"><a href="/cars" data-link>Cars</a><span>/</span><span>Booking request</span></nav><span class="eyebrow">Step 1 of 2</span><h1>Plan your request.</h1><p class="lead">Tell us when and where. You’ll review everything before it is saved.</p></div></section><div class="container booking-layout"><section class="form-card surface"><h2 style="font-size:1.8rem">Driver & journey</h2><div id="booking-message"></div><form id="booking-form" class="form-grid" novalidate>
    <input type="hidden" name="carId" value="${escapeHtml(car.id)}">
    <div class="field"><label for="customerName">Full name</label><input id="customerName" name="customerName" maxlength="80" autocomplete="name" value="${escapeHtml(draft.customerName || profile?.displayName || user?.displayName || '')}" required><span class="field-error" id="customerName-error"></span></div>
    <div class="field"><label for="customerEmail">Contact email</label><input id="customerEmail" name="customerEmail" type="email" maxlength="254" autocomplete="email" value="${escapeHtml(draft.customerEmail || profile?.email || user?.email || '')}" required><span class="field-error" id="customerEmail-error"></span></div>
    <div class="field"><label for="customerPhone">Egyptian mobile number</label><input id="customerPhone" name="customerPhone" type="tel" maxlength="24" autocomplete="tel" value="${escapeHtml(draft.customerPhone || profile?.phone || '')}" required><span class="field-error" id="customerPhone-error"></span></div>
    <div class="field"><label for="pickupLocation">Preferred pickup</label><select id="pickupLocation" name="pickupLocation">${locations.map((item) => `<option ${draft.pickupLocation === item ? 'selected' : ''}>${item}</option>`).join('')}</select><span class="field-error"></span></div>
    <div class="field"><label for="pickupDate">Pickup date</label><input id="pickupDate" name="pickupDate" type="date" min="${min}" value="${pickup}" required><span class="field-error" id="pickupDate-error"></span></div>
    <div class="field"><label for="returnDate">Return date</label><input id="returnDate" name="returnDate" type="date" min="${addDays(min, 1)}" value="${returnDate}" required><span class="field-error" id="returnDate-error"></span></div>
    <div class="span-2 notice">Rentals are limited to 1–30 calendar days. This prototype calculates an estimate and saves a request; it does not check live availability or collect payment.</div>
    <div class="span-2 form-actions"><button class="btn" type="submit">Review request</button><a class="btn btn-secondary" href="/cars/${encodeURIComponent(car.id)}" data-link>Back to car</a></div>
  </form></section>${summary(car, { ...draft, pickupDate: pickup, returnDate })}</div>`;
  router.bindLinks();
  const form = document.querySelector('#booking-form');
  const update = () => {
    const days = rentalDays(form.pickupDate.value, form.returnDate.value);
    form.returnDate.min = addDays(form.pickupDate.value || min, 1);
    document.querySelector('#summary-days').textContent = days > 0 ? days : '—';
    document.querySelector('#summary-total').textContent = days > 0 ? formatCurrency(days * car.pricePerDay, car.currency) : '—';
  };
  form.pickupDate.addEventListener('change', update); form.returnDate.addEventListener('change', update);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    const dateError = validateRentalDates(values.pickupDate, values.returnDate);
    const errors = {
      customerName: values.customerName.trim().length >= 2 ? '' : 'Enter your full name.',
      customerEmail: validateEmail(values.customerEmail) ? '' : 'Enter a valid email address.',
      customerPhone: validatePhone(values.customerPhone) ? '' : 'Enter a valid Egyptian mobile number.',
      pickupDate: dateError,
      returnDate: dateError
    };
    Object.entries(errors).forEach(([key, value]) => { document.querySelector(`#${key}-error`).textContent = value; });
    if (Object.values(errors).some(Boolean)) return;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    router.navigate('/checkout');
  });
}

export function renderCheckout(context) {
  return shell('<div class="container section"><div class="skeleton" style="min-height:500px" aria-label="Loading review"></div></div>', { user: context.user, path: '/checkout' });
}

export async function mountCheckout({ user, router }) {
  const main = document.querySelector('#main-content');
  const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null');
  if (!draft) { router.navigate('/cars', true); return; }
  const car = await getPublishedCar(draft.carId).catch(() => null);
  if (!car) { router.navigate('/cars', true); return; }
  main.innerHTML = `<section class="page-hero"><div class="container"><nav class="breadcrumbs"><a href="/booking?car=${encodeURIComponent(car.id)}" data-link>Booking</a><span>/</span><span>Review</span></nav><span class="eyebrow">Step 2 of 2</span><h1>Review before you send.</h1><p class="lead">No payment is collected. Confirming below saves this booking request to your private account.</p></div></section><div class="container booking-layout"><section class="form-card surface"><h2 style="font-size:1.8rem">Request details</h2><div id="checkout-message" aria-live="polite"></div><div class="confirmation-grid" style="margin:28px 0"><div><span>Customer</span><strong>${escapeHtml(draft.customerName)}</strong></div><div><span>Contact</span><strong>${escapeHtml(draft.customerEmail)}</strong><br><small>${escapeHtml(draft.customerPhone)}</small></div><div><span>Pickup</span><strong>${formatDate(draft.pickupDate)}</strong><br><small>${escapeHtml(draft.pickupLocation)}</small></div><div><span>Return</span><strong>${formatDate(draft.returnDate)}</strong></div></div><p class="notice">By sending, you acknowledge this is an educational booking request—not a confirmed vehicle reservation.</p><div class="form-actions" style="margin-top:25px"><button class="btn" type="button" id="confirm-booking">${user ? 'Send booking request' : 'Log in to send request'}</button><a class="btn btn-secondary" href="/booking?car=${encodeURIComponent(car.id)}" data-link>Edit details</a></div></section>${summary(car, draft)}</div>`;
  router.bindLinks();
  document.querySelector('#confirm-booking').addEventListener('click', async (event) => {
    if (!user) { router.navigate('/login?redirect=%2Fcheckout'); return; }
    const button = event.currentTarget; button.disabled = true; button.textContent = 'Saving request…';
    try {
      const booking = await createBooking(user, draft);
      sessionStorage.removeItem(DRAFT_KEY);
      sessionStorage.setItem('rentoraLastBooking', booking.id);
      router.navigate(`/confirmation?id=${encodeURIComponent(booking.id)}`, true);
    } catch (error) {
      document.querySelector('#checkout-message').innerHTML = `<p class="notice notice-error">${escapeHtml(error.message === 'AUTH_REQUIRED' ? 'Please log in before sending.' : error.message || 'The request could not be saved.')}</p>`;
      button.disabled = false; button.textContent = 'Send booking request';
    }
  });
}

export function renderConfirmation(context) {
  return shell('<div class="container section"><div class="skeleton" style="min-height:420px"></div></div>', { user: context.user, path: '/confirmation' });
}

export async function mountConfirmation({ user, url, router }) {
  if (!user) { router.navigate('/login?redirect=%2Faccount%2Fbookings', true); return; }
  const id = url.searchParams.get('id');
  const booking = id ? await getBooking(user.uid, id).catch(() => null) : null;
  const main = document.querySelector('#main-content');
  if (!booking) {
    main.innerHTML = '<div class="container state-panel" style="padding-block:120px"><h1 style="font-size:3rem">Request not found</h1><p class="lead" style="margin-inline:auto">Only a saved request in your account can appear here.</p><a class="btn" href="/account/bookings" data-link>View my bookings</a></div>'; router.bindLinks(); return;
  }
  main.innerHTML = `<section class="confirmation"><div class="container"><div class="confirmation-mark">✓</div><span class="eyebrow">Request received</span><h1>Your request is safely saved.</h1><p class="lead" style="margin-inline:auto">This is not a confirmed vehicle reservation. In a real service, a team member would review availability and contact you.</p><div class="confirmation-card surface"><div class="confirmation-grid"><div><span>Reference</span><strong>${escapeHtml(booking.id)}</strong></div><div><span>Vehicle</span><strong>${escapeHtml(booking.carNameSnapshot)}</strong></div><div><span>Dates</span><strong>${formatDate(booking.pickupDate)} – ${formatDate(booking.returnDate)}</strong></div><div><span>Estimated total</span><strong>${formatCurrency(booking.estimatedTotal, booking.currency)}</strong></div></div></div><a class="btn" href="/account/bookings" data-link>View my booking requests</a> <a class="btn btn-secondary" href="/cars" data-link>Browse more cars</a></div></section>`;
  router.bindLinks();
}
