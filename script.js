// ================= Firebase Setup =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// তোমার Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB6b93A_HeU4FADs3o2Ysw6-dlRRS2TbZk",
  authDomain: "telegram-miniapp-e8cc0.firebaseapp.com",
  projectId: "telegram-miniapp-e8cc0",
  storageBucket: "telegram-miniapp-e8cc0.firebasestorage.app",
  messagingSenderId: "827930913054",
  appId: "1:827930913054:web:502b56e0c198d8e9ff410f"
};

// Firebase initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= User System =================
let currentUser = null;
let coins = 0;

// লগইন
signInAnonymously(auth)
  .then(() => {
    console.log("✅ Logged in anonymously");
  })
  .catch((error) => {
    console.error("❌ Login error:", error);
  });

// ইউজার লগইন হলে লিসেন
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    console.log("👉 User ID:", user.uid);

    // ডাটাবেজে চেক করো ইউজার আছে কিনা
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      coins = snap.data().coins || 0;
    } else {
      await setDoc(userRef, { coins: 0, name: "Anonymous" });
      coins = 0;
    }

    updateUI();
  }
});

// ================= Game System =================
function playGame() {
  let reward = Math.floor(Math.random() * 50) + 10; // 10-60 কয়েন
  coins += reward;
  saveCoins();
  alert("🎉 You earned " + reward + " coins!");
  updateUI();
}

// ================= Withdraw System =================
async function withdrawBkash(number) {
  if (coins < 1000) {
    alert("❌ Minimum 1000 coins needed to withdraw.");
    return;
  }

  await updateDoc(doc(db, "users", currentUser.uid), {
    withdrawRequest: {
      number: number,
      amount: Math.floor(coins / 10) * 10, // প্রতি ১০ কয়েনে ১ টাকা
      status: "pending",
      date: new Date().toISOString(),
    }
  });

  alert("✅ Withdraw request sent!");
}

// ================= Profile Update =================
async function updateProfile(name) {
  await updateDoc(doc(db, "users", currentUser.uid), {
    name: name
  });
  alert("✅ Profile updated!");
}

// ================= Save Coins =================
async function saveCoins() {
  if (!currentUser) return;
  await updateDoc(doc(db, "users", currentUser.uid), { coins: coins });
}

// ================= UI Update =================
function updateUI() {
  document.getElementById("coinCount").innerText = coins;
}

// ================= Expose Functions =================
window.playGame = playGame;
window.withdrawBkash = withdrawBkash;
window.updateProfile = updateProfile;
