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
async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        displayMessage(message, 'user');
        userInput.value = '';
        autoResizeTextarea();

        try {
            // Simulated API call - replace with actual API call
            const response = await new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: () => Promise.resolve({ response: `This is a simulated response to: "${message}"` })
            }), 1000));

            if (!response.ok) {
                throw new Error('API response was not ok');
            }

            const data = await response.json();
            displayMessage(data.response, 'assistant');
        } catch (error) {
            console.error('Error:', error);
            displayMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        }
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

    if (sender === 'assistant') {
        let startX, currentX;
        let isDragging = false;

        messageElement.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        messageElement.addEventListener('touchmove', e => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const swipeDistance = currentX - startX;
            if (swipeDistance > 0) { // Only allow right swipe
                messageElement.style.transform = `translateX(${swipeDistance}px)`;
                messageElement.style.opacity = 1 - (swipeDistance / 200);
            }
        });

        messageElement.addEventListener('touchend', e => {
            isDragging = false;
            const swipeDistance = currentX - startX;
            if (swipeDistance > 100) { // Threshold for save action
                saveMessage(messageElement, message);
            } else {
                // Snap back if not swiped far enough
                messageElement.style.transform = 'translateX(0)';
                messageElement.style.opacity = 1;
            }
        });
    }
}

// Save message to local storage
function saveMessage(messageElement, message) {
    const date = new Date().toISOString().split('T')[0];
    const firstThreeWords = message.split(' ').slice(0, 3).join('_');
    const saveName = `${currentUser}_${date}_${firstThreeWords}`;

    const savedMessages = JSON.parse(localStorage.getItem('savedMessages') || '{}');
    savedMessages[saveName] = message;
    localStorage.setItem('savedMessages', JSON.stringify(savedMessages));

    // Animate message off-screen
    messageElement.style.transform = 'translateX(100%)';
    messageElement.style.opacity = 0;

    // Show "Message Saved!" notification
    const notification = document.createElement('div');
    notification.textContent = 'Message Saved!';
    notification.className = 'save-notification';
    messageElement.appendChild(notification);

    // Remove the message element after animation
    setTimeout(() => {
        messageElement.remove();
    }, 500);
}

// Auto-resize textarea
function autoResizeTextarea() {
    userInput.style.height = 'auto';
    userInput.style.height = (userInput.scrollHeight) + 'px';
}

// Retrieve saved messages
function getSavedMessages() {
    return JSON.parse(localStorage.getItem('savedMessages') || '{}');
}

// Initialize the app
init();
