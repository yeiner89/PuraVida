const apiKey = "";
const apiUrl = "https://api.openai.com/v1/engines/text-davinci-003/completions";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const loadingIndicator = document.getElementById("loading-indicator");
const replyBox = document.getElementById("reply-box");

userInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendButton.click();
  }
});

sendButton.addEventListener("click", async () => {
  const userMessage = userInput.value;
  if (userMessage.trim() === "") return;

  displayMessage(userMessage, "user-message");
  toggleLoadingIndicator(true);

  try {
    const aiResponse = await getChatResponse(userMessage);
    displayReply(aiResponse);
  } catch (error) {
    displayErrorMessage("An error occurred. Please try again.");
  } finally {
    toggleLoadingIndicator(false);
  }

  userInput.value = "";
});

async function getChatResponse(inputText) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: inputText,
      max_tokens: 250, // Adjust as needed
      // Specify the model
    }),
  });

  const data = await response.json();
  return data.choices[0].text;
}

function displayMessage(message, messageType) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = message;
  messageDiv.classList.add("message", messageType);
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function toggleLoadingIndicator(show) {
  loadingIndicator.style.display = show ? "block" : "none";
  sendButton.disabled = show;
}

function displayReply(reply) {
  const replyLines = reply.split("\n"); // Split the response by line breaks

  replyBox.innerHTML = ""; // Clear previous replies

  for (const line of replyLines) {
    const replyDiv = document.createElement("div");
    replyDiv.textContent = line;
    replyDiv.classList.add("reply-message");
    replyBox.appendChild(replyDiv);
  }
}

function displayErrorMessage(message) {
  const errorDiv = document.createElement("div");
  errorDiv.textContent = message;
  errorDiv.classList.add("message", "error-message");
  chatBox.appendChild(errorDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
