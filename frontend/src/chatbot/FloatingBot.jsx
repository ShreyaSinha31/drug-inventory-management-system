import React, { useState } from 'react';
import './chat.css';
import Chat from './chat';

export default function FloatingBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="floating-bot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with MedBot AI"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-headset'}`}></i>
      </div>

      {isOpen && (
        <div className="floating-bot-modal">
          <Chat isFloating={true} onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
