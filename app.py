from flask import Flask, render_template, request, jsonify, session
import google.generativeai as genai
from dotenv import load_dotenv
import os
import markdown
import bleach
import time
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'your-secret-key-here')

# Initialize conversation history
def init_conversation():
    return {
        'messages': [],
        'started_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

def format_response(text):
    # Convert markdown to HTML and sanitize
    html = markdown.markdown(text, extensions=['fenced_code', 'tables'])
    allowed_tags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 
                   'ul', 'ol', 'li', 'code', 'pre', 'table', 'thead', 'tbody',
                   'tr', 'th', 'td', 'blockquote', 'br']
    allowed_attributes = {'code': ['class'], 'pre': ['class']}
    clean_html = bleach.clean(html, tags=allowed_tags, attributes=allowed_attributes)
    return clean_html

@app.route('/')
def home():
    if 'conversation' not in session:
        session['conversation'] = init_conversation()
    return render_template('index.html', conversation=session['conversation'])

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    
    if 'conversation' not in session:
        session['conversation'] = init_conversation()
    
    try:
        # Add user message to history
        session['conversation']['messages'].append({
            'role': 'user',
            'content': user_message,
            'timestamp': time.time()
        })

        # Create context from previous messages
        context = "\n".join([
            f"{'Bot' if msg['role'] == 'assistant' else 'User'}: {msg['content']}"
            for msg in session['conversation']['messages'][-5:]  # Last 5 messages for context
        ])

        # Generate response using Gemini
        response = model.generate_content(f"{context}\nUser: {user_message}")
        formatted_response = format_response(response.text)

        # Add bot response to history
        session['conversation']['messages'].append({
            'role': 'assistant',
            'content': response.text,
            'timestamp': time.time()
        })
        session.modified = True

        return jsonify({
            'response': formatted_response,
            'raw_response': response.text
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'response': "I apologize, but I encountered an error. Please try again."
        }), 500

@app.route('/clear', methods=['POST'])
def clear_conversation():
    session['conversation'] = init_conversation()
    return jsonify({'status': 'success'})

@app.route('/export', methods=['GET'])
def export_conversation():
    if 'conversation' not in session:
        return jsonify({'error': 'No conversation found'})
    
    return jsonify(session['conversation'])

if __name__ == '__main__':
    app.run(debug=True) 