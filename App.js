import { addCoins, getCoins } from "./firebase.js";

window.onload = async () => {
  // Telegram init data
  const tg = window.Telegram.WebApp;
  tg.expand();

  const userId = tg.initDataUnsafe?.user?.id || "guest";
  const name = tg.initDataUnsafe?.user?.first_name || "Guest";

  document.getElementById("username").innerText = name;

  let balance = await getCoins(userId);
  document.getElementById("balance").innerText = balance;

  // Example: Reward after ad
  document.getElementById("watchAd").addEventListener("click", () => {
    show_9931551().then(async () => {
      await addCoins(userId, 10);
      let newBalance = await getCoins(userId);
      document.getElementById("balance").innerText = newBalance;
      alert("✅ You earned 10 coins!");
    });
  });
};
