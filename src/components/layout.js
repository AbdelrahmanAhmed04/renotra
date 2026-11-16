import { icon } from "../utils/icons.js";

const navItems = [
  ["/", "Home"],
  ["/cars", "Cars"],
  ["/about", "About"],
  ["/contact", "Contact"],
];

function isActive(path, current) {
  return path === "/"
    ? current === "/"
    : current === path || current.startsWith(`${path}/`);
}

export function header(user, currentPath) {
  const links = navItems
    .map(
      ([path, label]) =>
        `<a href="${path}" data-link ${isActive(path, currentPath) ? 'aria-current="page"' : ""}>${label}</a>`,
    )
    .join("");
  return `<header class="site-header">
    <div class="container nav-wrap">
      <a class="brand" href="/" data-link aria-label="Rentora home"><img class="brand-horizontal" src="/assets/brand/logo-horizontal.svg" alt="Rentora"><img class="brand-compact" src="/assets/brand/logo-mark.svg" alt=""></a>
      <nav class="site-nav" id="site-nav" aria-label="Main navigation">${links}${user ? '<a href="/account/bookings" data-link class="mobile-account-link">My bookings</a>' : '<a href="/login" data-link class="mobile-account-link">Log in</a>'}</nav>
      <div class="nav-actions">
        ${user ? `<a class="btn btn-secondary btn-sm" href="/account" data-link>${icon("user")}<span class="account-label">Account</span></a>` : '<a class="btn btn-secondary btn-sm" href="/login" data-link>Log in</a>'}
        <a class="btn btn-sm" href="/cars" data-link>Find a car</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">${icon("menu")}</button>
      </div>
    </div>
  </header>`;
}

export function footer() {
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div><a class="brand" href="/" data-link aria-label="Rentora home"><img class="brand-horizontal" src="/assets/brand/logo-horizontal-light.svg" alt="Rentora"><img class="brand-compact" src="/assets/brand/logo-mark.svg" alt=""></a><p class="small footer-intro">A considered car rental request experience for exploring Egypt at your own pace.</p></div>
      <div><h3>Explore</h3><ul><li><a href="/cars" data-link>Browse cars</a></li><li><a href="/about" data-link>Our story</a></li><li><a href="/contact" data-link>Contact</a></li></ul></div>
      <div><h3>Account</h3><ul><li><a href="/login" data-link>Log in</a></li><li><a href="/register" data-link>Create account</a></li><li><a href="/account/bookings" data-link>My bookings</a></li></ul></div>
      <div><h3>Coursework note</h3><p class="small">Rentora is an educational prototype. Requests are not confirmed reservations, and no payment is collected.</p></div>
    </div>
    <div class="container footer-bottom"><span>© ${new Date().getFullYear()} Rentora. Student project.</span><span>Designed for the road ahead · Built with Firebase</span></div>
  </footer>`;
}

export function shell(
  content,
  { user = null, path = "/", hideFooter = false, hideHeader = false } = {},
) {
  return `${hideHeader ? "" : header(user, path)}<main id="main-content">${content}</main>${hideFooter ? "" : footer()}`;
}

export function bindLayoutEvents() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;
  if (toggle.dataset.menuBound === "true") return;
  toggle.dataset.menuBound = "true";
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  });
}
