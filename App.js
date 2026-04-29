// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBeCWMtjRiLaHhWiP-grW_8QDTRxf8ULLs",
    authDomain: "sojida.firebaseapp.com",
    databaseURL: "https://sojida-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sojida",
    storageBucket: "sojida.firebasestorage.app",
    messagingSenderId: "194824640211",
    appId: "1:194824640211:web:2149cd020f898f40996626",
};

// ১. ইনিশিয়ালাইজেশন চেক
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("SojiDa Engine: Connected ✅");
    }
} catch (e) {
    alert("ফায়ারবেস কানেক্ট হতে পারছে না! ইন্টারনাল এরর।");
}

const db = firebase.firestore();
const auth = firebase.auth();

// ২. ইউনিভার্সাল অ্যালার্ট
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

// ৩. অটো লগইন রিডাইরেক্ট
auth.onAuthStateChanged(user => {
    const path = window.location.pathname;
    if (!user && !path.includes('login.html') && !path.includes('register.html')) {
        window.location.href = 'login.html';
    }
});

// ৪. ভিডিও লাইক লজিক
async function handleLike(id, el) {
    const user = auth.currentUser;
    if(!user) return sojiAlert("আগে লগইন করুন!");
    
    const icon = el.querySelector('i');
    try {
        if(icon.classList.contains('fa-solid')) {
            icon.classList.replace('fa-solid', 'fa-regular');
            await db.collection("videos").doc(id).update({ likes: firebase.firestore.FieldValue.increment(-1) });
        } else {
            icon.classList.replace('fa-regular', 'fa-solid');
            await db.collection("videos").doc(id).update({ likes: firebase.firestore.FieldValue.increment(1) });
        }
    } catch(err) {
        console.log("Like Error: ", err);
    }
}
