# Rentora

Rentora is a responsive car-rental booking-request website for a university Networks and Web Development course. It uses semantic HTML, modern CSS, vanilla JavaScript modules, Vite, Firebase Authentication, and Cloud Firestore. The flow is intentionally request-based: it stores real demo booking records but does not take payment or promise vehicle availability.

## Quick start (Windows PowerShell)

Prerequisites: Node.js 22+, Java 21 LTS (for Firebase emulators), and the Firebase CLI included in this project's dev dependencies.

```powershell
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run emulators
```

In a second terminal:

```powershell
npm.cmd run seed:emulator
npm.cmd run dev
```

Open the Vite address (normally `http://localhost:5173`). The default development configuration connects to Auth at `127.0.0.1:9099` and Firestore at `127.0.0.1:8080`. Emulator UI is at `http://127.0.0.1:4000`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Create production files in `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Check JavaScript with ESLint |
| `npm test` | Run fast unit tests |
| `npm run test:rules` | Start a temporary Firestore emulator and run security tests |
| `npm run test:integration` | Run a real Auth + Firestore register/booking/cancel flow locally |
| `npm run emulators` | Start Auth, Firestore, and Emulator UI |
| `npm run seed:emulator` | Idempotently upsert the 14 demo cars locally |
| `npm run seed:production` | Explicit production seed; requires external service credentials |

Run unit tests alone with `npx vitest run tests/unit`. For all supported verification:

```powershell
npm.cmd run lint
npm.cmd run build
npx.cmd vitest run tests/unit
npm.cmd run test:rules
npm.cmd run test:integration
```

## Repository map

- `src/pages/`: route-level views and interactions
- `src/components/`: site shell and shared car cards
- `src/services/`: modular Firebase initialization and repositories
- `src/utils/`: date, validation, formatting, and icon helpers
- `src/data/cars.js`: deterministic demo inventory used by the seed script
- `src/styles/`: design system and responsive page styling
- `scripts/seedCars.mjs`: Admin SDK inventory seeder (never bundled)
- `tests/`: unit and Firestore Rules tests
- `firestore.rules`: deny-by-default access policy
- `firebase.json`: emulator, Firestore, Hosting, and SPA rewrite configuration

## Important security notes

Firebase web config values are identifiers and are expected to be visible in browser code. Firestore Rules and Authentication provide access control. Service-account JSON is secret: keep it outside this repository and never place it in `src/`, `public/`, Git, or a deployed build.

This student architecture deliberately does not solve production availability, price authorization, fraud, vehicle handover, payment, or double-booking. A client-side re-fetch plus Firestore Rules prevents simple snapshot tampering but is not a production pricing authority.

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md), [PROJECT_EXPLANATION.md](PROJECT_EXPLANATION.md), and [REQUIREMENTS_CHECKLIST.md](REQUIREMENTS_CHECKLIST.md).
