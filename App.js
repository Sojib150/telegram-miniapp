// Firebase Config
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

// Cloudinary Info
const CLOUD_NAME = "dlpwdx288";
const UPLOAD_PRESET = "video_upload";

// Video Upload Logic
document.getElementById('video-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const modal = document.getElementById('upload-modal');
    const progressBar = document.getElementById('progress');
    modal.style.display = 'flex';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.secure_url) {
            // Save to Firestore
            db.collection("videos").add({
                url: data.secure_url,
                views: 0,
                earnings: 0,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                location.reload(); // Refresh to see new video
            });
        }
    })
    .catch(err => alert("আপলোড ব্যর্থ হয়েছে!"));
});

// Load Videos from Firebase
const videoFeed = document.getElementById('video-feed');
db.collection("videos").orderBy("timestamp", "desc").get().then((querySnapshot) => {
    videoFeed.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const videoData = doc.data();
        const videoElement = `
            <div class="video-card">
                <video src="${videoData.url}" loop onclick="this.paused ? this.play() : this.pause()"></video>
                <div class="side-icons">
                    <i class="fas fa-heart"></i><span>0</span>
                    <i class="fas fa-comment"></i><span>0</span>
                    <i class="fas fa-share"></i>
                </div>
            </div>
        `;
        videoFeed.innerHTML += videoElement;
    });
});
