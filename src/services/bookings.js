import {
  addDoc, collection, doc, getDoc, getDocs, orderBy, query,
  serverTimestamp, updateDoc, where
} from 'firebase/firestore';
import { db } from './firebase.js';
import { rentalDays, validateRentalDates } from '../utils/dates.js';

export async function createBooking(user, input) {
  if (!user) throw new Error('AUTH_REQUIRED');
  const dateError = validateRentalDates(input.pickupDate, input.returnDate);
  if (dateError) throw new Error(dateError);

  const carSnapshot = await getDoc(doc(db, 'cars', input.carId));
  if (!carSnapshot.exists() || carSnapshot.data().published !== true) throw new Error('This vehicle is no longer available for requests.');
  const car = carSnapshot.data();
  const days = rentalDays(input.pickupDate, input.returnDate);
  const dailyRate = Number(car.pricePerDay);
  const estimatedTotal = dailyRate * days;
  const record = {
    userId: user.uid,
    carId: carSnapshot.id,
    carNameSnapshot: car.name,
    dailyRateSnapshot: dailyRate,
    currency: car.currency,
    pickupDate: input.pickupDate,
    returnDate: input.returnDate,
    rentalDays: days,
    estimatedTotal,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim().toLowerCase(),
    customerPhone: input.customerPhone.trim(),
    pickupLocation: input.pickupLocation,
    status: 'requested',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const result = await addDoc(collection(db, 'users', user.uid, 'bookings'), record);
  return { id: result.id, ...record };
}

export async function getUserBookings(uid) {
  const snapshot = await getDocs(query(
    collection(db, 'users', uid, 'bookings'),
    where('userId', '==', uid), orderBy('createdAt', 'desc')
  ));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getBooking(uid, id) {
  const snapshot = await getDoc(doc(db, 'users', uid, 'bookings', id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export function cancelBooking(uid, bookingId) {
  return updateDoc(doc(db, 'users', uid, 'bookings', bookingId), { status: 'cancelled', updatedAt: serverTimestamp() });
}
