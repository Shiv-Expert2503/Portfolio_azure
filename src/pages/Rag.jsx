import React, { useState, useRef, useEffect } from 'react';

// --- Helper component to render text with inline image filenames ---
const MessageContent = ({ text }) => {
  const imagePattern = /([a-zA-Z0-9_\-]+\.(?:png|jpg|jpeg))\b/g;
  const parts = text.split(imagePattern);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (part.match(imagePattern)) {
          return (
            <strong key={index} className="text-blue-400 font-semibold">
              {' '}(Image: {part}){' '}
            </strong>
          );
        }
        return part;
      })}
    </p>
  );
};

// --- Main RAG Page Component ---
const Rag = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const API_URL = "http://localhost:8000/ask";

  // Effect for loading initial/saved messages
  useEffect(() => {
    localStorage.setItem('hasVisitedRag', 'true');
    const savedMessages = localStorage.getItem('ragChatHistory');
    const initialMessage = localStorage.getItem('initialMessage');

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else if (initialMessage) {
      handleSendMessage(initialMessage);
      localStorage.removeItem('initialMessage');
    }
  }, []);

  // Effect for auto-scrolling
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Effect for saving chat history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ragChatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Main function to handle sending a message
  const handleSendMessage = async (messageText = inputText) => {
    if (!messageText.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', content: messageText.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: messageText.trim() })
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      
      const data = await response.json();
      const assistantMessage = { id: Date.now() + 1, type: 'assistant', content: data.answer || "Empty response from server." };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Error fetching from API:", error);
      const errorMessage = { id: Date.now() + 1, type: 'assistant', content: "Sorry, I'm having trouble connecting. Is the local Python server running?" };
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

  // --- THIS IS THE CORRECTED JSX STRUCTURE ---
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="rag-chat-container h-screen pt-32 sm:pt-28 pb-6 flex flex-col">
        
        {/* Full-width scrolling container */}
        <div className="flex-1 overflow-y-auto mb-4">
          {/* Inner container to center messages */}
          <div className="max-w-5xl mx-auto px-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-white/60 mt-20">
                <h2 className="text-xl mb-4">Welcome to my AI Assistant!</h2>
                <p>Start a conversation by typing your message below.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-4 rounded-2xl text-base leading-relaxed ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white border border-white/20'}`}>
                    <MessageContent text={message.content} />
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input container, also centered to align with messages */}
        <div className="max-w-5xl mx-auto w-full px-4"> 
          <div className="border-t border-white/10 pt-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
              <div className="flex items-end gap-2 p-3">
                <div className="flex-1">
                  <textarea
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full bg-transparent text-white placeholder-white/60 text-base border-none outline-none resize-none min-h-[40px] max-h-[120px] py-2"
                    style={{ fontFamily: 'inherit' }}
                    rows="1"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!inputText.trim() || isLoading}
                  className="send-button bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg p-2.5 flex items-center justify-center shrink-0"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
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