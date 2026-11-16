import { shell } from '../components/layout.js';
import { getPublishedCar } from '../services/cars.js';
import { formatCurrency, escapeHtml } from '../utils/format.js';

export function renderCarDetails(context) {
  return shell('<div class="container section"><div class="skeleton" style="min-height:600px" aria-label="Loading vehicle details"></div></div>', { user: context.user, path: '/cars' });
}

export async function mountCarDetails({ params, router }) {
  const main = document.querySelector('#main-content');
  try {
    const car = await getPublishedCar(params.id);
    if (!car) {
      main.innerHTML = `<div class="container state-panel" style="padding-block:120px"><span class="eyebrow">Vehicle not found</span><h1 style="font-size:3rem">That car isn’t in the public fleet.</h1><p class="lead" style="margin-inline:auto">It may have been unpublished or the link may be incorrect.</p><a class="btn" href="/cars" data-link>Browse available cars</a></div>`;
      router.bindLinks();
      return;
    }
    document.title = `${car.name} | Rentora`;
    const image = car.images?.[0] || '/assets/cars/placeholder.svg';
    main.innerHTML = `<section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/" data-link>Home</a><span>/</span><a href="/cars" data-link>Cars</a><span>/</span><span>${escapeHtml(car.name)}</span></nav></div></section><div class="container details-layout">
      <div><div class="details-gallery"><img src="${escapeHtml(image)}" alt="${escapeHtml(car.name)}" onerror="this.src='/assets/cars/placeholder.svg'"></div><section class="section-sm"><span class="eyebrow">At a glance</span><h2>Built for the way you travel.</h2><p class="lead">${escapeHtml(car.description)}</p><div class="spec-grid">
        <div class="spec-box"><span>Transmission</span><strong>${escapeHtml(car.transmission)}</strong></div><div class="spec-box"><span>Seats</span><strong>${car.seats} people</strong></div><div class="spec-box"><span>Luggage</span><strong>${car.luggage} bags</strong></div><div class="spec-box"><span>Fuel</span><strong>${escapeHtml(car.fuelType)}</strong></div><div class="spec-box"><span>Model year</span><strong>${car.year}</strong></div><div class="spec-box"><span>Category</span><strong>${escapeHtml(car.category)}</strong></div>
      </div></section><section><span class="eyebrow">Included features</span><h2>Comfort in the details.</h2><ul class="features-list">${car.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul></section></div>
      <aside class="details-panel"><span class="pill">${escapeHtml(car.category)}</span><h1>${escapeHtml(car.name)}</h1><p class="muted">${car.year} · ${escapeHtml(car.locationLabel || 'Egypt')}</p><div class="details-price"><div class="price">${formatCurrency(car.pricePerDay, car.currency)} <small>/ day</small></div><p class="small muted" style="margin:5px 0 0">Estimated rate before review</p></div><a class="btn" href="/booking?car=${encodeURIComponent(car.id)}" data-link>Start a booking request</a><a class="btn btn-secondary" href="/cars" data-link>Back to all cars</a><p class="notice" style="margin-top:16px">No payment is taken. Submitting creates a request—not a guaranteed reservation.</p></aside>
    </div>`;
    router.bindLinks();
  } catch {
    main.innerHTML = '<div class="container state-panel" style="padding-block:120px"><h1 style="font-size:3rem">Details unavailable</h1><p class="lead" style="margin-inline:auto">Check your Firebase connection and try again.</p><a class="btn" href="/cars" data-link>Back to cars</a></div>';
    router.bindLinks();
  }
}
