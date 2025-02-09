const toggleButton = document.getElementById("toggle-btn")
const sidebar = document.getElementById("sidebar")

function toggleSidebar() {
    sidebar.classList.toggle("close")
    toggleButton.classList.toggle("rotate")

    Array.from(sidebar.getElementsByClassName("show")).forEach(ul => {
        ul.classList.remove("show")
        ul.previousElementSibling.classList.remove("rotate")
    })
}

function toggleSubMenu(button) {
    button.nextElementSibling.classList.toggle("show")
    button.classList.toggle("rotate")

    if (sidebar.classList.contains("close")) {
        sidebar.classList.toggle("close")
        toggleButton.classList.toggle("rotate")
    }
}

function toggleChat() {
    const chatbox = document.getElementById("ai-chat")
    chatbox.classList.toggle("hidden")
}

const API_KEY = "AIzaSyBeMjD5bC-wdhsdylTe3t9vt3o_Upm2nZ8";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyBeMjD5bC-wdhsdylTe3t9vt3o_Upm2nZ8`;

const chatInput = document.getElementById("chat-input");
const chatBody = document.getElementById("chat-body");

function toggleChat() {
    document.getElementById("ai-chat").classList.toggle("hidden");
}

function createChatElement(message, className) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(className);

    if (className === "ai-message") {
        const aiImage = document.createElement("img");
        aiImage.src = "../icon/bot.png";
        aiImage.alt = "Bibo";
        aiImage.style.filter = "invert(1)";
        messageDiv.appendChild(aiImage);
    }

    const textElement = document.createElement("p");
    textElement.textContent = message;
    messageDiv.appendChild(textElement);
    return messageDiv;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handleChat();
    }
}

function handleChat() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatBody.appendChild(createChatElement(userMessage, "user-message"));
    chatBody.scrollTop = chatBody.scrollHeight;
    chatInput.value = "";

    setTimeout(() => {
        const botMessage = createChatElement("Bibo is typing...", "ai-message");
        chatBody.appendChild(botMessage);
        chatBody.scrollTop = chatBody.scrollHeight;
        generateResponse(botMessage, userMessage);
    }, 600);
}

async function generateResponse(botMessageElement, userText) {
    const requestData = {
        contents: [
            {
                role: "user",
                parts: [{
                    text: `
                        From now on, you are Bibo, the friendly and humorous AI assistant for BiCamp. 
                        BiCamp is an online collaboration platform for Binus University students that allows them to Interact through chat and voice calls, Discuss topics in forums, Create shared notes, Manage tasks and class schedules, Integrate with Binus LMS
                        Speak in a casual, fun, and lively way, like a chatbot that loves to joke around. 
                        Always introduce yourself as "Bibo" and make interactions engaging. 
                        Now, answer the following question in your signature style: ${userText}
                    `
                }]
            }
        ]
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            let responseText = data.candidates[0].content.parts[0].text;

            responseText = responseText.replace(/\*\*(.*?)\*\*/g, '<span style="font-size: 1.2em; font-weight: bold;">$1</span>');
            responseText = responseText.replace(/\n\n/g, "<br><br>");

            botMessageElement.querySelector("p").innerHTML = responseText;
        } else {
            botMessageElement.querySelector("p").textContent = "Bibo doesn't understand. Please try again!";
        }
    } catch (error) {
        console.error("Error fetching AI response:", error);
        botMessageElement.querySelector("p").textContent = "Sorry, something went wrong.";
    }

    chatBody.scrollTop = chatBody.scrollHeight;
}

//forum
// let forumData = JSON.parse(localStorage.getItem('forumData')) || {
//     threads: []
// };

// // Fungsi untuk render thread
// function renderThreads() {
//     const container = document.getElementById('threads-container');
//     container.innerHTML = '';

//     forumData.threads.forEach((thread, index) => {
//         const threadHTML = `
//             <div class="thread" data-id="${index}">
//                 <div class="thread-header">
//                     <img src="../icon/user.png" alt="User">
//                     <div>
//                         <h3>${thread.title}</h3>
//                         <span class="author">${thread.author}</span>
//                         <span class="date">${new Date(thread.timestamp).toLocaleString()}</span>
//                     </div>
//                 </div>
//                 <div class="thread-content">${thread.content}</div>
//                 <div class="thread-actions">
//                     <button class="btn-like" onclick="toggleLike(${index})">
//                         <i class='bx bx-like'></i> ${thread.likes}
//                     </button>
//                     <button class="btn-reply" onclick="toggleReplyForm(${index})">Reply</button>
//                 </div>

//                 <!-- Form Reply -->
//                 <div class="reply-form hidden" id="reply-form-${index}">
//                     <textarea placeholder="Write your reply..."></textarea>
//                     <button class="btn-submit" onclick="submitReply(${index})">Post Reply</button>
//                 </div>

//                 <!-- Daftar Reply -->
//                 <div class="replies">
//                     ${thread.replies.map((reply, replyIndex) => `
//                         <div class="reply">
//                             <div class="reply-header">
//                                 <img src="../icon/user.png" alt="User">
//                                 <div>
//                                     <span class="author">${reply.author}</span>
//                                     <span class="date">${new Date(reply.timestamp).toLocaleString()}</span>
//                                 </div>
//                             </div>
//                             <div class="reply-content">${reply.content}</div>
//                             <button class="btn-like" onclick="toggleReplyLike(${index}, ${replyIndex})">
//                                 <i class='bx bx-like'></i> ${reply.likes}
//                             </button>
//                         </div>
//                     `).join('')}
//                 </div>
//             </div>
//         `;
//         container.innerHTML += threadHTML;
//     });
// }

// // Fungsi untuk membuat thread baru
// function createNewThread() {
//     const title = document.getElementById('thread-title').value;
//     const content = document.getElementById('thread-content').value;

//     if(title && content) {
//         const newThread = {
//             title,
//             content,
//             author: "Current User", // Ganti dengan sistem auth
//             timestamp: Date.now(),
//             likes: 0,
//             replies: []
//         };

//         forumData.threads.unshift(newThread);
//         saveForumData();
//         toggleThreadForm();
//         renderThreads();
//     }
// }

// // Fungsi untuk like thread
// function toggleLike(threadId) {
//     const thread = forumData.threads[threadId];
//     thread.likes += thread.liked ? -1 : 1;
//     thread.liked = !thread.liked;
//     saveForumData();
//     renderThreads();
// }

// // Fungsi untuk submit reply
// function submitReply(threadId) {
//     const textarea = document.querySelector(`#reply-form-${threadId} textarea`);
//     const content = textarea.value;

//     if(content) {
//         const newReply = {
//             content,
//             author: "Current User",
//             timestamp: Date.now(),
//             likes: 0
//         };

//         forumData.threads[threadId].replies.push(newReply);
//         saveForumData();
//         renderThreads();
//     }
// }

// // Fungsi toggle form
// function toggleThreadForm() {
//     document.querySelector('.thread-form').classList.toggle('hidden');
// }

// function toggleReplyForm(threadId) {
//     document.getElementById(`reply-form-${threadId}`).classList.toggle('hidden');
// }

// // Simpan data ke localStorage
// function saveForumData() {
//     localStorage.setItem('forumData', JSON.stringify(forumData));
// }

// // Initial render
// renderThreads();



// Inisialisasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBCUxI6z4uVUjgOUiSsf3zw6blY4rH6qv4",
    authDomain: "bicampforum.firebaseapp.com",
    projectId: "bicampforum",
    storageBucket: "bicampforum.firebasestorage.app",
    messagingSenderId: "431508702182",
    appId: "1:431508702182:web:3885a994e80248d1018c27",
    measurementId: "G-CC8B40KZLH"
};

// Pastikan Firebase tidak diinisialisasi dua kali
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Debug log untuk memastikan Firebase Firestore siap
console.log("🔥 Firebase Firestore berhasil diinisialisasi!");

// Render threads dari Firestore
function renderThreads() {
    const container = document.getElementById('threads-container');
    container.innerHTML = '';

    db.collection("threads").orderBy("timestamp", "desc").onSnapshot(snapshot => {
        container.innerHTML = ''; // Kosongkan sebelum render ulang
        snapshot.forEach((doc, index) => {
            const thread = doc.data();
            const replies = thread.replies || []; // Pastikan replies ada

            const threadHTML = `
                <div class="thread" data-id="${doc.id}">
                    <div class="thread-header">
                        <img src="../icon/user.png" alt="User">
                        <div>
                            <h3>${thread.title}</h3>
                            <span class="author">${thread.author}</span>
                            <span class="date">
                                ${thread.timestamp ? new Date(thread.timestamp.toDate()).toLocaleString() : "Just now"}
                            </span>
                        </div>
                    </div>
                    <div class="thread-content">${thread.content}</div>
                    <div class="thread-actions">
                        <button class="btn-like" onclick="toggleLike('${doc.id}')">
                            <i class='bx bx-like'></i> ${thread.likes}
                        </button>
                        <button class="btn-reply" onclick="toggleReplyForm('${doc.id}')">Reply</button>
                    </div>

                    <!-- Form Reply -->
                    <div class="reply-form hidden" id="reply-form-${doc.id}">
                        <textarea placeholder="Write your reply..."></textarea>
                        <button class="btn-submit" onclick="submitReply('${doc.id}')">Post Reply</button>
                    </div>

                    <!-- List Reply -->
                    <div class="replies">
                        ${replies.map((reply, replyIndex) => `
                            <div class="reply">
                                <div class="reply-header">
                                    <img src="../icon/user.png" alt="User">
                                    <div>
                                        <span class="author">${reply.author}</span>
                                        <span class="date">${reply.timestamp ? new Date(reply.timestamp.toDate()).toLocaleString() : "Just now"}</span>
                                    </div>
                                </div>
                                <div class="reply-content">${reply.content}</div>
                                <button class="btn-like" onclick="toggleReplyLike(${index}, ${replyIndex})">
                                    <i class='bx bx-like'></i> ${reply.likes || 0}
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            container.innerHTML += threadHTML;
        });
    });
}

// Buat thread baru
function createNewThread() {
    const title = document.getElementById('thread-title').value;
    const content = document.getElementById('thread-content').value;

    if (title && content) {
        console.log("📨 Posting thread:", title, content); // Debug log

        db.collection("threads").add({
            title,
            content,
            author: "Anonymous",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            likes: 0,
            replies: []
        })
            .then(() => {
                console.log("✅ Thread berhasil diposting!");
                document.getElementById('thread-title').value = "";
                document.getElementById('thread-content').value = "";
                toggleThreadForm();
            })
            .catch(error => {
                console.error("❌ Gagal menulis ke Firestore:", error);
            });
    } else {
        console.log("⚠️ Judul atau konten kosong, posting dibatalkan.");
    }
}

// Toggle Like
function toggleLike(threadId) {
    const userId = "user123"; // Gantilah ini dengan sistem autentikasi user sesungguhnya.

    const threadRef = db.collection("threads").doc(threadId);

    threadRef.get().then((doc) => {
        if (doc.exists) {
            let thread = doc.data();
            let likedBy = thread.likedBy || [];

            if (likedBy.includes(userId)) {
                // Jika user sudah like, maka batalkan like (unlike)
                threadRef.update({
                    likes: thread.likes - 1,
                    likedBy: likedBy.filter(id => id !== userId)
                }).then(() => {
                    console.log("👍 Unlike berhasil!");
                    renderThreads(); // Refresh tampilan
                });
            } else {
                // Jika user belum like, tambahkan like
                threadRef.update({
                    likes: thread.likes + 1,
                    likedBy: [...likedBy, userId]
                }).then(() => {
                    console.log("❤️ Like berhasil!");
                    renderThreads(); // Refresh tampilan
                });
            }
        }
    }).catch((error) => {
        console.error("❌ Gagal update like:", error);
    });
}

// Submit Reply
function submitReply(threadId) {
    const textarea = document.querySelector(`#reply-form-${threadId} textarea`);
    const content = textarea.value;

    if (content) {
        const newReply = {
            content,
            author: "Anonymous",
            timestamp: firebase.firestore.Timestamp.now(), // Pastikan timestamp valid
            likes: 0 // Tambahkan likes agar tombol like tidak error
        };

        db.collection("threads").doc(threadId).update({
            replies: firebase.firestore.FieldValue.arrayUnion(newReply)
        }).then(() => {
            console.log("💬 Reply berhasil ditambahkan!");
            textarea.value = ""; // Kosongkan textarea setelah reply dikirim
            renderThreads(); // Refresh tampilan thread agar reply muncul
        }).catch(error => {
            console.error("❌ Gagal menambahkan reply:", error);
        });
    }
}

function toggleReplyLike(threadId, replyIndex) {
    const threadRef = db.collection("threads").doc(threadId);

    threadRef.get().then((doc) => {
        if (doc.exists) {
            let thread = doc.data();
            let replies = thread.replies || [];

            if (replies[replyIndex]) {
                // Pastikan reply memiliki jumlah like
                replies[replyIndex].likes = (replies[replyIndex].likes || 0) + 1;

                // Simpan kembali ke Firestore
                threadRef.update({ replies }).then(() => {
                    console.log("👍 Like pada reply berhasil!");
                    renderThreads(); // Refresh tampilan
                });
            }
        }
    }).catch((error) => {
        console.error("❌ Gagal update like pada reply:", error);
    });
}

// Toggle form thread baru
function toggleThreadForm() {
    document.querySelector('.thread-form').classList.toggle('hidden');
}

// Toggle form reply
function toggleReplyForm(threadId) {
    document.getElementById(`reply-form-${threadId}`).classList.toggle('hidden');
}

// Render threads saat halaman dimuat
window.addEventListener("DOMContentLoaded", renderThreads);



