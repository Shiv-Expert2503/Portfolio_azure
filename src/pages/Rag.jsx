import React, { useState, useRef, useEffect } from 'react';

const Rag = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Get the initial message from URL params or localStorage and load existing chat
  useEffect(() => {
    // Mark that user has visited RAG page
    localStorage.setItem('hasVisitedRag', 'true');
    
    // Load existing chat history
    const savedMessages = localStorage.getItem('ragChatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
      return;
    }

    // If no existing chat, check for initial message
    const urlParams = new URLSearchParams(window.location.search);
    const initialMessage = urlParams.get('message') || localStorage.getItem('initialMessage');
    
    if (initialMessage) {
      const newMessages = [
        {
          id: 1,
          type: 'user',
          content: initialMessage,
          timestamp: new Date()
        },
        {
          id: 2,
          type: 'assistant',
          content: 'Hello! This is testing. I received your message and I\'m ready to help you with your questions about AI, ML, or any of my projects.',
          timestamp: new Date()
        }
      ];
      setMessages(newMessages);
      localStorage.setItem('ragChatHistory', JSON.stringify(newMessages));
      // Clear the stored initial message
      localStorage.removeItem('initialMessage');
    }
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ragChatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Hello! This is testing. Thanks for your message. I\'m a dummy response for now, but soon I\'ll be powered by advanced RAG capabilities to help you with AI and ML questions!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Chat Container */}
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-6 flex flex-col h-screen">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
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
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 pt-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
            <div className="flex items-end gap-2 p-3">
              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    // Auto-resize textarea
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
                onClick={handleSendMessage}
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
  );
};

export default Rag;
