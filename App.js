// ১. আপনার দেওয়া অরিজিনাল Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBeCWMtjRiLaHhWiP-grW_8QDTRxf8ULLs",
  authDomain: "sojida.firebaseapp.com",
  databaseURL: "https://sojida-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sojida",
  storageBucket: "sojida.firebasestorage.app",
  messagingSenderId: "194824640211",
  appId: "1:194824640211:web:2149cd020f898f40996626",
  measurementId: "G-6JVLZVLH7Q"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// ২. আপনার দেওয়া Cloudinary তথ্য
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlpwdx288/video/upload";
const CLOUDINARY_UPLOAD_PRESET = "video_upload"; 

// ৩. ভিডিও আপলোড ফাংশন (Cloudinary + Progress Bar)
async function uploadToCloud() {
    const file = document.getElementById('video-upload').files[0];
    const postBtn = document.querySelector('.post-btn');
    const progressFill = document.getElementById('progress-fill');
    const statusDiv = document.getElementById('upload-status');

    if (!file) return alert("দয়া করে ভিডিও ফাইল সিলেক্ট করুন!");

    // UI আপডেট
    statusDiv.style.display = "block";
    postBtn.disabled = true;
    postBtn.innerText = "আপলোড হচ্ছে...";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (data.secure_url) {
            // ফায়ারবেসে সেভ করা
            saveToFirebase(data.secure_url);
        }
    } catch (err) {
        alert("আপলোড ব্যর্থ হয়েছে! ইন্টারনেট চেক করুন।");
        postBtn.disabled = false;
    }
}

// ৪. ভিডিওর তথ্য ফায়ারবেসে জমা করা
function saveToFirebase(videoUrl) {
    const caption = document.querySelector('.input-field').value;
    
    db.collection("videos").add({
        url: videoUrl,
        caption: caption,
        creatorId: auth.currentUser ? auth.currentUser.uid : "anonymous",
        likes: 0,
        views: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("সফলভাবে পাবলিশ হয়েছে!");
        window.location.href = "index.html";
    });
}
