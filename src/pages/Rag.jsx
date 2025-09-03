// src/pages/Rag.jsx

import React, { useState, useRef, useEffect } from 'react';
// import os from 'path-browserify'; // We need this to handle image paths

// The URL of your local Python backend API
const API_URL = "http://localhost:8000/ask";
// The base path for your images relative to the Python project
// const IMAGE_BASE_URL = "http://localhost:8000/images/"; // We will set this up in FastAPI

// --- NEW: A helper component to render text with inline images ---
const MessageContent = ({ text }) => {
  // Regex to find image filenames
  const imagePattern = /([a-zA-Z0-9_\-]+\.(?:png|jpg|jpeg))\b/g;
  const parts = text.split(imagePattern);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (part.match(imagePattern)) {
          // In the future, we will get this URL from the API directly.
          // For now, we assume a static path. This part needs a proper setup.
          // Let's just render the filename for now.
          return <strong key={index} className="text-blue-400"> (Image: {part}) </strong>;
        }
        return part;
      })}
    </p>
  );
};


const Rag = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- This useEffect for loading initial/saved messages is perfect. No changes needed. ---
  useEffect(() => {
    localStorage.setItem('hasVisitedRag', 'true');
    const savedMessages = localStorage.getItem('ragChatHistory');
    const initialMessage = localStorage.getItem('initialMessage');

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else if (initialMessage) {
      // If there's an initial message, send it immediately
      handleSendMessage(initialMessage);
      localStorage.removeItem('initialMessage');
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ragChatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (messageText = inputText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText.trim(),
    };

    // Add user message to state immediately
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // --- THIS IS THE REAL API CALL ---
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: messageText.trim() })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.answer || "I received a response, but it was empty.",
      };
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error("Error fetching from API:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "Sorry, I'm having trouble connecting to my brain. Please make sure the local Python server is running.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Full width container for scrollbar */}
      <div className="rag-chat-container h-screen pt-32 sm:pt-28 pb-6 flex flex-col">
        {/* Messages Area - Full width with scrollbar at screen edge */}
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="max-w-2xl mx-auto px-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-white/60 mt-20">
                <h2 className="text-xl mb-4">Welcome to Multimodal RAG!</h2>
                <p>Start a conversation by typing your message below.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] p-5 rounded-2xl text-base leading-relaxed ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    {/* --- THIS IS THE ONLY LINE THAT CHANGED --- */}
                    <MessageContent text={message.content} />
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="max-w-2xl mx-auto px-4">
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (No changes needed here) */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="border-t border-white/10 pt-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
              <div className="flex items-end gap-2 p-3">
                <div className="flex-1">
                  <textarea
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full bg-transparent text-white placeholder-white/60 text-base border-none outline-none resize-none min-h-[40px] max-h-[120px] py-2"
                    style={{ fontFamily: 'inherit' }}
                    rows="1"
                  />
                </div>
                <button
                  onClick={handleSubmit} // Changed this to your handleSubmit wrapper
                  disabled={!inputText.trim() || isLoading}
                  className="send-button bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg p-2.5 flex items-center justify-center shrink-0"
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rag;