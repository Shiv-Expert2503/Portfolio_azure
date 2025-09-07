import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import ProjectTreeView from '../components/ProjectTreeView'; // Your tree component

const API_URL = import.meta.env.VITE_LOCAL_API_URL + "/ask";

// --- Smart component to render text, images, and Markdown ---
const MessageContent = ({ text, imageUrls = [] }) => {
  const imageUrlMap = imageUrls.reduce((map, url) => {
    const filename = url.split('/').pop();
    map[filename] = url;
    return map;
  }, {});

  return (
    <div className="prose prose-invert prose-p:my-2 prose-headings:my-4 max-w-full">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          img: ({node, ...props}) => {
            const filename = props.src.split('/').pop();
            if (imageUrlMap[filename]) {
              return <img src={imageUrlMap[filename]} alt={props.alt || filename} className="max-w-full h-auto rounded-lg my-4 border border-white/20" />;
            }
            return null;
          }
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};


// --- Main RAG Page Component ---
const Rag = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    localStorage.setItem('hasVisitedRag', 'true');
    const savedMessages = localStorage.getItem('ragChatHistory');
    const initialMessage = localStorage.getItem('initialMessage');

    if (savedMessages && JSON.parse(savedMessages).length > 0) {
      setMessages(JSON.parse(savedMessages));
    } else if (initialMessage) {
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
    const trimmedText = messageText.trim();
    if (!trimmedText || isLoading) return;

    const userMessage = { id: Date.now(), type: 'user', content: trimmedText };
    
    // Get the last 6 messages to use as chat history context
    const recentMessages = [...messages, userMessage].slice(-6).map(msg => ({
        type: msg.type,
        content: msg.content
    }));

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            question: trimmedText,
            chat_history: recentMessages 
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      
      const data = await response.json();
      
      // The API now returns a structured response with a 'type'
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        responseType: data.type, // 'tree' or 'text'
        content: data.answer || data.data, // content is either the text 'answer' or the JSON 'data' for the tree
        imageUrls: data.images || [],
        topic: data.topic
      };
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error("Error fetching from API:", error);
      const errorMessage = { id: Date.now() + 1, type: 'assistant', content: "Sorry, I'm having trouble connecting. Please make sure the backend server is running.", responseType: 'text' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSendMessage = async (messageText = inputText) => {
  //   const trimmedText = messageText.trim();
  //   if (!trimmedText || isLoading) return;

  //   const userMessage = { id: Date.now(), type: 'user', content: trimmedText };
  //   setMessages(prev => [...prev, userMessage]);
  //   setInputText('');
  //   setIsLoading(true);

  //   // --- 1. THIS IS YOUR HARDCODED JSON DATA FOR TESTING ---
  //   const hardcodedTreeData = {
  //     "root_node": "SIREN Image Reconstruction",
  //     "child_nodes": [
  //       { "title": "Definition", "summary": "A PyTorch-based Streamlit application using a SIREN (Sinusoidal Representation Networks) model to reconstruct and manipulate images, demonstrating capabilities in grayscale/color image reconstruction, super-resolution, and compression analysis." },
  //       { "title": "Problem Solved", "summary": "Reconstructs images from learned neural weights, offering super-resolution capabilities, and allowing for comparison of model size to standard image compression techniques." },
  //       { "title": "Tech Stack", "summary": "PyTorch, Streamlit, Sinusoidal activation functions, custom weight initialization." },
  //       { "title": "Key Visuals", "summary": "siren_model_architecture_diagram.png, siren_loss_curve_after_10k_epochs.png, and a live Streamlit Cloud demo." }
  //     ],
  //     "follow_up_question": "Which of these topics would you like me to explain in more detail?"
  //   };
  //   // -----------------------------------------------------------

  //   // --- 2. WE SIMULATE A FAKE API RESPONSE ---
  //   // This will now run instead of the real fetch call
  //   setTimeout(() => {
  //     const assistantMessage = {
  //         id: Date.now() + 1,
  //         type: 'assistant',
  //         responseType: 'tree', // We are testing the 'tree' type
  //         content: hardcodedTreeData, // Use the hardcoded data
  //         imageUrls: [],
  //         topic: "SIRENs Project"
  //     };
  //     setMessages(prev => [...prev, assistantMessage]);
  //     setIsLoading(false);
  //   }, 1000); // Simulate a 1-second network delay
  //   // ---------------------------------------------
  // };
  
  const handleSubmit = (e) => { e.preventDefault(); handleSendMessage(); };
  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="rag-chat-container h-screen pt-32 sm:pt-28 pb-6 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="max-w-5xl mx-auto px-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                
                {/* --- THIS IS THE CRITICAL FIX --- */}
                {/* We conditionally set the height of the chat bubble */}
                <div className={`max-w-[90%] rounded-2xl text-base leading-relaxed 
                  ${message.type === 'user' ? 'bg-blue-600 text-white p-4' : 'bg-white/10 text-white border border-white/20'}
                  ${message.responseType === 'tree' ? 'h-[450px] w-full' : 'p-4'} 
                `}>
                  { message.type === 'user' ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : message.responseType === 'tree' ? (
                      <ProjectTreeView data={message.content} />
                  ) : (
                      <MessageContent text={message.content} imageUrls={message.imageUrls} />
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (<div className="flex justify-start"><div className="bg-white/10 border border-white/20 rounded-2xl p-4"><div className="flex space-x-1"><div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div><div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div><div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div></div></div></div>)}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="max-w-5xl mx-auto w-full px-4">
          <div className="border-t border-white/10 pt-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
              <div className="flex items-end gap-2 p-3">
                <div className="flex-1">
                  <textarea value={inputText} onChange={(e) => { setInputText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; }} onKeyPress={handleKeyPress} placeholder="Type your message here..." className="w-full bg-transparent text-white placeholder-white/60 text-base border-none outline-none resize-none min-h-[40px] max-h-[120px] py-2" style={{ fontFamily: 'inherit' }} rows="1" />
                </div>
                <button onClick={handleSubmit} disabled={!inputText.trim() || isLoading} className="send-button bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg p-2.5 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
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