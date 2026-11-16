import { shell } from '../components/layout.js';
import { carCard, loadingCards } from '../components/carCard.js';
import { getFeaturedCars } from '../services/cars.js';
import { icon } from '../utils/icons.js';
import { todayDateString, addDays } from '../utils/dates.js';

export function renderHome(context) {
  const today = todayDateString();
  return shell(`<section class="home-hero">
      <img class="hero-photo" src="/assets/cars/toyota-corolla.jpg" alt="A modern car ready for an Egyptian road journey" onerror="this.src='/assets/cars/placeholder.svg'">
      <div class="container hero-inner"><div class="hero-copy"><span class="eyebrow">Car rental requests, made simple</span><h1>More road.<br>Less routine.</h1><p>Choose a car that fits the way you move—then send a clear, no-payment booking request in minutes.</p><div class="hero-actions"><a class="btn" href="/cars" data-link>Explore the fleet ${icon('arrow')}</a><a class="btn btn-secondary" href="/about" data-link>Meet Rentora</a></div><p class="hero-note">Educational demo · Prices in EGP · Requests require review</p></div></div>
    </section>
    <div class="container quick-search"><form id="quick-search-form">
      <div class="field"><label for="quick-category">What do you need?</label><select id="quick-category" name="category"><option value="">Any vehicle</option><option value="economy">Economy</option><option value="sedan">Sedan</option><option value="suv">SUV</option><option value="family">Family</option><option value="premium">Premium</option></select></div>
      <div class="field"><label for="quick-pickup">Pickup</label><input id="quick-pickup" name="pickup" type="date" min="${today}" value="${addDays(today, 1)}" required></div>
      <div class="field"><label for="quick-return">Return</label><input id="quick-return" name="return" type="date" min="${addDays(today, 1)}" value="${addDays(today, 4)}" required></div>
      <button class="btn" type="submit">Search cars ${icon('arrow')}</button>
    </form></div>
    <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Selected for the road</span><h2>Popular ways to get moving</h2></div><a class="text-link" href="/cars" data-link>See all cars ${icon('arrow')}</a></div><div id="featured-cars">${loadingCards(3)}</div></div></section>
    <section class="section benefits"><div class="container benefits-grid"><div class="benefits-intro"><span class="eyebrow">Why Rentora</span><h2>Clear at every turn.</h2><p class="muted">A booking-request experience built around transparent estimates and useful choices.</p></div>
      <article class="benefit"><span class="benefit-icon">${icon('shield')}</span><h3>Private by design</h3><p>Your requests sit inside your own authenticated account.</p></article>
      <article class="benefit"><span class="benefit-icon">${icon('calendar')}</span><h3>Upfront estimates</h3><p>See the daily rate, rental days, and estimated total before sending.</p></article>
      <article class="benefit"><span class="benefit-icon">${icon('map')}</span><h3>Local choices</h3><p>Practical pickup areas across Cairo, Giza, and Alexandria.</p></article>
    </div></section>
    <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">How it works</span><h2>From shortlist to request in three steps.</h2></div></div><div class="steps"><article class="step"><h3>Find your fit</h3><p class="muted">Search and filter a varied fleet by category, price, and specifications.</p></article><article class="step"><h3>Choose your dates</h3><p class="muted">Pick 1–30 calendar days and see the estimate update immediately.</p></article><article class="step"><h3>Review and send</h3><p class="muted">Sign in, check every detail, and save a real request to your account.</p></article></div></div></section>
    <section class="section"><div class="container split"><div class="split-media"><img src="/assets/cars/kia-sportage.jpg" alt="SUV on the road" loading="lazy" onerror="this.src='/assets/cars/placeholder.svg'"></div><div><span class="eyebrow">A student-built Egyptian prototype</span><h2>Designed for real journeys, honest about the demo.</h2><p class="lead">Rentora imagines a calmer way to plan car hire: meaningful information, clean choices, and no fake countdowns or surprise checkout forms.</p><p class="muted">This course project uses Firebase Authentication and Firestore to demonstrate secure, persistent user journeys. It does not process payments or guarantee vehicle availability.</p><a class="text-link" href="/about" data-link>Read our approach ${icon('arrow')}</a></div></div></section>
    <section class="section-sm"><div class="container cta-band"><h2>Your next route starts with the right car.</h2><a class="btn btn-light" href="/cars" data-link>Browse the fleet ${icon('arrow')}</a></div></section>`, { user: context.user, path: '/' });
}

export async function mountHome({ router }) {
  document.querySelector('#quick-search-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams(Object.fromEntries(data));
    sessionStorage.setItem('rentoraSearchDates', JSON.stringify({ pickupDate: data.get('pickup'), returnDate: data.get('return') }));
    router.navigate(`/cars?${params}`);
  });
  const target = document.querySelector('#featured-cars');
  try {
    const cars = await getFeaturedCars(3);
    target.innerHTML = cars.length ? `<div class="car-grid">${cars.map(carCard).join('')}</div>` : '<div class="state-panel surface"><h2>Fleet arriving soon</h2><p class="muted">Seed the emulator inventory to see featured vehicles.</p></div>';
  } catch {
    target.innerHTML = '<div class="state-panel surface"><h2>Unable to load the fleet</h2><p class="muted">Check the Firebase connection or start the local emulators.</p><button class="btn btn-sm" type="button" id="retry-featured">Try again</button></div>';
    document.querySelector('#retry-featured')?.addEventListener('click', () => mountHome({ router }));
  }
}
