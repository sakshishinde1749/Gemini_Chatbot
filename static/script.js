// Theme Management
function toggleTheme() {
    document.body.classList.toggle('theme-dark');
    const icon = document.querySelector('#theme-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    localStorage.setItem('theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('theme-dark');
        const icon = document.querySelector('#theme-toggle i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});

// Auto-resize textarea
const textarea = document.getElementById('user-input');
textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    const lineHeight = parseInt(getComputedStyle(this).lineHeight);
    if (this.scrollHeight > lineHeight * 5) {
        this.style.height = (lineHeight * 5) + 'px';
        this.style.overflowY = 'auto';
    }
});

// Typing indicator
function showTypingIndicator() {
    document.querySelector('.typing-indicator').style.display = 'flex';
}

function hideTypingIndicator() {
    document.querySelector('.typing-indicator').style.display = 'none';
}

// Message handling
function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (message) {
        // Disable input and button while processing
        input.disabled = true;
        document.getElementById('send-button').disabled = true;

        // Add user message to chat
        addMessage(message, 'user-message');
        
        // Show typing indicator
        showTypingIndicator();
        
        // Send message to server
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            hideTypingIndicator();
            addMessage(data.response, 'bot-message', data.raw_response);
        })
        .catch(error => {
            console.error('Error:', error);
            hideTypingIndicator();
            addMessage('Sorry, I encountered an error. Please try again.', 'error-message');
        })
        .finally(() => {
            // Re-enable input and button
            input.disabled = false;
            document.getElementById('send-button').disabled = false;
            input.focus();
        });

        // Reset input and its height
        input.value = '';
        input.style.height = 'auto';
    }
}

function addMessage(message, className, rawMessage = null) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = className;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    if (className === 'bot-message') {
        const botIcon = document.createElement('i');
        botIcon.className = 'fas fa-robot bot-icon';
        messageContent.appendChild(botIcon);
    }

    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    
    // Handle markdown and code highlighting
    if (className === 'bot-message') {
        messageText.innerHTML = message;
        // Highlight code blocks
        messageText.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    } else {
        messageText.textContent = message;
    }
    
    messageContent.appendChild(messageText);
    messageDiv.appendChild(messageContent);

    // Add timestamp
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = 'Just now';
    messageDiv.appendChild(timestamp);
    
    // Add with fade-in animation
    messageDiv.style.opacity = '0';
    chatMessages.appendChild(messageDiv);
    
    // Trigger reflow
    messageDiv.offsetHeight;
    messageDiv.style.opacity = '1';

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Chat management
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        fetch('/clear', {
            method: 'POST'
        })
        .then(() => {
            document.getElementById('chat-messages').innerHTML = '';
            // Add welcome message back
            addMessage(`👋 Hello! I'm your AI assistant. How can I help you today?`, 'bot-message');
        });
    }
}

function exportChat() {
    fetch('/export')
        .then(response => response.json())
        .then(data => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
}

// Voice input (placeholder)
function toggleMic() {
    alert('Voice input feature coming soon!');
}

// Handle Enter key (Shift+Enter for new line)
document.getElementById('user-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}); 