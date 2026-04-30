import { db } from '../lib/firebase';
import { collection, doc, getDocs, setDoc, addDoc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/error';
import { Product, Order } from '../types';
import { INITIAL_PRODUCTS } from '../data/seed';

export const productsCollection = 'products';
export const ordersCollection = 'orders';

export async function seedProducts() {
  try {
    const productsRef = collection(db, productsCollection);
    const snapshot = await getDocs(productsRef);
    if (snapshot.empty) {
      console.log('Seeding products...');
      for (const product of INITIAL_PRODUCTS) {
        await addDoc(productsRef, product);
      }
      console.log('Seeding complete.');
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, productsCollection);
  }
}

export function subscribeToProducts(callback: (products: Product[]) => void) {
  const q = query(collection(db, productsCollection));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    callback(products);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, productsCollection);
  });
}

export async function createOrder(order: Order) {
  try {
    const docRef = await addDoc(collection(db, ordersCollection), order);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, ordersCollection);
  }
}

export function subscribeToOrders(callback: (orders: Order[]) => void) {
  const q = query(collection(db, ordersCollection), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    callback(orders);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, ordersCollection);
  });
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
  try {
    const orderRef = doc(db, ordersCollection, orderId);
    await updateDoc(orderRef, { status, updatedAt: Date.now() });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ordersCollection}/${orderId}`);
  }
}
