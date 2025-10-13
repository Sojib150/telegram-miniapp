// === তোমার নিজের BOT TOKEN বসাও নিচে ===
const TOKEN = "6789317979:AAG46E84Lfjogu-vwVKY2b769p4jODY5nZs";  // ← এখানে তোমার টোকেন দাও
// === তোমার নিজের CHAT ID বসাও নিচে ===
const CHAT_ID = "5230916720";  // ← এখানে তোমার চ্যাট আইডি দাও

document.getElementById("paymentForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const amount = document.getElementById("amount").value;
  const message = `💵 *New Payment Request Received!*\n\n👤 Name: ${name}\n💰 Amount: ${amount} MYR`;

  fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown"
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("status").textContent = "✅ Request sent successfully!";
    document.getElementById("paymentForm").reset();
  })
  .catch(err => {
    document.getElementById("status").textContent = "❌ Failed to send message!";
  });
});
