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

function sendMessage(event){
    if (event.key === "Enter" || event.type === "click") {
        const userInput = document.getElementById("chat-input");
        const chatBody = document.getElementById("chat-body");

        if (userInput.value.trim() === ""){
            return;
        }  

        const userMessage = document.createElement("div");
        userMessage.classList.add("user-message");
        userMessage.textContent = userInput.value;
        chatBody.appendChild(userMessage);

        userInput.value = "";
        setTimeout(() => {
            const aiMessage = document.createElement("div");
            aiMessage.classList.add("ai-message");

            const aiImage = document.createElement("img");
            aiImage.src = "../icon/bot.png";

            const botMessage = document.createElement("p");
            botMessage.textContent = getBotResponse(); 

            aiMessage.appendChild(aiImage);
            aiMessage.appendChild(botMessage);

            chatBody.appendChild(aiMessage);
            chatBody.scrollTop = chatBody.scrollHeight; 
        }, 1000);
    }
}

function getBotResponse() {
    const responses = [
        "Hello! How can I assist you?",
        "I'm here to help!",
        "Tell me what you need!",
        "How can I make your day better?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}
