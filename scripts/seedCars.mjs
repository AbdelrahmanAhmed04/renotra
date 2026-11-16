import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cars } from '../src/data/cars.js';

const args = new Set(process.argv.slice(2));
const emulatorMode = args.has('--emulator');
const productionMode = args.has('--production');

if (emulatorMode === productionMode) {
  console.error('Choose exactly one mode: --emulator or --production');
  process.exit(1);
}

let app;
if (emulatorMode) {
  process.env.FIRESTORE_EMULATOR_HOST ||= '127.0.0.1:8080';
  const projectId = process.env.GCLOUD_PROJECT || process.env.VITE_FIREBASE_PROJECT_ID || 'rentora-demo';
  app = initializeApp({ projectId });
  console.log(`Seeding local Firestore emulator (${projectId}) at ${process.env.FIRESTORE_EMULATOR_HOST}…`);
} else {
  if (!args.has('--confirm-production')) {
    console.error('Production seeding requires --confirm-production. Nothing was written.');
    process.exit(1);
  }
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('Set GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON file outside this repository.');
    process.exit(1);
  }
  const serviceAccountPath = resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'));
  app = initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id });
  console.log(`PRODUCTION MODE: upserting car inventory in ${serviceAccount.project_id}. Existing bookings are never touched.`);
}

const db = getFirestore(app);
const batch = db.batch();
for (const { id, ...car } of cars) {
  batch.set(db.collection('cars').doc(id), { ...car, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}
await batch.commit();
console.log(`Upserted ${cars.length} deterministic car documents. No other collections were changed.`);
await Promise.all(getApps().map((item) => item.delete()));
