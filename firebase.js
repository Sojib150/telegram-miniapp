<!-- save as firebase.js -->
<script>
/*
  firebase.js (compat)
  Uses Firebase Web (compat) to keep code simple for copy/paste.
  Exposes window.appHelpers = { ensureUserDoc, addCoins, getCoins, onUserSnapshot, createWithdrawRequest }
*/

(function(){
  // load compat SDKs dynamically (if not already present)
  function loadScript(src){ return new Promise((res, rej) => {
    if(document.querySelector('script[src="'+src+'"]')) return res();
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });}

  const compatBase = "https://www.gstatic.com/firebasejs/9.22.2/";
  Promise.all([
    loadScript(compatBase + "firebase-app-compat.js"),
    loadScript(compatBase + "firebase-firestore-compat.js"),
    loadScript(compatBase + "firebase-auth-compat.js")
  ]).then(init).catch(e=>console.error("Firebase scripts load error", e));

  function init(){
    // ====== Put your Firebase config here (you already gave this) ======
    const firebaseConfig = {
      apiKey: "AIzaSyB6b93A_HeU4FADs3o2Ysw6-dlRRS2TbZk",
      authDomain: "telegram-miniapp-e8cc0.firebaseapp.com",
      projectId: "telegram-miniapp-e8cc0",
      storageBucket: "telegram-miniapp-e8cc0.firebasestorage.app",
      messagingSenderId: "827930913054",
      appId: "1:827930913054:web:502b56e0c198d8e9ff410f"
    };
    if(!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // helpers
    async function ensureUserDoc(userId, userObj = {}) {
      if(!userId) return null;
      const ref = db.collection('users').doc(String(userId));
      const snap = await ref.get();
      if(!snap.exists){
        await ref.set({
          name: userObj.name || userObj.first_name || "Guest",
          username: userObj.username || null,
          telegramId: userId,
          coins: 0,
          referrals: 0,
          createdAt: new Date().toISOString()
        });
      }
      return ref;
    }

    async function addCoins(userId, amount){
      if(!userId) {
        console.warn("addCoins: missing userId");
        return;
      }
      const ref = db.collection('users').doc(String(userId));
      // use transaction to be safe
      await db.runTransaction(async tx => {
        const doc = await tx.get(ref);
        if(!doc.exists) tx.set(ref, { coins: amount }, { merge: true });
        else tx.update(ref, { coins: (doc.data().coins || 0) + amount });
      });
    }

    async function getCoins(userId){
      if(!userId) return 0;
      const snap = await db.collection('users').doc(String(userId)).get();
      return snap.exists ? (snap.data().coins || 0) : 0;
    }

    function onUserSnapshot(userId, cb){
      if(!userId) return () => {};
      const ref = db.collection('users').doc(String(userId));
      return ref.onSnapshot(cb);
    }

    async function createWithdrawRequest(userId, name, bkashNumber, coins, amountTk){
      await db.collection('withdraw_requests').add({
        userId, name, bkashNumber, coins, amountTk, status: "pending", createdAt: new Date().toISOString()
      });
    }

    // export
    window.appHelpers = {
      ensureUserDoc,
      addCoins,
      getCoins,
      onUserSnapshot,
      createWithdrawRequest,
      db
    };

    console.log("Firebase helpers ready");
  }
})();
</script>
