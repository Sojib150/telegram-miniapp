// app.js (type="module")
import { firebaseConfig } from './firebase.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, onSnapshot, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// init firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Telegram WebApp helper
export function getTelegramUser() {
  try {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      return tg.initDataUnsafe?.user || null;
    }
  } catch(e) { console.warn("tg not available", e); }
  return null;
}

// ensure user document exists
export async function ensureUserDoc(userId, userObj = {}) {
  if(!userId) return;
  const ref = doc(db, "users", String(userId));
  const snap = await getDoc(ref);
  if(!snap.exists()) {
    await setDoc(ref, {
      name: userObj.name || "Guest",
      username: userObj.username || null,
      telegramId: userId,
      coins: 0,
      referrals: 0,
      createdAt: new Date().toISOString()
    });
  }
  return ref;
}

// increment coins
export async function addCoinsToUser(userId, amount) {
  if(!userId || !amount) return;
  const ref = doc(db, "users", String(userId));
  await updateDoc(ref, { coins: increment(amount) });
}

// get coins value
export async function getUserCoins(userId) {
  const ref = doc(db, "users", String(userId));
  const snap = await getDoc(ref);
  if(snap.exists()) return snap.data().coins || 0;
  return 0;
}

// create withdraw request
export async function createWithdrawRequest(userId, name, bkashNumber, coins, amountTk) {
  await addDoc(collection(db, "withdraw_requests"), {
    userId, name, bkashNumber, coins, amountTk, status: "pending", time: new Date().toISOString()
  });
}

// expose helpers on window for pages to call
window.appHelpers = { getTelegramUser, ensureUserDoc, addCoinsToUser, getUserCoins, createWithdrawRequest };
