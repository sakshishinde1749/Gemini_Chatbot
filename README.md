# AI Chatbot with Gemini Pro

![AI Chatbot Demo](demo.gif)

A sophisticated, modern AI chatbot built with Flask and Google's Gemini Pro API. This application features a responsive design, dark mode support, and advanced chat capabilities.

## ✨ Features

### Core Functionality
- 🤖 Powered by Google's Gemini Pro AI model
- 💬 Real-time chat interface
- 🔄 Context-aware conversations
- 🎨 Dark/Light theme support
- 📱 Fully responsive design

### UI/UX Features
- ✍️ Markdown support for messages
- 🖥️ Code syntax highlighting
- ⌨️ Multi-line message input
- ⚡ Smooth animations and transitions
- 🔔 Visual feedback and loading states

### Advanced Features
- 💾 Chat history management
- 📤 Export conversation functionality
- 🔄 Session persistence
- ⚠️ Error handling and recovery
- ⏱️ Message timestamps

## 🛠️ Technologies Used

- **Frontend**:
  - HTML5 & CSS3
  - JavaScript (ES6+)
  - Font Awesome Icons
  - Highlight.js for code highlighting
  - Marked.js for Markdown parsing

- **Backend**:
  - Python 3.7+
  - Flask web framework
  - Google Generative AI SDK
  - Python-dotenv

## 📋 Prerequisites

- Python 3.7 or higher
- Google Cloud API key with Gemini Pro access
- Modern web browser
- Internet connection

## 🚀 Installation

1. **Clone the repository**
git clone https://github.com/yourusername/advanced-ai-chatbot.git
cd advanced-ai-chatbot
2. **Set up virtual environment (recommended)**
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
3. **Install dependencies**
pip install -r requirements.txt
4. **Configure environment variables**
Create a `.env` file in the project root:
GOOGLE_API_KEY=your_gemini_api_key_here
5. **Run the application**
python app.py
6. **Access the chatbot**
Open your browser and navigate to `http://localhost:5000`

## 🎯 Usage

1. **Starting a Chat**
   - Open the application in your browser
   - You'll be greeted with a welcome message
   - Start typing in the input field at the bottom

2. **Special Features**
   - Use Shift+Enter for multi-line messages
   - Click the theme toggle button to switch between light/dark modes
   - Use the export button to save your conversation
   - Clear chat history with the new chat button

3. **Code Sharing**
   - The bot supports code formatting
   - Code blocks are automatically syntax-highlighted
   - Multiple programming languages are supported

## 🎨 Customization

### Themes
The application supports both light and dark themes. You can modify the theme colors in `static/style.css`:
