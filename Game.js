const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let balloons = [];
let score = 0;
let gameOver = false;

// বেলুন ক্লাস
class Balloon {
  constructor(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.popped = false;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.y -= this.speed;
    this.draw();
  }
}

// বেলুন জেনারেট
function spawnBalloon() {
  let x = Math.random() * (canvas.width - 40) + 20;
  let radius = 20;
  let speed = Math.random() * 2 + 1;
  balloons.push(new Balloon(x, canvas.height, radius, speed));
}

// গেম লুপ
function animate() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  balloons.forEach((balloon, index) => {
    balloon.update();
    if (balloon.y + balloon.radius < 0) {
      balloons.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

// ক্লিক করে ফাটানো
canvas.addEventListener("click", function (event) {
  let rect = canvas.getBoundingClientRect();
  let mouseX = event.clientX - rect.left;
  let mouseY = event.clientY - rect.top;

  balloons.forEach((balloon, index) => {
    let dx = mouseX - balloon.x;
    let dy = mouseY - balloon.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < balloon.radius) {
      balloons.splice(index, 1);
      score++;
      document.getElementById("score").innerText = "স্কোর: " + score;

      // কয়েন যোগ করো (প্রতি স্কোরে 1 কয়েন)
      let coins = localStorage.getItem("coins") || 0;
      coins = parseInt(coins) + 1;
      localStorage.setItem("coins", coins);

      // প্রতিবার ফাটালে বিজ্ঞাপন দেখাও
      showAd();
    }
  });
});

// Ads function
function showAd() {
  // Monetag SDK (তুমি আগে যে কোড দিলে সেটা ব্যবহার হবে)
  let adScript = document.createElement("script");
  adScript.src = "//libtl.com/sdk.js";
  adScript.setAttribute("data-zone", "9931551");
  adScript.setAttribute("data-sdk", "show_9931551");
  document.body.appendChild(adScript);
}

// গেম শুরু
setInterval(spawnBalloon, 1500);
animate();
