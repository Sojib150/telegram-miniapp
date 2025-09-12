let coins = 0;

// পেজ পরিবর্তন ফাংশন
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

// কয়েন যোগ করা
document.getElementById("watchAdBtn").addEventListener("click", () => {
  // এখানে তোমার Adsterra কোড বসাতে হবে
  alert("🎬 বিজ্ঞাপন চলছে... (ডেমো)");
  setTimeout(() => {
    coins += 10;
    document.getElementById("coin-balance").innerText = coins;
    alert("✅ 10 কয়েন যোগ হয়েছে!");
  }, 5000); // 5 সেকেন্ড পর কয়েন যোগ হবে
});

// Withdraw ফর্ম সাবমিট
document.getElementById("withdraw-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const number = document.getElementById("bkash-number").value;
  const name = document.getElementById("user-name").value;
  if (coins >= 1000) {
    alert(`✅ উইথড্র রিকোয়েস্ট পাঠানো হলো!\nনাম: ${name}\nবিকাশ: ${number}\nপরিমাণ: 100 টাকা`);
    coins -= 1000;
    document.getElementById("coin-balance").innerText = coins;
  } else {
    alert("⚠️ ন্যূনতম 1000 কয়েন লাগবে উইথড্র করার জন্য।");
  }
});

// প্রোফাইল ডাটা (টেলিগ্রাম থেকে আসলে এখানে দেখাবে)
document.getElementById("profile-name").innerText = "Demo User";
document.getElementById("profile-id").innerText = "@demo_id";
