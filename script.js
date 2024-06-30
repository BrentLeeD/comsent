// DOM elements
const app = document.getElementById('app');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const userSelection = document.getElementById('user-selection');
const userButtons = document.querySelectorAll('.user-button');

// Global variables
let currentUser = '';
let chatHistory = [];

// Initialize the app
function init() {
    showUserSelection();
    addEventListeners();
}

// Show user selection screen
function showUserSelection() {
    userSelection.classList.remove('hidden');
    app.style.display = 'none';
}

// Hide user selection and show chat
function showChat() {
    userSelection.classList.add('hidden');
    app.style.display = 'flex';
    userInput.focus();
}

// Add event listeners
function addEventListeners() {
    userButtons.forEach(button => {
        button.addEventListener('click', () => selectUser(button.dataset.user));
    });

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    userInput.addEventListener('input', autoResizeTextarea);
}

// Select user and start chat
function selectUser(user) {
    currentUser = user;
    showChat();
    displayMessage(`Welcome, ${currentUser}! How can I assist you today?`, 'assistant');
}

// Send message
function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        displayMessage(message, 'user');
        userInput.value = '';
        autoResizeTextarea();
        // Here you would typically send the message to your backend or AI service
        // For now, we'll just simulate a response
        setTimeout(() => {
            displayMessage(`This is a simulated response to: "${message}"`, 'assistant');
        }, 1000);
    }
}

// Display message in chat
function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add to chat history
    chatHistory.push({ sender, message });
}

// Auto-resize textarea
function autoResizeTextarea() {
    userInput.style.height = 'auto';
    userInput.style.height = (userInput.scrollHeight) + 'px';
}

// Initialize the app
init();
