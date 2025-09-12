// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB6b93A_HeU4FADs3o2Ysw6-dlRRS2TbZk",
  authDomain: "telegram-miniapp-e8cc0.firebaseapp.com",
  projectId: "telegram-miniapp-e8cc0",
  storageBucket: "telegram-miniapp-e8cc0.firebasestorage.app",
  messagingSenderId: "827930913054",
  appId: "1:827930913054:web:502b56e0c198d8e9ff410f"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Telegram WebApp
const tg = window.Telegram.WebApp;
const user = tg.initDataUnsafe?.user;

// নতুন ইউজার হলে সেভ করো
async function saveUserData() {
  if (!user) return;

  const userRef = db.collection("users").doc(user.id.toString());
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      name: user.first_name,
      telegramId: user.id,
      coins: 0,
      createdAt: new Date()
    });
  }
}

// কয়েন বাড়ানো
async function addCoins(amount) {
  if (!user) return;

  const userRef = db.collection("users").doc(user.id.toString());
  await userRef.update({
    coins: firebase.firestore.FieldValue.increment(amount)
  });

  loadProfile();
}

// প্রোফাইল লোড করা
async function loadProfile() {
  if (!user) return;

  const userRef = db.collection("users").doc(user.id.toString());
  const doc = await userRef.get();

  if (doc.exists) {
    const data = doc.data();
    document.getElementById("profileName").innerText = "👤 নাম: " + data.name;
    document.getElementById("profileId").innerText = "🆔 আইডি: " + data.telegramId;
    document.getElementById("profileCoins").innerText = "💰 কয়েন: " + data.coins;
  }
}

// এড বাটনে ক্লিক করলে কয়েন যোগ হবে
document.getElementById("watchAd").addEventListener("click", () => {
  // এখানে চাইলে এড নেটওয়ার্ক যুক্ত করো (Adsterra, Google ইত্যাদি)
  alert("🎥 Ad Watched! You earned 10 coins.");
  addCoins(10);
});

// প্রথমবার লোড হলে সেভ + প্রোফাইল লোড
saveUserData().then(loadProfile);
