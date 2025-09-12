// ====== Game Page ======
if (document.getElementById("startGame")) {
  let gameArea = document.getElementById("gameArea");
  let timeLeft = 10;
  let score = 0;
  let gameTimer;

  document.getElementById("startGame").addEventListener("click", () => {
    score = 0;
    timeLeft = 10;
    document.getElementById("score").textContent = score;
    document.getElementById("timeLeft").textContent = timeLeft;
    gameArea.innerHTML = "";
    document.getElementById("adSection").style.display = "none";

    gameTimer = setInterval(() => {
      timeLeft--;
      document.getElementById("timeLeft").textContent = timeLeft;

      // বাবল তৈরি
      let bubble = document.createElement("div");
      bubble.classList.add("bubble");
      bubble.style.left = Math.random() * 250 + "px";
      bubble.style.top = Math.random() * 250 + "px";
      bubble.addEventListener("click", () => {
        score++;
        document.getElementById("score").textContent = score;
        bubble.remove();
      });
      gameArea.appendChild(bubble);

      if (timeLeft <= 0) {
        clearInterval(gameTimer);
        gameArea.innerHTML = "<p>⏹️ গেম শেষ!</p>";
        document.getElementById("adSection").style.display = "block";

        // ১৫ সেকেন্ড পর কয়েন সংগ্রহ বাটন চালু হবে
        let rewardBtn = document.getElementById("collectGameReward");
        setTimeout(() => {
          rewardBtn.disabled = false;
        }, 15000);

        rewardBtn.addEventListener("click", () => {
          coins += 20; // প্রতিবার গেম শেষ হলে 20 কয়েন
          saveCoins();
          alert("🎉 গেম পুরস্কার! ২০ কয়েন যোগ হয়েছে। আপনার মোট কয়েন: " + coins);
          rewardBtn.disabled = true;
        });
      }
    }, 1000);
  });
}
