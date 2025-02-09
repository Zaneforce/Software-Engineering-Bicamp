// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBCUxI6z4uVUjgOUiSsf3zw6blY4rH6qv4",
    authDomain: "bicampforum.firebaseapp.com",
    projectId: "bicampforum",
    storageBucket: "bicampforum.appspot.com",
    messagingSenderId: "431508702182",
    appId: "1:431508702182:web:3885a994e80248d1018c27"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Fungsi Login
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log("✅ Login sukses!", userCredential.user);
            alert("Login sukses!");
            window.location.href = " http://127.0.0.1:5500/index.html"; // Redirect ke home
        })
        .catch(error => {
            console.error("❌ Login gagal:", error.code, error.message);
            alert("Login gagal: " + error.message);
        });
}

function resetPassword() {
    const email = document.getElementById("email").value;

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert("Email reset password telah dikirim!");
        })
        .catch(error => {
            console.error("❌ Gagal reset password:", error);
            alert(error.message);
        });
}

// Login dengan Google
function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            saveUserToDatabase(user);
            alert("Login sukses dengan Google!");
            window.location.href = " http://127.0.0.1:5500/index.html";
        })
        .catch(error => alert(error.message));
}

// Fungsi Register
function register() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const file = document.getElementById("profile-pic").files[0];

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;

            if (file) {
                // Upload foto profil ke Firebase Storage
                const storageRef = storage.ref("profile_pics/" + user.uid);
                storageRef.put(file).then(() => {
                    storageRef.getDownloadURL().then(url => {
                        saveUserToDatabase(user, username, url);
                    });
                });
            } else {
                // Jika tidak ada foto, gunakan default
                saveUserToDatabase(user, username, "https://via.placeholder.com/150");
            }
        })
        .catch(error => alert(error.message));
}

// Simpan User ke Firestore
function saveUserToDatabase(user, username = "Anonymous", photoURL = "") {
    db.collection("users").doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        username: username,
        photoURL: photoURL
    }).then(() => {
        console.log("User berhasil disimpan di Firestore");
        window.location.href = " http://127.0.0.1:5500/index.html"; // Redirect ke home
    }).catch(error => console.error("Error menyimpan user:", error));
}
