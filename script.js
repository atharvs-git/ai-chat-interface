const apiKey = "your_api_key_here"
const messages = [
    {
        role: "system",
        content: "You are a helpful assistant named Buddy. Keep responses concise and friendly."
    }
]

async function sendMessage() {
    let userInput = document.getElementById("userInput").value
    if (!userInput) return

    addMessage(userInput, "user")
    document.getElementById("userInput").value = ""

    messages.push({
        role: "user",
        content: userInput
    })

    try {
        let typingDiv = addMessage("AI is typing...", "ai")
        typingDiv.id = "typing"
        
        let response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: messages,
                max_tokens: 1024
            })
        })

        let data = await response.json()
        let aiReply = data.choices[0].message.content

        messages.push({
            role: "assistant",
            content: aiReply
        })
        let typing = document.getElementById("typing")
        if (typing) typing.remove()

        addMessage(aiReply, "ai")

    } catch(error) {
        addMessage("Something went wrong. Try again.", "ai")
        console.log(error)
    }
}

function addMessage(text, sender) {
    let chatbox = document.getElementById("chatbox")
    let div = document.createElement("div")
    div.classList.add("message", sender)
    div.textContent = text
    chatbox.appendChild(div)
    chatbox.scrollTop = chatbox.scrollHeight
    return div 
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage()
    }
})