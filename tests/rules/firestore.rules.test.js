// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, it } from 'vitest';
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import {
  addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp,
  setDoc, updateDoc, where
} from 'firebase/firestore';
import { readFile } from 'node:fs/promises';

let env;
const projectId = 'demo-no-project';
const car = {
  brand: 'Toyota', model: 'Corolla', name: 'Toyota Corolla', year: 2024,
  category: 'sedan', transmission: 'automatic', seats: 5, fuelType: 'petrol', luggage: 3,
  pricePerDay: 2200, currency: 'EGP', description: 'Test car', features: [], images: [],
  featured: true, published: true, sortOrder: 1
};

const validBooking = (uid = 'alice') => ({
  userId: uid, carId: 'toyota-corolla-2024', carNameSnapshot: 'Toyota Corolla',
  dailyRateSnapshot: 2200, currency: 'EGP', pickupDate: '2099-05-10', returnDate: '2099-05-13',
  rentalDays: 3, estimatedTotal: 6600, customerName: 'Alice Student',
  customerEmail: 'alice@example.com', customerPhone: '01012345678', pickupLocation: 'New Cairo',
  status: 'requested', createdAt: serverTimestamp(), updatedAt: serverTimestamp()
});

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId,
    firestore: { rules: await readFile('firestore.rules', 'utf8') }
  });
});

afterAll(() => env.cleanup());
afterEach(() => env.clearFirestore());
beforeEach(async () => {
  await env.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'cars/toyota-corolla-2024'), car);
    await setDoc(doc(context.firestore(), 'cars/hidden-car'), { ...car, name: 'Hidden', published: false });
  });
});

describe('public catalogue access', () => {
  it('allows published car reads and denies hidden car reads', async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertSucceeds(getDoc(doc(db, 'cars/toyota-corolla-2024')));
    await assertFails(getDoc(doc(db, 'cars/hidden-car')));
    await assertSucceeds(getDocs(query(collection(db, 'cars'), where('published', '==', true))));
  });

  it('denies all client car writes', async () => {
    const db = env.authenticatedContext('alice', { email: 'alice@example.com' }).firestore();
    await assertFails(setDoc(doc(db, 'cars/new-car'), car));
    await assertFails(updateDoc(doc(db, 'cars/toyota-corolla-2024'), { pricePerDay: 1 }));
  });
});

describe('profiles and booking ownership', () => {
  it('allows a valid own profile but denies cross-user access', async () => {
    const alice = env.authenticatedContext('alice', { email: 'alice@example.com' }).firestore();
    await assertSucceeds(setDoc(doc(alice, 'users/alice'), { displayName: 'Alice', email: 'alice@example.com', phone: '01012345678', createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
    const bob = env.authenticatedContext('bob', { email: 'bob@example.com' }).firestore();
    await assertFails(getDoc(doc(bob, 'users/alice')));
  });

  it('allows valid own booking creation and denies anonymous writes', async () => {
    const alice = env.authenticatedContext('alice', { email: 'alice@example.com' }).firestore();
    await assertSucceeds(addDoc(collection(alice, 'users/alice/bookings'), validBooking()));
    const guest = env.unauthenticatedContext().firestore();
    await assertFails(addDoc(collection(guest, 'users/alice/bookings'), validBooking()));
  });

  it('denies cross-user booking access', async () => {
    let bookingId;
    await env.withSecurityRulesDisabled(async (context) => {
      const record = await addDoc(collection(context.firestore(), 'users/alice/bookings'), validBooking());
      bookingId = record.id;
    });
    const bob = env.authenticatedContext('bob', { email: 'bob@example.com' }).firestore();
    await assertFails(getDoc(doc(bob, `users/alice/bookings/${bookingId}`)));
    await assertFails(updateDoc(doc(bob, `users/alice/bookings/${bookingId}`), { status: 'cancelled', updatedAt: serverTimestamp() }));
  });

  it('rejects price manipulation and unsupported status', async () => {
    const alice = env.authenticatedContext('alice', { email: 'alice@example.com' }).firestore();
    await assertFails(addDoc(collection(alice, 'users/alice/bookings'), { ...validBooking(), dailyRateSnapshot: 10, estimatedTotal: 30 }));
    await assertFails(addDoc(collection(alice, 'users/alice/bookings'), { ...validBooking(), status: 'confirmed' }));
  });

  it('allows requested-to-cancelled only and denies immutable-field updates', async () => {
    const alice = env.authenticatedContext('alice', { email: 'alice@example.com' }).firestore();
    const record = await addDoc(collection(alice, 'users/alice/bookings'), validBooking());
    await assertFails(updateDoc(record, { estimatedTotal: 1, status: 'cancelled', updatedAt: serverTimestamp() }));
    await assertSucceeds(updateDoc(record, { status: 'cancelled', updatedAt: serverTimestamp() }));
    await assertFails(updateDoc(record, { status: 'requested', updatedAt: serverTimestamp() }));
  });
});
