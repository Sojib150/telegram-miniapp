let balance = 0;
let adTimer;
let adDuration = 15; // 15 seconds

const balanceEl = document.getElementById("balance");
const timerEl = document.getElementById("timer");
const adContainer = document.getElementById("adContainer");
const messageEl = document.getElementById("message");

document.getElementById("watchAdBtn").addEventListener("click", () => {
  showAd();
});

document.getElementById("playGameBtn").addEventListener("click", () => {
  // গেম শেষ হলে কয়েন দিবে (ডেমো হিসেবে 5 কয়েন)
  balance += 5;
  updateBalance();
  alert("গেম শেষ! 🎮 আপনি ৫ কয়েন পেয়েছেন।");
});

document.getElementById("withdrawForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const bkash = document.getElementById("bkash").value;

  if (balance < 1000) {
    messageEl.innerText = "❌ মিনিমাম ১০০০ কয়েন লাগবে উইথড্র করার জন্য।";
    return;
  }

  messageEl.innerText = `✅ উইথড্র রিকোয়েস্ট পাঠানো হয়েছে। 
নাম: ${name}, বিকাশ: ${bkash}`;
  
  // TODO: Firebase-এ এই ডেটা সেভ হবে
});

function showAd() {
  adContainer.classList.remove("hidden");
  adContainer.innerHTML = `
    <!-- এখানে Adsterra কোড বসান -->
    <script type="text/javascript">
      atOptions = {
        'key' : 'eda134a8fa75db6902f36583f99bde3f',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="//www.highperformanceformat.com/eda134a8fa75db6902f36583f99bde3f/invoke.js"></script>
  `;

  let timeLeft = adDuration;
  timerEl.innerText = `⏳ অপেক্ষা করুন ${timeLeft} সেকেন্ড...`;

  adTimer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `⏳ অপেক্ষা করুন ${timeLeft} সেকেন্ড...`;

    if (timeLeft <= 0) {
      clearInterval(adTimer);
      adContainer.innerHTML = "";
      timerEl.innerText = "";
      balance += 10; // প্রতি অ্যাডে ১০ কয়েন
      updateBalance();
      alert("🎉 অ্যাড শেষ! আপনি ১০ কয়েন পেয়েছেন।");
    }
  }, 1000);
}

function updateBalance() {
  balanceEl.innerText = balance;
}
