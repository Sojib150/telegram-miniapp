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

// --- ১. অ্যালার্ট সিস্টেম ---
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

// --- ২. লাইক বাটন লজিক (Real-time UI Update সহ) ---
async function handleLike(id, el) {
    const user = auth.currentUser;
    if(!user) return sojiAlert("লাইক দিতে লগইন করুন!");

    const icon = el.querySelector('i');
    const likeCountEl = el.querySelector('.like-count');
    let currentLikes = parseInt(likeCountEl.innerText);
    
    if(icon.classList.contains('fa-solid')) {
        // আনলাইক করা
        icon.classList.replace('fa-solid', 'fa-regular');
        icon.style.color = "#fff";
        likeCountEl.innerText = currentLikes - 1;
        await db.collection("videos").doc(id).update({ 
            likes: firebase.firestore.FieldValue.increment(-1),
            likedBy: firebase.firestore.FieldValue.arrayRemove(user.uid)
        });
    } else {
        // লাইক দেওয়া
        icon.classList.replace('fa-regular', 'fa-solid');
        icon.style.color = "#fe2c55";
        likeCountEl.innerText = currentLikes + 1;
        await db.collection("videos").doc(id).update({ 
            likes: firebase.firestore.FieldValue.increment(1),
            likedBy: firebase.firestore.FieldValue.arrayUnion(user.uid)
        });
    }
}

// --- ৩. ৫ সেকেন্ড ইনকাম ও ভিউ লজিক ---
function setupIncomeTracking(video, creatorId, videoId) {
    let rewarded = false;
    video.ontimeupdate = () => {
        if (video.currentTime >= 5 && !rewarded) {
            rewarded = true;
            const user = auth.currentUser;
            
            // নিজে নিজের ভিডিও দেখলে টাকা হবে না
            if (user && user.uid !== creatorId) {
                db.collection("users").doc(creatorId).update({
                    balance: firebase.firestore.FieldValue.increment(0.10)
                });
                console.log("Revenue sent to creator!");
            }
            
            // ভিউ কাউন্ট আপডেট
            db.collection("videos").doc(videoId).update({
                views: firebase.firestore.FieldValue.increment(1)
            });
        }
    };
}

// --- ৪. কমেন্ট সিস্টেম ---
let activeVideoId = null;
function openComments(videoId) {
    activeVideoId = videoId;
    document.getElementById('comment-modal').style.bottom = "0";
    loadComments(videoId);
}

function closeComments() {
    document.getElementById('comment-modal').style.bottom = "-100%";
}

async function loadComments(videoId) {
    const list = document.getElementById('comment-list');
    list.innerHTML = "লোডিং...";
    db.collection("videos").doc(videoId).collection("comments").orderBy("time", "desc").onSnapshot(snap => {
        list.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data();
            list.innerHTML += `<div class="comment-item"><b>${d.userName}:</b> ${d.text}</div>`;
        });
    });
}

async function postComment() {
    const input = document.getElementById('c-input');
    if(!input.value.trim() || !activeVideoId) return;
    
    await db.collection("videos").doc(activeVideoId).collection("comments").add({
        text: input.value,
        userName: auth.currentUser ? (auth.currentUser.displayName || "User") : "Guest",
        time: firebase.firestore.FieldValue.serverTimestamp()
    });
    input.value = "";
}

// --- ৫. শেয়ার লজিক ---
function shareSojiDa(url) {
    if (navigator.share) {
        navigator.share({ title: 'SojiDa Video', url: url });
    } else {
        navigator.clipboard.writeText(url);
        sojiAlert("লিঙ্ক কপি করা হয়েছে!");
    }
}

// --- ৬. গ্লোবাল চেক ও রান ---
function checkAuth() {
    auth.onAuthStateChanged(user => {
        if (!user && !window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
            window.location.href = 'login.html';
        }
    });
}

// অ্যাপ রান করার সাথে সাথে এই ফাংশনগুলো চালু হবে
checkAuth(); 

console.log("SojiDa Engine: 100% Fixed & Active 🚀");
