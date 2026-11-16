import './styles/base.css';
import './styles/pages.css';
import { auth, firebaseConfigured, usingEmulators } from './services/firebase.js';
import { observeAuth } from './services/auth.js';
import { bindLayoutEvents } from './components/layout.js';
import { renderHome, mountHome } from './pages/home.js';
import { renderCars, mountCars } from './pages/cars.js';
import { renderCarDetails, mountCarDetails } from './pages/carDetails.js';
import { renderLogin, mountLogin, renderRegister, mountRegister } from './pages/auth.js';
import { renderBooking, mountBooking, renderCheckout, mountCheckout, renderConfirmation, mountConfirmation } from './pages/booking.js';
import { renderAccount, mountAccount, renderBookings, mountBookings } from './pages/account.js';
import { renderAbout, renderContact, renderNotFound } from './pages/static.js';

const routes = [
  { pattern: /^\/$/, title: 'Rentora — Drive your way', render: renderHome, mount: mountHome },
  { pattern: /^\/cars\/?$/, title: 'Browse Cars | Rentora', render: renderCars, mount: mountCars },
  { pattern: /^\/cars\/([^/]+)\/?$/, title: 'Car Details | Rentora', render: renderCarDetails, mount: mountCarDetails, keys: ['id'] },
  { pattern: /^\/booking\/?$/, title: 'Booking Request | Rentora', render: renderBooking, mount: mountBooking },
  { pattern: /^\/checkout\/?$/, title: 'Review Request | Rentora', render: renderCheckout, mount: mountCheckout },
  { pattern: /^\/confirmation\/?$/, title: 'Request Received | Rentora', render: renderConfirmation, mount: mountConfirmation },
  { pattern: /^\/login\/?$/, title: 'Log In | Rentora', render: renderLogin, mount: mountLogin },
  { pattern: /^\/register\/?$/, title: 'Create Account | Rentora', render: renderRegister, mount: mountRegister },
  { pattern: /^\/account\/?$/, title: 'Your Account | Rentora', render: renderAccount, mount: mountAccount },
  { pattern: /^\/account\/bookings\/?$/, title: 'Your Booking Requests | Rentora', render: renderBookings, mount: mountBookings },
  { pattern: /^\/about\/?$/, title: 'About | Rentora', render: renderAbout },
  { pattern: /^\/contact\/?$/, title: 'Contact | Rentora', render: renderContact }
];

class Router {
  constructor(root) { this.root = root; this.navigationId = 0; }

  navigate(href, replace = false) {
    const url = new URL(href, location.origin);
    if (url.origin !== location.origin) { location.href = href; return; }
    history[replace ? 'replaceState' : 'pushState']({}, '', `${url.pathname}${url.search}${url.hash}`);
    this.render();
  }

  bindLinks() {
    document.querySelectorAll('a[data-link]').forEach((link) => {
      if (link.dataset.routerBound) return;
      link.dataset.routerBound = 'true';
      link.addEventListener('click', (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault(); this.navigate(link.href);
      });
    });
  }

  async render() {
    const navigationId = ++this.navigationId;
    document.body.classList.remove('menu-open');
    const url = new URL(location.href);
    const route = routes.find((item) => item.pattern.test(url.pathname));
    const user = auth?.currentUser || null;
    const context = { user, url, router: this, params: {} };
    if (!route) {
      document.title = 'Page Not Found | Rentora';
      this.root.innerHTML = renderNotFound(context);
      this.bindLinks(); bindLayoutEvents(); window.scrollTo(0, 0); return;
    }
    const match = url.pathname.match(route.pattern);
    route.keys?.forEach((key, index) => { context.params[key] = decodeURIComponent(match[index + 1]); });
    document.title = route.title;
    this.root.innerHTML = route.render(context);
    this.bindLinks(); bindLayoutEvents(); window.scrollTo(0, 0);
    if (route.mount) {
      try { await route.mount(context); }
      catch (error) {
        if (navigationId !== this.navigationId) return;
        console.error(error);
        this.root.querySelector('#main-content')?.insertAdjacentHTML('afterbegin', '<div class="container"><p class="notice notice-error" style="margin-top:20px">Something unexpected happened while loading this page. Please refresh and try again.</p></div>');
      }
      if (navigationId === this.navigationId) { this.bindLinks(); bindLayoutEvents(); }
    }
  }
}

const router = new Router(document.querySelector('#app'));
window.addEventListener('popstate', () => router.render());

function waitForInitialAuth() {
  if (!firebaseConfigured) return Promise.resolve();
  return new Promise((resolve) => {
    const unsubscribe = observeAuth(() => { unsubscribe(); resolve(); });
  });
}

waitForInitialAuth().then(() => router.render());

if (usingEmulators) console.info('Rentora is connected to the local Firebase Auth and Firestore emulators.');
