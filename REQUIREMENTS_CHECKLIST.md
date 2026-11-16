# Requirements checklist

## Experience and pages

- [x] Home: navigation, hero, date/category entry, Firestore featured fleet, benefits, process, about preview, CTA, footer.
- [x] Cars: published-only Firestore query; live name/category/price filters; sorting; count; reset; mobile drawer; loading/empty/error states.
- [x] Details: real document fetch; image, description, specs, features, rate, CTA; missing/unpublished state.
- [x] Booking: selected car, contact fields, Egyptian pickup options, protected final submission, login-preserved draft, date validation, 1–30 days, live estimate.
- [x] Checkout: review only, with no payment or card fields.
- [x] Confirmation: reads the actual saved booking by ID and clearly says it is not confirmed.
- [x] Register/login: Firebase Email/Password, profile creation, persistence, friendly validation/errors, reset workflow, redirects.
- [x] Account/history: protected routes, real profile/bookings, status, dates, estimates, empty/error states, secure pending cancellation.
- [x] About/contact: meaningful fictional copy and an explicit example `mailto:`; no invented office or support operation.
- [x] 404, browser history, SPA refresh rewrite, active nav, mobile menu, semantic links.
- [x] Keyboard focus, labels, live regions, reduced motion, local fallback imagery, responsive layouts.

## Backend and security

- [x] Modular Firebase initialized once; Auth/Firestore emulator connections gated by `DEV && VITE_USE_EMULATORS`.
- [x] Required collections and price snapshots.
- [x] UTC calendar arithmetic and ISO date strings.
- [x] Submission re-fetches published car and recalculates the estimate.
- [x] Rules v2, deny-by-default, published-only public catalogue, owner profiles/bookings, exact field checks, bounds, car/rate checks, one-way cancellation, no deletes.
- [x] Repeatable 14-car deterministic Admin SDK seed with explicit production guard and no booking deletion.
- [x] Rules tests cover public/hidden reads, anonymous denial, own/cross-user access, unauthorized car writes, price/status tampering, immutable fields, and cancellation.
- [x] Emulator integration test exercises actual registration, login, profile persistence, booking creation/readback, history query, and cancellation.

## Added beyond a typical Phase 1 front-end

- Firebase Authentication sessions and password reset.
- Persistent Firestore inventory, profiles, and booking history.
- Security Rules plus emulator tests.
- Real saved-record confirmation and cancellation transition.
- Admin SDK seed modes and Hosting SPA deployment configuration.
- Loading, error, empty, invalid-ID, and authentication continuation states.

## Manual acceptance steps

1. Run emulators and seed; confirm exactly 14 public cars.
2. Resize from 320px to desktop; use keyboard-only navigation and menu.
3. Refresh `/cars/{id}`, `/checkout`, and `/account/bookings` directly.
4. Create/login/logout/reset; verify Auth emulator records.
5. Try past, same-day, 31-day, and valid dates; compare rate × days.
6. Send a request; match confirmation ID to Firestore; refresh account.
7. Cancel once; confirm other fields stay unchanged and second transition is denied.
8. Sign in as a second user and verify the first user's profile/bookings are denied.
9. Build and preview production files; ensure no localhost Firebase connection appears.

Cloud deployment and production email delivery require the student's own Firebase project and credentials, so they cannot be automatically verified in a credential-free repository.
