import React, { useState, useEffect, useRef } from 'react';
import './chat.css';
import { processMedBotQuery } from './medbotEngine';
import moment from 'moment';

const Chat = ({ isFloating = false, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am MedBot 👋\n\nHow can I help you today?',
      time: moment().format('LT')
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: moment().format('LT')
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Simulate natural typing delay
      setTimeout(async () => {
        const replyText = await processMedBotQuery(userText);
        const botMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: replyText,
          time: moment().format('LT')
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 700);
    } catch (err) {
      setIsTyping(false);
    }
  };

  return (
    <div className={isFloating ? 'chat-box-card' : 'chat-container-page'}>
      <div className="chat-box-card">
        <div className="chat-header-bar">
          <div className="chat-header-info">
            <div className="chat-avatar-icon">
              <i className="fa-solid fa-robot"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>MedBot Assistant</h3>
              <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>Online • Medical AI Assistant</span>
            </div>
          </div>
          {isFloating && (
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        <div className="chat-messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
              <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
              <span className="chat-time">{msg.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble bot">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="chat-input-bar">
          <input
            type="text"
            placeholder="Ask MedBot about drugs, stock, expiry, orders..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="chat-send-btn" title="Send message">
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
