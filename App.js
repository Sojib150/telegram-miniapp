const firebaseConfig = {
    apiKey: "AIzaSyBeCWMtjRiLaHhWiP-grW_8QDTRxf8ULLs",
    authDomain: "sojida.firebaseapp.com",
    databaseURL: "https://sojida-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sojida",
    storageBucket: "sojida.firebasestorage.app",
    messagingSenderId: "194824640211",
    appId: "1:194824640211:web:2149cd020f898f40996626",
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.firestore();
const auth = firebase.auth();

// ইউনিভার্সাল অ্যালার্ট
function sojiAlert(message, title = "SojiDa") {
    const overlay = document.getElementById('soji-overlay');
    const box = document.getElementById('soji-alert');
    if(overlay && box) {
        document.getElementById('alert-title').innerText = title;
        document.getElementById('alert-msg').innerText = message;
        overlay.style.display = 'block';
        box.style.display = 'block';
    } else { alert(message); }
}

function closeSojiAlert() {
    document.getElementById('soji-overlay').style.display = 'none';
    document.getElementById('soji-alert').style.display = 'none';
}

// ইনকাম লজিক (৫ সেকেন্ড + অ্যান্টি-সেলফ ভিউ)
function setupIncomeTracking(video, creatorId, videoId) {
    let rewarded = false;
    video.ontimeupdate = () => {
        if (video.currentTime >= 5 && !rewarded) {
            rewarded = true;
            const user = auth.currentUser;
            if (user && user.uid !== creatorId) {
                db.collection("users").doc(creatorId).update({
                    balance: firebase.firestore.FieldValue.increment(0.10)
                });
            }
            db.collection("videos").doc(videoId).update({
                views: firebase.firestore.increment(1)
            });
        }
    };
}

// লগইন চেক (অটো রিডাইরেক্ট)
auth.onAuthStateChanged(user => {
    const isLoginPage = window.location.href.includes('login.html');
    if (!user && !isLoginPage) {
        window.location.href = 'login.html';
    }
});

console.log("SojiDa Engine: Total Logic Loaded 🚀");
