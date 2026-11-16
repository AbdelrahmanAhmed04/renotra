// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { deleteApp as deleteAdminApp, getApps as getAdminApps, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { registerUser, getUserProfile, loginUser, logoutUser } from '../../src/services/auth.js';
import { cancelBooking, createBooking, getBooking, getUserBookings } from '../../src/services/bookings.js';

let adminApp;

beforeAll(async () => {
  process.env.FIRESTORE_EMULATOR_HOST ||= '127.0.0.1:8080';
  adminApp = initializeAdminApp({ projectId: 'rentora-demo' }, 'rentora-integration-seed');
  await getAdminFirestore(adminApp).collection('cars').doc('integration-corolla').set({
    brand: 'Toyota', model: 'Corolla', name: 'Toyota Corolla', year: 2024,
    category: 'sedan', transmission: 'automatic', seats: 5, fuelType: 'petrol', luggage: 3,
    pricePerDay: 2200, currency: 'EGP', description: 'Integration test car',
    features: [], images: [], featured: true, published: true, sortOrder: 1
  });
});

afterAll(async () => {
  await logoutUser().catch(() => {});
  await Promise.all(getAdminApps().map((app) => deleteAdminApp(app)));
});

describe('complete authenticated booking flow', () => {
  it('registers, logs in, saves, reads, and cancels a real request', async () => {
    const email = `flow-${Date.now()}@example.com`;
    const password = 'Student12345';
    const user = await registerUser({ displayName: 'Flow Student', email, password, phone: '01012345678' });
    const profile = await getUserProfile(user.uid);
    expect(profile.displayName).toBe('Flow Student');

    await logoutUser();
    const loggedIn = await loginUser(email, password);
    expect(loggedIn.uid).toBe(user.uid);

    const created = await createBooking(loggedIn, {
      carId: 'integration-corolla', pickupDate: '2099-06-10', returnDate: '2099-06-13',
      customerName: 'Flow Student', customerEmail: email, customerPhone: '01012345678',
      pickupLocation: 'New Cairo'
    });
    expect(created.rentalDays).toBe(3);
    expect(created.estimatedTotal).toBe(6600);

    const saved = await getBooking(loggedIn.uid, created.id);
    expect(saved.carNameSnapshot).toBe('Toyota Corolla');
    expect((await getUserBookings(loggedIn.uid)).map((item) => item.id)).toContain(created.id);

    await cancelBooking(loggedIn.uid, created.id);
    expect((await getBooking(loggedIn.uid, created.id)).status).toBe('cancelled');
  });
});
