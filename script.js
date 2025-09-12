// ========== Global User Data ==========
let coins = 0;
let username = "";
let bkashNumber = "";

// Load saved data from localStorage
window.onload = () => {
  coins = parseInt(localStorage.getItem("coins")) || 0;
  username = localStorage.getItem("username") || "";
  bkashNumber = localStorage.getItem("bkashNumber") || "";
  updateUI();
};

// Save data to localStorage
function saveData() {
  localStorage.setItem("coins", coins);
  localStorage.setItem("username", username);
  localStorage.setItem("bkashNumber", bkashNumber);
}

// Update coin UI
function updateUI() {
  const coinElement = document.getElementById("coinBalance");
  if (coinElement) coinElement.innerText = coins;
}

// ========== Ads System ==========
function showAd(adId) {
  const adContainer = document.getElementById("adContainer");
  adContainer.innerHTML = "";

  // Example Adsterra Ad
  if (adId === 1) {
    adContainer.innerHTML = `
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
  }

  // Start timer
  let timeLeft = 15;
  const timer = document.getElementById("timer");
  timer.innerText = `⏳ Please wait ${timeLeft}s`;

  let countdown = setInterval(() => {
    timeLeft--;
    timer.innerText = `⏳ Please wait ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      coins += 10; // ১০ কয়েন প্রতি এড
      saveData();
      updateUI();
      timer.innerText = "✅ Coins added!";
    }
  }, 1000);
}

// ========== Game Reward ==========
function playGame() {
  alert("🎮 Game finished!");
  coins += 5; // প্রতিবার গেম শেষে ৫ কয়েন
  saveData();
  updateUI();
}

// ========== Withdraw ==========
function withdrawRequest() {
  username = document.getElementById("username").value;
  bkashNumber = document.getElementById("bkashNumber").value;

  if (coins < 1000) {
    alert("❌ Minimum 1000 coins required!");
    return;
  }

  if (!username || !bkashNumber) {
    alert("❌ Please enter your name & Bkash number!");
    return;
  }

  alert(`✅ Withdraw request sent!\nName: ${username}\nBkash: ${bkashNumber}\nCoins: ${coins}`);
  saveData();
}

// ========== Profile ==========
function loadProfile() {
  document.getElementById("profileName").innerText = username || "Not set";
  document.getElementById("profileBkash").innerText = bkashNumber || "Not set";
  document.getElementById("profileCoins").innerText = coins;
}
