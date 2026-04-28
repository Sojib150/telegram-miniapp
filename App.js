// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBeCWMtjRiLaHhWiP-grW_8QDTRxf8ULLs",
  authDomain: "sojida.firebaseapp.com",
  databaseURL: "https://sojida-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sojida",
  storageBucket: "sojida.firebasestorage.app",
  messagingSenderId: "194824640211",
  appId: "1:194824640211:web:2149cd020f898f40996626",
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

// --- SojiDa Custom UI Library ---

// ব্রাউজারের বিরক্তিকর অ্যালার্ট সরাতে এটি ব্যবহার করুন
function sojiAlert(message, title = "SojiDa") {
    const overlay = document.getElementById('soji-overlay');
    const box = document.getElementById('soji-alert');
    
    if(overlay && box) {
        document.getElementById('alert-title').innerText = title;
        document.getElementById('alert-msg').innerText = message;
        overlay.style.display = 'block';
        box.style.display = 'block';
    } else {
        alert(message); // ব্যাকআপ
    }
}

function closeSojiAlert() {
    document.getElementById('soji-overlay').style.display = 'none';
    document.getElementById('soji-alert').style.display = 'none';
}

// --- Video Functions ---

function openComments(videoId) {
    const modal = document.getElementById('comment-modal');
    modal.style.bottom = "0";
    loadComments(videoId);
}

function closeComments() {
    document.getElementById('comment-modal').style.bottom = "-100%";
}

// --- Global Utilities ---

// কারেন্সি ফরম্যাট (৳)
function formatTK(amount) {
    return parseFloat(amount).toFixed(2) + " ৳";
}

// লগইন চেক (Protect Private Pages)
function checkAuth() {
    auth.onAuthStateChanged(user => {
        if (!user && !window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
            window.location.href = 'login.html';
        }
    });
}

// রিয়েল টাইম ব্যালেন্স আপডেট (যেকোনো পেজে ব্যালেন্স দেখাতে)
function syncBalance() {
    const balEl = document.getElementById('user-balance-nav');
    if (balEl && auth.currentUser) {
        db.collection("users").doc(auth.currentUser.uid).onSnapshot(doc => {
            if(doc.exists) balEl.innerText = formatTK(doc.data().balance);
        });
    }
}

// প্রোটেকশন: রাইট ক্লিক বন্ধ (ঐচ্ছিক - ভিডিও চুরির ভয় থাকলে)
/*
document.addEventListener('contextmenu', event => event.preventDefault());
*/

console.log("SojiDa Engine: Active 🚀");
