import { shell } from '../components/layout.js';
import { getUserProfile, logoutUser } from '../services/auth.js';
import { cancelBooking, getUserBookings } from '../services/bookings.js';
import { escapeHtml, formatCurrency, formatDate, formatTimestamp } from '../utils/format.js';

function accountSidebar(user, profile, active) {
  const initials = (profile?.displayName || user.displayName || user.email || 'R').split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  return `<aside class="account-card surface"><div class="avatar">${escapeHtml(initials)}</div><h2 style="font-size:1.4rem;margin-bottom:4px">${escapeHtml(profile?.displayName || user.displayName || 'Rentora driver')}</h2><p class="small muted">${escapeHtml(user.email || '')}</p><nav class="account-nav" aria-label="Account"><a href="/account" data-link ${active === 'profile' ? 'aria-current="page"' : ''}>Profile</a><a href="/account/bookings" data-link ${active === 'bookings' ? 'aria-current="page"' : ''}>Booking requests</a><button type="button" id="logout-button">Log out</button></nav></aside>`;
}

async function protectAndProfile(context) {
  if (!context.user) { context.router.navigate(`/login?redirect=${encodeURIComponent(context.url.pathname)}`, true); return null; }
  return getUserProfile(context.user.uid).catch(() => null);
}

export function renderAccount(context) {
  return shell('<div class="container section"><div class="skeleton" style="min-height:500px"></div></div>', { user: context.user, path: '/account' });
}

export async function mountAccount(context) {
  const profile = await protectAndProfile(context); if (!context.user) return;
  const main = document.querySelector('#main-content');
  main.innerHTML = `<section class="page-hero"><div class="container"><span class="eyebrow">Your account</span><h1>Good to see you.</h1><p class="lead">Your profile and private booking requests live here.</p></div></section><div class="container account-grid">${accountSidebar(context.user, profile, 'profile')}<section class="account-card surface"><h2 style="font-size:1.8rem">Profile details</h2><p class="muted">These details help prefill a booking request. Authentication passwords are managed by Firebase and never stored in Firestore.</p><div class="confirmation-grid" style="margin-top:30px"><div><span>Full name</span><strong>${escapeHtml(profile?.displayName || context.user.displayName || '—')}</strong></div><div><span>Email</span><strong>${escapeHtml(profile?.email || context.user.email || '—')}</strong></div><div><span>Phone</span><strong>${escapeHtml(profile?.phone || 'Not provided')}</strong></div><div><span>Account ID</span><strong class="small" style="word-break:break-all">${escapeHtml(context.user.uid)}</strong></div></div></section></div>`;
  bindAccount(context.router);
}

export function renderBookings(context) {
  return shell('<div class="container section"><div class="skeleton" style="min-height:500px"></div></div>', { user: context.user, path: '/account/bookings' });
}

export async function mountBookings(context) {
  const profile = await protectAndProfile(context); if (!context.user) return;
  const main = document.querySelector('#main-content');
  main.innerHTML = `<section class="page-hero"><div class="container"><span class="eyebrow">Your account</span><h1>Booking requests.</h1><p class="lead">Every request shown here comes from your private Firestore subcollection.</p></div></section><div class="container account-grid">${accountSidebar(context.user, profile, 'bookings')}<section><div id="account-message" aria-live="polite"></div><div id="bookings-list"><div class="skeleton" style="min-height:360px"></div></div></section></div><dialog class="confirm-dialog" id="cancel-dialog" aria-labelledby="cancel-dialog-title"><div class="confirm-dialog-mark" aria-hidden="true">!</div><h2 id="cancel-dialog-title">Cancel this request?</h2><p>This changes its status permanently. The vehicle, dates, and price snapshot will remain in your history.</p><div class="confirm-dialog-actions"><button class="btn btn-danger" type="button" id="confirm-cancel">Cancel request</button><button class="btn btn-secondary" type="button" id="keep-booking">Keep request</button></div></dialog>`;
  bindAccount(context.router);
  const target = document.querySelector('#bookings-list');
  try {
    const bookings = await getUserBookings(context.user.uid);
    target.innerHTML = bookings.length ? `<div class="booking-list">${bookings.map(bookingItem).join('')}</div>` : '<div class="state-panel surface"><h2>No booking requests yet</h2><p class="muted">When you send your first request, it will appear here.</p><a class="btn" href="/cars" data-link>Find a car</a></div>';
    context.router.bindLinks();
    const dialog = document.querySelector('#cancel-dialog');
    const confirmButton = document.querySelector('#confirm-cancel');
    let pendingButton = null;
    document.querySelectorAll('[data-cancel-booking]').forEach((button) => button.addEventListener('click', () => {
      pendingButton = button;
      dialog.showModal();
    }));
    document.querySelector('#keep-booking').addEventListener('click', () => { pendingButton = null; dialog.close(); });
    dialog.addEventListener('cancel', () => { pendingButton = null; });
    confirmButton.addEventListener('click', async () => {
      if (!pendingButton) return;
      const bookingId = pendingButton.dataset.cancelBooking;
      confirmButton.disabled = true; confirmButton.textContent = 'Cancelling…';
      try {
        await cancelBooking(context.user.uid, bookingId);
        dialog.close();
        await mountBookings(context);
        document.querySelector('#account-message').innerHTML = '<p class="notice notice-success account-feedback">The booking request was cancelled and remains in your history.</p>';
      } catch {
        dialog.close();
        document.querySelector('#account-message').innerHTML = '<p class="notice notice-error account-feedback">The request could not be cancelled. Refresh and try again.</p>';
        pendingButton.disabled = false; pendingButton.textContent = 'Cancel request';
      } finally {
        confirmButton.disabled = false; confirmButton.textContent = 'Cancel request'; pendingButton = null;
      }
    });
  } catch {
    target.innerHTML = '<div class="state-panel surface"><h2>Couldn’t load your requests</h2><p class="muted">Check your connection and Firestore rules, then try again.</p><button class="btn btn-sm" onclick="location.reload()">Try again</button></div>';
  }
}

function bookingItem(booking) {
  return `<article class="booking-item surface"><div class="booking-top"><div><h3>${escapeHtml(booking.carNameSnapshot)}</h3><p class="small muted">Reference: ${escapeHtml(booking.id)} · Created ${formatTimestamp(booking.createdAt)}</p></div><span class="pill status-${escapeHtml(booking.status)}">${escapeHtml(booking.status)}</span></div><div class="booking-meta"><div><span>Pickup</span><strong>${formatDate(booking.pickupDate)}</strong></div><div><span>Return</span><strong>${formatDate(booking.returnDate)}</strong></div><div><span>Duration</span><strong>${booking.rentalDays} days</strong></div><div><span>Estimate</span><strong>${formatCurrency(booking.estimatedTotal, booking.currency)}</strong></div></div>${booking.status === 'requested' ? `<button class="btn btn-danger btn-sm" type="button" data-cancel-booking="${escapeHtml(booking.id)}">Cancel request</button>` : '<p class="small muted" style="margin:0">This request has been cancelled.</p>'}</article>`;
}

function bindAccount(router) {
  router.bindLinks();
  document.querySelector('#logout-button')?.addEventListener('click', async () => { await logoutUser(); router.navigate('/', true); });
}
