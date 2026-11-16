import { shell } from '../components/layout.js';
import { carCard, loadingCards } from '../components/carCard.js';
import { getPublishedCars } from '../services/cars.js';

let catalogue = [];

export function renderCars(context) {
  return shell(`<section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/" data-link>Home</a><span>/</span><span>Cars</span></nav><span class="eyebrow">The Rentora fleet</span><h1>Choose the shape of your journey.</h1><p class="lead">From nimble city cars to seven-seat family SUVs, every vehicle includes a clear daily estimate.</p></div></section>
  <div class="container catalogue-layout">
    <aside class="filters surface" id="filters" aria-label="Vehicle filters"><div class="filters-head"><h2>Filters</h2><button class="filter-reset" id="reset-filters" type="button">Reset all</button></div><div class="filter-stack">
      <div class="field"><label for="car-search">Search by name</label><input id="car-search" type="search" placeholder="e.g. Corolla"></div>
      <div class="field"><label for="category-filter">Category</label><select id="category-filter"><option value="">All categories</option><option value="economy">Economy</option><option value="sedan">Sedan</option><option value="suv">SUV</option><option value="family">Family</option><option value="premium">Premium</option></select></div>
      <div class="field"><label for="price-filter">Maximum daily price</label><select id="price-filter"><option value="">Any price</option><option value="1800">Up to EGP 1,800</option><option value="2500">Up to EGP 2,500</option><option value="3500">Up to EGP 3,500</option><option value="5000">Up to EGP 5,000</option></select></div>
    </div></aside>
    <section class="catalogue-main" aria-labelledby="results-label"><div class="catalogue-toolbar"><div><button class="btn btn-secondary btn-sm mobile-filter-btn" id="mobile-filter" type="button">Filters</button><p class="results-label" id="results-label" aria-live="polite">Loading vehicles…</p></div><div class="field"><label for="sort-cars">Sort by</label><select id="sort-cars"><option value="recommended">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name A–Z</option></select></div></div><div id="catalogue-results">${loadingCards(6)}</div></section>
  </div>`, { user: context.user, path: '/cars' });
}

function applyFilters() {
  const search = document.querySelector('#car-search').value.trim().toLowerCase();
  const category = document.querySelector('#category-filter').value;
  const maxPrice = Number(document.querySelector('#price-filter').value) || Infinity;
  const sort = document.querySelector('#sort-cars').value;
  let results = catalogue.filter((car) => `${car.brand} ${car.model} ${car.name}`.toLowerCase().includes(search) && (!category || car.category === category) && car.pricePerDay <= maxPrice);
  if (sort === 'price-asc') results.sort((a, b) => a.pricePerDay - b.pricePerDay);
  if (sort === 'price-desc') results.sort((a, b) => b.pricePerDay - a.pricePerDay);
  if (sort === 'name') results.sort((a, b) => a.name.localeCompare(b.name));
  document.querySelector('#results-label').textContent = `${results.length} vehicle${results.length === 1 ? '' : 's'} found`;
  document.querySelector('#catalogue-results').innerHTML = results.length ? `<div class="car-grid">${results.map(carCard).join('')}</div>` : '<div class="state-panel surface"><h2>No cars match</h2><p class="muted">Try widening your price, category, or search.</p><button class="btn btn-secondary btn-sm" type="button" id="empty-reset">Reset filters</button></div>';
  document.querySelector('#empty-reset')?.addEventListener('click', resetFilters);
}

function resetFilters() {
  ['car-search', 'category-filter', 'price-filter'].forEach((id) => { document.querySelector(`#${id}`).value = ''; });
  document.querySelector('#sort-cars').value = 'recommended';
  applyFilters();
}

export async function mountCars({ url }) {
  const category = url.searchParams.get('category');
  if (category) document.querySelector('#category-filter').value = category;
  const controls = ['car-search', 'category-filter', 'price-filter', 'sort-cars'];
  controls.forEach((id) => document.querySelector(`#${id}`).addEventListener(id === 'car-search' ? 'input' : 'change', applyFilters));
  document.querySelector('#reset-filters').addEventListener('click', resetFilters);
  document.querySelector('#mobile-filter').addEventListener('click', () => document.querySelector('#filters').classList.toggle('open'));
  try {
    catalogue = await getPublishedCars();
    applyFilters();
  } catch (error) {
    document.querySelector('#results-label').textContent = 'Catalogue unavailable';
    document.querySelector('#catalogue-results').innerHTML = `<div class="state-panel surface"><h2>We couldn’t load the fleet</h2><p class="muted">${error.code === 'permission-denied' ? 'The Firestore query was denied. Check the deployed rules and index.' : 'Start the Firebase emulators or check your project configuration.'}</p><button class="btn btn-sm" id="retry-catalogue">Try again</button></div>`;
    document.querySelector('#retry-catalogue')?.addEventListener('click', () => location.reload());
  }
}
