// ১. Firebase Configuration (আপনার নিজের Firebase Config এখানে বসাবেন)
const firebaseConfig = {
    apiKey: "AIzaSyBeCWMtjRiLaHhWiP-grW_8QDTRxf8ULLs",
    authDomain: "sojida.firebaseapp.com",
    projectId: "sojida",
    storageBucket: "sojida.firebasestorage.app",
    messagingSenderId: "194824640211",
    appId: "1:194824640211:web:2149cd020f898f40996626:
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ২. ভিডিও ফিড লোড করার ফাংশন
function loadVideos() {
    const videoContainer = document.getElementById('video-container');
    
    db.collection("videos").orderBy("createdAt", "desc").get().then((querySnapshot) => {
        videoContainer.innerHTML = ''; // লোডার সরিয়ে ফেলা
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const videoHTML = `
                <div class="video-post" style="height: 100vh; scroll-snap-align: start; position: relative;">
                    <video src="${data.url}" style="width: 100%; height: 100%; object-fit: cover;" loop onclick="this.paused ? this.play() : this.paused()"></video>
                    
                    <div class="video-actions">
                        <div class="action-btn" onclick="likeVideo('${doc.id}')">
                            <i class="fa-solid fa-heart"></i>
                            <span>${data.likes || 0}</span>
                        </div>
                        <div class="action-btn">
                            <i class="fa-solid fa-comment-dots"></i>
                            <span>${data.comments || 0}</span>
                        </div>
                        <div class="action-btn">
                            <i class="fa-solid fa-share"></i>
                            <span>শেয়ার</span>
                        </div>
                    </div>

                    <script>
                        setTimeout(() => {
                            updateViewCount('${doc.id}', '${data.creatorId}');
                        }, 5000);
                    </script>
                </div>
            `;
            videoContainer.innerHTML += videoHTML;
        });
    });
}

// ৩. ইনকাম ও ভিউ আপডেট লজিক
function updateViewCount(videoId, creatorId) {
    // প্রতি ১০০০ ভিউতে আমরা ৬০ টাকা দিচ্ছি (অর্থাৎ প্রতি ভিউতে ০.০৬ টাকা)
    const earningPerView = 0.06;

    // ক্রিয়েটরের ব্যালেন্সে টাকা যোগ করা
    db.collection("users").doc(creatorId).update({
        balance: firebase.firestore.FieldValue.increment(earningPerView)
    });

    // ভিডিওর ভিউ কাউন্ট বাড়ানো
    db.collection("videos").doc(videoId).update({
        views: firebase.firestore.FieldValue.increment(1)
    });
}

// ৪. ইউজার লগ-ইন চেক করা
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Logged in as:", user.email);
        loadVideos();
    } else {
        // লগ-ইন না থাকলে লগ-ইন পেজে পাঠিয়ে দেওয়া
        if(window.location.pathname !== "/login.html") {
            window.location.href = "login.html";
        }
    }
});
