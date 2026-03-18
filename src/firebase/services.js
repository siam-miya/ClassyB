import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";
 
// ─── ORDERS ───────────────────────────────────────────────
 
export const submitOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      status: "pending",       // pending | confirmed | shipped | delivered | cancelled
      paymentStatus: "unpaid", // unpaid | paid | cod
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
 
export const getOrders = async () => {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
 
export const updateOrderStatus = async (orderId, updates) => {
  try {
    await updateDoc(doc(db, "orders", orderId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
 
export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, "orders", orderId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
 
// ─── PRODUCTS ─────────────────────────────────────────────
 
export const getProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
 
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
 
export const updateProduct = async (productId, updates) => {
  try {
    await updateDoc(doc(db, "products", productId), updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
 
export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, "products", productId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};