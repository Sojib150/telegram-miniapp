// ১. ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
    apiKey: "AIzaSyBeCWMtjRiLaHhWiP-grW_8QDTRxf8ULLs",
    authDomain: "sojida.firebaseapp.com",
    databaseURL: "https://sojida-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sojida",
    storageBucket: "sojida.firebasestorage.app",
    messagingSenderId: "194824640211",
    appId: "1:194824640211:web:2149cd020f898f40996626",
};

// ২. ইনিশিয়ালাইজেশন
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

// ৩. ইউনিভার্সাল অ্যালার্ট সিস্টেম
function sojiAlert(message, title = "SojiDa") {
    const overlay = document.getElementById('soji-overlay');
    const box = document.getElementById('soji-alert');
    if(overlay && box) {
        document.getElementById('alert-title').innerText = title;
        document.getElementById('alert-msg').innerText = message;
        overlay.style.display = 'block';
        box.style.display = 'block';
    } else {
        alert(message);
    }
}

function closeSojiAlert() {
    document.getElementById('soji-overlay').style.display = 'none';
    document.getElementById('soji-alert').style.display = 'none';
}

// ৪. ইনকাম ও ভিউ ট্র্যাকার (৫ সেকেন্ড ভিউ লজিক)
function setupIncomeTracking(video, creatorId, videoId) {
    let rewarded = false;
    video.ontimeupdate = () => {
        if (video.currentTime >= 5 && !rewarded) {
            rewarded = true;
            const currentUser = auth.currentUser;
            
            // নিজে দেখলে ইনকাম হবে না
            if (currentUser && currentUser.uid !== creatorId) {
                db.collection("users").doc(creatorId).update({
                    balance: firebase.firestore.FieldValue.increment(0.10)
                }).then(() => console.log("Income Added"))
                  .catch(err => console.error("Income Error:", err));
            }
            
            // ভিউ কাউন্ট আপডেট
            db.collection("videos").doc(videoId).update({
                views: firebase.firestore.FieldValue.increment(1)
            });
        }
    };
}

// ৫. বাটন লজিক (Like & Share)
async function handleLike(id, el) {
    const user = auth.currentUser;
    if(!user) return sojiAlert("লাইক দিতে লগইন করুন!");
    const icon = el.querySelector('i');
    try {
        if(icon.classList.contains('fa-solid')) {
            icon.classList.replace('fa-solid', 'fa-regular');
            icon.style.color = "#fff";
            await db.collection("videos").doc(id).update({ likes: firebase.firestore.FieldValue.increment(-1) });
        } else {
            icon.classList.replace('fa-regular', 'fa-solid');
            icon.style.color = "#fe2c55";
            await db.collection("videos").doc(id).update({ likes: firebase.firestore.FieldValue.increment(1) });
        }
    } catch(e) { sojiAlert("লাইক কাজ করছে না!"); }
}

function shareSojiDa(url) {
    if (navigator.share) {
        navigator.share({ title: 'SojiDa Video', url: url });
    } else {
        navigator.clipboard.writeText(url);
        sojiAlert("ভিডিও লিঙ্ক কপি করা হয়েছে!");
    }
}

// ৬. লগইন চেক (Auto Redirect)
auth.onAuthStateChanged(user => {
    const path = window.location.pathname;
    if (!user && !path.includes('login.html') && !path.includes('register.html')) {
        window.location.href = 'login.html';
    }
});

console.log("SojiDa Master Engine: Ready 🚀");
