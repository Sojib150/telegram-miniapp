// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBeCWMtjRiLaHhWiP-grW_8QDTRxf8ULLs",
    authDomain: "sojida.firebaseapp.com",
    projectId: "sojida",
    storageBucket: "sojida.firebasestorage.app",
    messagingSenderId: "194824640211",
    appId: "1:194824640211:web:2149cd020f898f40996626"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Cloudinary Info
const CLOUD_NAME = "dlpwdx288";
const UPLOAD_PRESET = "video_upload";

// --- ১. ভিডিও ফিড ও ইনকাম লজিক ---
const videoFeed = document.getElementById('video-feed');

function loadVideos() {
    db.collection("videos").orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
        videoFeed.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const videoId = doc.id;
            
            const videoCard = `
                <div class="video-card" id="v-${videoId}">
                    <video src="${data.url}" loop onclick="handleVideoClick('${videoId}', this)"></video>
                    <div class="side-icons">
                        <i class="fas fa-heart"></i><span>${data.likes || 0}</span>
                        <i class="fas fa-comment"></i><span>0</span>
                        <i class="fas fa-share" onclick="shareVideo('${videoId}', '${data.url}')"></i>
                    </div>
                    <div class="video-info">
                        <p>@${data.uploader_name || 'user'}</p>
                        <span>${data.description || ''}</span>
                    </div>
                </div>
            `;
            videoFeed.innerHTML += videoCard;
        });
    });
}

// ভিডিও ক্লিক করলে ভিউ এবং ইনকাম বাড়বে
function handleVideoClick(videoId, el) {
    if (el.paused) {
        el.play();
        // ইনকাম লজিক: ৫০% ক্রিয়েটর শেয়ার
        const reward = 0.05; // প্রতি ভিউতে ৫ পয়সা (উদাহরণ)
        db.collection("videos").doc(videoId).update({
            views: firebase.firestore.FieldValue.increment(1),
            earnings: firebase.firestore.FieldValue.increment(reward)
        });
    } else {
        el.pause();
    }
}

// --- ২. পেমেন্ট গেটওয়ে (Withdrawal System) ---
function requestWithdraw(method, accountDetails, amount) {
    const user = auth.currentUser;
    if (!user) return alert("লগইন করুন");

    db.collection("withdrawals").add({
        userId: user.uid,
        method: method, // bKash, Nagad, Binance
        details: accountDetails,
        amount: amount,
        status: "pending",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("আপনার পেমেন্ট রিকোয়েস্ট পাঠানো হয়েছে!");
    });
}

// --- ৩. প্রফেশনাল মেসেজিং সিস্টেম (ছবি ও ভিডিও শেয়ার) ---
function sendMessage(receiverId, messageText, fileUrl = null, isVideo = false) {
    const senderId = auth.currentUser.uid;
    const chatId = [senderId, receiverId].sort().join('_');

    db.collection("chats").doc(chatId).collection("messages").add({
        sender: senderId,
        text: messageText,
        fileUrl: fileUrl,
        isVideo: isVideo,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// প্ল্যাটফর্ম থেকে ভিডিও মেসেজে শেয়ার করা
function shareVideo(videoId, videoUrl) {
    const friendId = prompt("বন্ধুর ইউজার আইডি দিন:");
    if (friendId) {
        sendMessage(friendId, "এই ভিডিওটি দেখো!", videoUrl, true);
        alert("ভিডিও শেয়ার হয়েছে!");
    }
}

// --- ৪. ক্লাউডিনারি ফাইল আপলোড (মেসেজ বা ভিডিওর জন্য) ---
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData
    });
    return await res.json();
}

// ইনপুট লিসেনার ভিডিও আপলোডের জন্য
document.getElementById('video-upload')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const data = await uploadToCloudinary(file);
        const user = auth.currentUser;
        db.collection("videos").add({
            url: data.secure_url,
            uploader_id: user ? user.uid : "guest",
            views: 0,
            earnings: 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
});

// শুরুর কল
loadVideos();
