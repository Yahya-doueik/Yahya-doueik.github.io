const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const settingsBtn = document.getElementById('settings-btn');

let GITHUB_PAT = localStorage.getItem('github_pat') || "";

settingsBtn.onclick = () => {
    const key = prompt("Enter your GitHub PAT (with models:read permission):", GITHUB_PAT);
    if (key) {
        GITHUB_PAT = key;
        localStorage.setItem('github_pat', key);
    }
};

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text || !GITHUB_PAT) return alert("Please enter a message and your PAT.");

    addMessage(text, 'user');
    userInput.value = "";

    try {
        const response = await fetch("https://models.github.ai/inference/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GITHUB_PAT}` // Use your PAT here
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Efficient model for coding & chat
                messages: [{ role: "user", content: text }],
                max_tokens: 500 // Prevents infinite token usage
            })
        });

        const data = await response.json();
        const botReply = data.choices[0].message.content;
        addMessage(botReply, 'bot');
    } catch (error) {
        addMessage("Error: Could not reach the model. Check your PAT and permissions.", 'bot');
    }
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.onclick = sendMessage;
userInput.onkeypress = (e) => { if (e.key === "Enter") sendMessage(); };
