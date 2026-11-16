import { formatCurrency, escapeHtml } from '../utils/format.js';
import { icon } from '../utils/icons.js';

export function carCard(car) {
  const image = car.images?.[0] || '/assets/cars/placeholder.svg';
  return `<article class="car-card">
    <a class="car-card-media" href="/cars/${encodeURIComponent(car.id)}" data-link aria-label="View ${escapeHtml(car.name)}">
      <img src="${escapeHtml(image)}" alt="${escapeHtml(car.name)}" loading="lazy" onerror="this.src='/assets/cars/placeholder.svg'">
    </a>
    <div class="car-card-body">
      <div class="car-card-kicker"><span class="pill">${escapeHtml(car.category)}</span><span class="car-year">${car.year}</span></div>
      <div class="car-card-heading"><div><span class="car-brand">${escapeHtml(car.brand)}</span><h3>${escapeHtml(car.model)}</h3></div><div class="price">${formatCurrency(car.pricePerDay, car.currency)} <small>per day</small></div></div>
      <div class="spec-row"><span>${icon('users')} ${car.seats} seats</span><span>${icon('gear')} ${escapeHtml(car.transmission)}</span><span>${icon('bag')} ${car.luggage} bags</span></div>
      <div class="card-actions"><a class="btn card-primary" href="/cars/${encodeURIComponent(car.id)}" data-link>View vehicle ${icon('arrow')}</a><a class="card-request" href="/booking?car=${encodeURIComponent(car.id)}" data-link>Start request</a></div>
    </div>
  </article>`;
}

export function loadingCards(count = 6) {
  return `<div class="loading-grid" aria-label="Loading vehicles">${Array.from({ length: count }, () => '<div class="skeleton" aria-hidden="true"></div>').join('')}</div>`;
}
