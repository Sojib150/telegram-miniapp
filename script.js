let coins = localStorage.getItem("coins") ? parseInt(localStorage.getItem("coins")) : 0;

function saveCoins() {
  localStorage.setItem("coins", coins);
}

// ====== Ads Page Timer ======
if (document.getElementById("collectBtn")) {
  let timeLeft = 15;
  let timerEl = document.getElementById("timer");
  let collectBtn = document.getElementById("collectBtn");

  let countdown = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏳ ${timeLeft} সেকেন্ড বাকি...`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      timerEl.textContent = "✅ সময় শেষ! এখন কয়েন সংগ্রহ করুন।";
      collectBtn.disabled = false;
    }
  }, 1000);

  collectBtn.addEventListener("click", () => {
    coins += 10; // প্রতিবার এড দেখলে 10 কয়েন
    saveCoins();
    alert("🎉 অভিনন্দন! ১০ কয়েন যোগ হয়েছে। আপনার মোট কয়েন: " + coins);
    collectBtn.disabled = true;
  });
}
