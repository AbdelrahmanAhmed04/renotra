import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from './firebase.js';

export async function getPublishedCars() {
  const snapshot = await getDocs(query(collection(db, 'cars'), where('published', '==', true), orderBy('sortOrder', 'asc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getFeaturedCars(limitCount = 6) {
  const cars = await getPublishedCars();
  return cars.filter((car) => car.featured).slice(0, limitCount);
}

export async function getPublishedCar(id) {
  if (!id) return null;
  const snapshot = await getDoc(doc(db, 'cars', id));
  if (!snapshot.exists() || snapshot.data().published !== true) return null;
  return { id: snapshot.id, ...snapshot.data() };
}
