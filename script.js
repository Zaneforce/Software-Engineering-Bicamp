const toggleButton = document.getElementById("toggle-btn")
const sidebar = document.getElementById("sidebar")

function toggleSidebar(){
    sidebar.classList.toggle("close")
    toggleButton.classList.toggle("rotate")

    Array.from(sidebar.getElementsByClassName("show")).forEach(ul =>{
        ul.classList.remove("show")
        ul.previousElementSibling.classList.remove("rotate")
    })
}

function toggleSubMenu(button){
    button.nextElementSibling.classList.toggle("show")
    button.classList.toggle("rotate")

    if(sidebar.classList.contains("close")){
        sidebar.classList.toggle("close")
        toggleButton.classList.toggle("rotate")
    }
}

function toggleChat(){
    const chatbox = document.getElementById("ai-chat")
    chatbox.classList.toggle("hidden")
}

const API_KEY = "AIzaSyBeMjD5bC-wdhsdylTe3t9vt3o_Upm2nZ8";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

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
        aiImage.src = "./icon/bot.png";
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
            { role: "user", parts: [{ text: `From now on, you are Bibo - Personal AI Assistant for BiCamp. Speak in a casual, fun, and humorous way, like a friendly chatbot who loves to joke. Always introduce yourself as 'Bibo' and make interactions lively: ${userText}` }] },
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
            botMessageElement.querySelector("p").textContent = data.candidates[0].content.parts[0].text;
        } else {
            botMessageElement.querySelector("p").textContent = "Bibo doesn't understand. Please try again!";
        }
    } catch (error) {
        console.error("Error fetching AI response:", error);
        botMessageElement.querySelector("p").textContent = "Sorry, something went wrong.";
    }

    chatBody.scrollTop = chatBody.scrollHeight;
}
