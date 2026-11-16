# Firebase setup guide

This guide assumes Windows PowerShell and Node.js 22. Commands use `npm.cmd` because some Windows execution policies block `npm.ps1`.

## 1. Create and register the Firebase app

1. Open the Firebase Console and choose **Add project**.
2. Give the project a unique ID. Google Analytics is optional for this coursework.
3. On **Project overview**, choose the Web (`</>`) icon.
4. Register a nickname such as `rentora-web`. Firebase Hosting can be enabled later.
5. Keep the displayed web configuration open; it contains the values required below.

Firebase client configuration is public by design. It is not a service-account secret.

## 2. Enable Email/Password Authentication

Go to **Build → Authentication → Get started → Sign-in method → Email/Password**. Enable the first Email/Password option and save. Email-link authentication is not needed.

## 3. Create Cloud Firestore

Go to **Build → Firestore Database → Create database**. Choose a region appropriate for the demo and start in production mode. The repository's rules will be deployed before use; do not leave test-mode rules active.

## 4. Configure the local web app

```powershell
Copy-Item .env.example .env.local
```

Edit `.env.local` and copy each value from the Firebase web configuration:

```dotenv
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-id
VITE_FIREBASE_STORAGE_BUCKET=your-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_USE_EMULATORS=true
```

Vite only loads changed environment files after a server restart. Emulator connections occur only when `import.meta.env.DEV` is true and `VITE_USE_EMULATORS=true`; production builds never connect to localhost.

## 5. Install dependencies and Firebase CLI

Install Node.js 22 LTS and a Java 21 LTS runtime, then:

```powershell
npm.cmd install
npx.cmd firebase --version
```

The CLI is included locally. A global installation is optional: `npm.cmd install -g firebase-tools`.

## 6. Log in and link the project

```powershell
npx.cmd firebase login
Copy-Item .firebaserc.example .firebaserc
npx.cmd firebase use --add
```

Select the project created above and assign it the alias `default`. `.firebaserc` may be committed after it contains only the non-secret project ID.

## 7–9. Run emulators, seed, and start Vite

Terminal 1:

```powershell
npm.cmd run emulators
```

Terminal 2:

```powershell
npm.cmd run seed:emulator
npm.cmd run dev
```

Seed is idempotent: it upserts deterministic IDs and does not read, delete, or modify user bookings. Re-running it safely refreshes catalogue fields.

## 10. Test the complete flow

1. Open `/register`, create a user, and confirm the user appears in Emulator UI → Authentication.
2. Search and filter `/cars`; open a detail page.
3. Begin a request, enter valid dates, and confirm the live total.
4. Review checkout and send. Verify the document under `users/{uid}/bookings/{id}`.
5. Open `/account/bookings`, cancel a requested item, and confirm only status and `updatedAt` changed.
6. Create a second user. Copy the first user's booking URL/data path and verify the second user cannot read it.
7. Run automated rules coverage with `npm.cmd run test:rules`, then the real Auth/Firestore flow with `npm.cmd run test:integration`.

## 11. Seed production inventory safely

In Google Cloud/Firebase project settings, create a narrowly protected service account for local administrative work and download its JSON to a location **outside the repository**. Never put it in `public/` or `src/`.

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS='C:\secure\rentora-service-account.json'
npm.cmd run seed:production
Remove-Item Env:GOOGLE_APPLICATION_CREDENTIALS
```

The production script refuses to run without `--production`, `--confirm-production`, and credentials. The package command supplies the first two. It only upserts `cars/{deterministicId}` records and never deletes bookings.

## 12. Deploy rules, indexes, and Hosting

Set `VITE_USE_EMULATORS=false` in `.env.production` (or omit it), ensure the web config points to the real project, then:

```powershell
npm.cmd run lint
npm.cmd run build
npx.cmd firebase deploy --only firestore:rules,firestore:indexes
npx.cmd firebase deploy --only hosting
```

The Hosting rewrite sends all routes to `index.html`, allowing refreshes at `/cars/:id`, `/booking`, and account pages.

## 13. Verify production

1. Open the Hosting URL in a private browser window.
2. In browser developer tools → Network, verify Firestore requests target Google/Firebase endpoints, never `127.0.0.1`.
3. Verify published cars load, an account can register, a request persists after refresh, another account cannot access it, and cancellation works.
4. Confirm browser console has no permission or missing-index errors.

## 14. Troubleshooting

- **Missing permissions:** deploy `firestore.rules`; confirm the user owns the `users/{uid}` path and catalogue queries include `published == true`.
- **Blank catalogue:** start Firestore emulator before seeding, check `VITE_USE_EMULATORS`, then inspect Emulator UI. On production, run the explicit production seed.
- **Wrong Firebase project:** compare `.env.local`, `.firebaserc`, Emulator UI project ID, and the Console project ID. Restart Vite after changes.
- **Unavailable index:** use the Console link in the error or deploy `firestore.indexes.json`. Index creation can take several minutes.
- **Emulator connection refused:** ensure Java is installed and ports 8080/9099 are free. Use `Get-NetTCPConnection -LocalPort 8080,9099`.
- **CORS/network errors:** do not open `index.html` directly; run Vite or Firebase Hosting. Check browser extensions and the Auth authorized-domain list.
- **Broken image:** local images should exist in `public/assets/cars`. The UI falls back to `placeholder.svg`; verify case-sensitive names before deployment.
- **Reset email absent:** the Auth emulator records reset links in its UI/log. Production delivery depends on Firebase Authentication email templates and authorized domains.
