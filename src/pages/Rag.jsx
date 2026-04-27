// import React, { useState, useRef, useEffect } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkMath from 'remark-math';
// import rehypeKatex from 'rehype-katex';
// import remarkGfm from 'remark-gfm';
// import ProjectTreeView from '../components/ProjectTreeView'; // Your tree component

// const API_URL = import.meta.env.VITE_LOCAL_API_URL + "/ask";

// // --- Smart component to render text, images, and Markdown ---
// const MessageContent = ({ text, imageUrls = [] }) => {
//   const imageUrlMap = imageUrls.reduce((map, url) => {
//     const filename = url.split('/').pop();
//     map[filename] = url;
//     return map;
//   }, {});

//   return (
//     <div className="prose prose-invert prose-p:my-2 prose-headings:my-4 max-w-full">
//       <ReactMarkdown
//         remarkPlugins={[remarkMath, remarkGfm]}
//         rehypePlugins={[rehypeKatex]}
//         components={{
//           img: ({ node, ...props }) => {
//             const filename = props.src.split('/').pop();
//             if (imageUrlMap[filename]) {
//               return (
//                 <img
//                   src={imageUrlMap[filename]}
//                   alt={props.alt || filename}
//                   className="max-w-full h-auto rounded-lg my-4 border border-white/20"
//                 />
//               );
//             }
//             return null;
//           },
//         }}
//       >
//         {text}
//       </ReactMarkdown>
//     </div>
//   );
// };

// // --- Main RAG Page Component ---
// const Rag = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     localStorage.setItem('hasVisitedRag', 'true');
//     const savedMessages = localStorage.getItem('ragChatHistory');
//     const initialMessage = localStorage.getItem('initialMessage');

//     if (savedMessages && JSON.parse(savedMessages).length > 0) {
//       setMessages(JSON.parse(savedMessages));
//     } else if (initialMessage) {
//       handleSendMessage(initialMessage);
//       localStorage.removeItem('initialMessage');
//     }
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   useEffect(() => {
//     if (messages.length > 0) {
//       localStorage.setItem('ragChatHistory', JSON.stringify(messages));
//     }
//   }, [messages]);

//   const handleSendMessage = async (messageText = inputText) => {
//     const trimmedText = messageText.trim();
//     if (!trimmedText || isLoading) return;

//     const userMessage = { id: Date.now(), type: 'user', content: trimmedText };

//     // Get the last 6 messages to use as chat history context
//     const recentMessages = [...messages, userMessage].slice(-6).map((msg) => ({
//       type: msg.type,
//       content: msg.content,
//     }));

//     setMessages((prev) => [...prev, userMessage]);
//     setInputText('');
//     setIsLoading(true);

//     try {
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           question: trimmedText,
//           chat_history: recentMessages,
//           user_id: "frontend-user", // 🔑 pass user_id (can replace with auth later)
//         }),
//       });

//       if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

//       const data = await response.json();

//       const assistantMessage = {
//         id: Date.now() + 1,
//         type: 'assistant',
//         responseType: data.type, // 'tree' or 'text'
//         content: data.answer || data.data,
//         imageUrls: data.images || [],
//         topic: data.topic,
//       };
//       setMessages((prev) => [...prev, assistantMessage]);
//       // const assistantMessage = {
//       //   id: Date.now() + 1,
//       //   type: 'assistant',
//       //   responseType: 'text', // Hardcode to 'text' for this test

//       //   // --- TEMPORARY TEST VALUES ---
//       //   content: "Here is the SIREN loss curve after 10,000 epochs:\n\n![SIREN Loss Curve](siren_loss_curve_after_10k_epochs.png)",
//       //   imageUrls: ['http://127.0.0.1:8000/images/siren_loss_curve_after_10k_epochs.png'],
//       //   // -----------------------------

//       //   topic: data.topic,
//       // };
//       // setMessages((prev) => [...prev, assistantMessage]);
//     } catch (error) {
//       console.error('Error fetching from API:', error);
//       const errorMessage = {
//         id: Date.now() + 1,
//         type: 'assistant',
//         content:
//           "Sorry, I'm having trouble connecting. Please make sure the backend server is running.",
//         responseType: 'text',
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleSendMessage();
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   // --- NEW: Clear Chat Handler ---
//   const handleClearChat = () => {
//     setMessages([]);
//     localStorage.removeItem('ragChatHistory');
//   };

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col">
//       <div className="rag-chat-container h-screen pt-32 sm:pt-28 pb-6 flex flex-col">
//         <div className="flex-1 overflow-y-auto mb-4">
//           <div className="max-w-5xl mx-auto px-4 space-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex mb-4 ${
//                   message.type === 'user' ? 'justify-end' : 'justify-start'
//                 }`}
//               >
//                 <div
//                   className={`max-w-[90%] rounded-2xl text-base leading-relaxed 
//                   ${
//                     message.type === 'user'
//                       ? 'bg-blue-600 text-white p-4'
//                       : 'bg-white/10 text-white border border-white/20'
//                   }
//                   ${message.responseType === 'tree' ? 'h-[450px] w-full' : 'p-4'} 
//                 `}
//                 >
//                   {message.type === 'user' ? (
//                     <p className="whitespace-pre-wrap">{message.content}</p>
//                   ) : message.responseType === 'tree' ? (
//                     <ProjectTreeView data={message.content} />
//                   ) : (
//                     <MessageContent
//                       text={message.content}
//                       imageUrls={message.imageUrls}
//                     />
//                   )}
//                 </div>
//               </div>
//             ))}

//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
//                   <div className="flex space-x-1">
//                     <div
//                       className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
//                       style={{ animationDelay: '0.1s' }}
//                     ></div>
//                     <div
//                       className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
//                       style={{ animationDelay: '0.2s' }}
//                     ></div>
//                     <div
//                       className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
//                       style={{ animationDelay: '0.3s' }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>

//         {/* --- Input + Clear Button --- */}
//         <div className="max-w-5xl mx-auto w-full px-4">
//           <div className="border-t border-white/10 pt-4 flex justify-between items-center">
//             <div className="flex-1">
//               <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
//                 <div className="flex items-end gap-2 p-3">
//                   <div className="flex-1">
//                     <textarea
//                       value={inputText}
//                       onChange={(e) => {
//                         setInputText(e.target.value);
//                         e.target.style.height = 'auto';
//                         e.target.style.height = `${Math.min(
//                           e.target.scrollHeight,
//                           120
//                         )}px`;
//                       }}
//                       onKeyPress={handleKeyPress}
//                       placeholder="Type your message here..."
//                       className="w-full bg-transparent text-white placeholder-white/60 text-base border-none outline-none resize-none min-h-[40px] max-h-[120px] py-2"
//                       style={{ fontFamily: 'inherit' }}
//                       rows="1"
//                     />
//                   </div>
//                   <button
//                     onClick={handleSubmit}
//                     disabled={!inputText.trim() || isLoading}
//                     className="send-button bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg p-2.5 flex items-center justify-center shrink-0"
//                   >
//                     <svg
//                       width="20"
//                       height="20"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="text-white"
//                     >
//                       <path d="M22 2L11 13" />
//                       <path d="M22 2L15 22L11 13L2 9L22 2Z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={handleClearChat}
//               className="ml-4 bg-red-600 hover:bg-red-700 transition-colors duration-200 rounded-lg px-4 py-2 text-sm font-medium"
//             >
//               Clear Chat
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

// Point this to your FastAPI backend
const VIDEO_API_URL = import.meta.env.VITE_VIDEO_API_URL || "http://localhost:8000";

// --- Twitter-style Progress Circle Component ---
const CharacterProgress = ({ currentLength, maxLength }) => {
  const percentage = currentLength / maxLength;
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate how much of the circle should be filled
  const strokeDashoffset = circumference - Math.min(percentage, 1) * circumference;
  
  let strokeColor = "text-blue-500";
  let showCount = false;

  if (currentLength > maxLength) {
    strokeColor = "text-red-500";
    showCount = true;
  } else if (currentLength > maxLength * 0.8) {
    strokeColor = "text-yellow-500";
    showCount = true; 
  }

  const charsLeft = maxLength - currentLength;

  return (
    <div className="flex items-center gap-2 mr-2 select-none">
      {showCount && (
        <span className={`text-xs font-medium ${currentLength > maxLength ? 'text-red-500' : 'text-yellow-500'}`}>
          {charsLeft}
        </span>
      )}
      <div className="relative w-6 h-6 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 24 24">
          <circle
            className="text-white/10 stroke-current"
            strokeWidth="2.5"
            cx="12"
            cy="12"
            r={radius}
            fill="transparent"
          />
          <circle
            className={`${strokeColor} stroke-current transition-all duration-200 ease-out`}
            strokeWidth="2.5"
            strokeLinecap="round"
            cx="12"
            cy="12"
            r={radius}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
      </div>
    </div>
  );
};

// --- Smart component to render text, images, and Markdown ---
const MessageContent = ({ text }) => {
  return (
    <div className="prose prose-invert prose-p:my-2 prose-headings:my-4 max-w-full">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

// --- Custom Component for Video Progress and Download ---
const VideoJobContent = ({ job }) => {
  const [isDownloadReady, setIsDownloadReady] = useState(false);

  // NEW BLOCK: Handle the 5-second S3 upload delay
  useEffect(() => {
    if ((job.status === 'completed' || job.status === 'success') && !isDownloadReady) {
      const timer = setTimeout(() => {
        setIsDownloadReady(true);
      }, 5000); // 5 second delay
      return () => clearTimeout(timer);
    }
  }, [job.status, isDownloadReady]);

  if (job.status === 'failed' || job.status === 'error') {
    return (
      <div className="flex flex-col gap-2 text-red-400">
        <p>❌ Video generation failed.</p>
        <p className="text-sm opacity-80">{job.systemMessage}</p>
      </div>
    );
  }

  // Render when completed
  if (job.status === 'completed' || job.status === 'success') {
    // If we are still in the 5 second waiting period, show a finalizing state
    if (!isDownloadReady) {
      return (
        <div className="flex flex-col gap-3 w-full sm:w-80">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-blue-300 animate-pulse">
              Finalizing secure download link...
            </span>
            <span className="text-white/80">99%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-blue-400 h-2.5 rounded-full transition-all duration-500 ease-out animate-pulse"
              style={{ width: `99%` }}
            ></div>
          </div>
          <p className="text-xs text-white/50">
            Mode: <span className="uppercase">{job.mode}</span> | Job ID: {job.job_id}
          </p>
        </div>
      );
    }

    // After 5 seconds, show the actual download button
    const downloadUrl = `${VIDEO_API_URL}/api/jobs/${job.job_id}/download/video`;
    return (
      <div className="flex flex-col gap-4">
        <p className="text-green-400 font-medium">✨ Your Karaoke video is ready!</p>
        <a 
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors shadow-lg flex justify-center items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download Video
        </a>
      </div>
    );
  }

  // Loading/Processing State
  const progress = job.progress || 0;
  return (
    <div className="flex flex-col gap-3 w-full sm:w-80">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-blue-300 animate-pulse">
          {job.systemMessage || "Initializing video rendering..."}
        </span>
        <span className="text-white/80">{progress}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-white/50">
        Mode: <span className="uppercase">{job.mode}</span> | Job ID: {job.job_id}
      </p>
    </div>
  );
};

// --- Main RAG Page Component ---
const Rag = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReelsMode, setIsReelsMode] = useState(true); 

  const messagesEndRef = useRef(null);
  const pollingIntervals = useRef({});

  // --- CONFIG: Max characters for ~30 seconds of video ---
  const MAX_CHARS = 400;

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      Object.values(pollingIntervals.current).forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('hasVisitedRag', 'true');
    const savedMessages = localStorage.getItem('videoChatHistory');
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
      localStorage.setItem('videoChatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // --- Polling Logic ---
  const startPolling = (jobId, messageId) => {
    if (pollingIntervals.current[jobId]) {
      clearInterval(pollingIntervals.current[jobId]);
    }

    pollingIntervals.current[jobId] = setInterval(async () => {
      try {
        const response = await fetch(`${VIDEO_API_URL}/api/jobs/${jobId}`);
        if (!response.ok) throw new Error('Failed to fetch status');
        
        const data = await response.json();
        const currentStatus = data.status.toLowerCase();
        
        setMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              status: currentStatus,
              progress: data.progress || msg.progress,
              systemMessage: data.message || msg.systemMessage
            };
          }
          return msg;
        }));

        if (currentStatus === 'completed' || currentStatus === 'success' || currentStatus === 'failed' || currentStatus === 'error') {
          clearInterval(pollingIntervals.current[jobId]);
          delete pollingIntervals.current[jobId];
        }

      } catch (error) {
        console.error('Polling error:', error);
        clearInterval(pollingIntervals.current[jobId]);
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status: 'error', systemMessage: 'Lost connection to server.' } : msg
        ));
      }
    }, 2000);
  };

  const handleSendMessage = async (messageText = inputText) => {
    const trimmedText = messageText.trim();
    if (!trimmedText || isLoading || trimmedText.length > MAX_CHARS) return;

    const selectedMode = isReelsMode ? 'reels' : 'standard';

    const userMessage = { id: Date.now(), type: 'user', content: trimmedText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('text', trimmedText);
      formData.append('mode', selectedMode);

      const response = await fetch(`${VIDEO_API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

      const data = await response.json();
      const jobId = data.job_id;

      const messageId = Date.now() + 1;
      const assistantMessage = {
        id: messageId,
        type: 'assistant',
        responseType: 'video_job',
        job_id: jobId,
        status: data.status,
        progress: 0,
        mode: selectedMode,
        systemMessage: data.message || "Job queued...",
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      startPolling(jobId, messageId);

    } catch (error) {
      console.error('Error fetching from API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "Sorry, I couldn't connect to the video rendering server. Please make sure Docker is running.",
        responseType: 'text',
      };
      setMessages((prev) => [...prev, errorMessage]);
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

  const handleClearChat = () => {
    Object.values(pollingIntervals.current).forEach(clearInterval);
    pollingIntervals.current = {};
    setMessages([]);
    localStorage.removeItem('videoChatHistory');
  };

  const isSendDisabled = !inputText.trim() || isLoading || inputText.length > MAX_CHARS;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="rag-chat-container h-screen pt-32 sm:pt-28 pb-6 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar">
          <div className="max-w-5xl mx-auto px-4 space-y-4">
            
            {messages.length === 0 && (
              <div className="text-center mt-20 opacity-60">
                <h2 className="text-2xl font-bold mb-2 text-white">Karaoke Video Engine</h2>
                <p>Send me some lyrics or text, and I'll generate a video for you.</p>
                <p className="text-xs mt-2 opacity-50">Limit: ~30 seconds of audio ({MAX_CHARS} characters)</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl text-base leading-relaxed 
                  ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white p-4 shadow-md'
                      : 'bg-white/10 text-white border border-white/20 p-5 shadow-lg backdrop-blur-sm'
                  }`}
                >
                  {message.type === 'user' ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : message.responseType === 'video_job' ? (
                    <VideoJobContent job={message} />
                  ) : (
                    <MessageContent text={message.content} />
                  )}
                </div>
              </div>
            ))}

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

        {/* --- Input + Controls Area --- */}
        <div className="max-w-5xl mx-auto w-full px-4">
          <div className="border-t border-white/10 pt-4 flex justify-between items-end">
            
            <div className="flex-1">
              <div className={`bg-white/10 backdrop-blur-md border rounded-xl p-3 transition-colors flex flex-col gap-2 
                ${inputText.length > MAX_CHARS ? 'border-red-500/50' : 'border-white/20 focus-within:border-blue-500/50'}`}>
                
                <div className="flex items-center px-1">
                  <label className="flex items-center gap-2 text-xs font-medium text-white/70 hover:text-white transition-colors cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isReelsMode}
                      onChange={(e) => setIsReelsMode(e.target.checked)}
                      className="w-4 h-4 rounded border-white/30 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                    />
                    Reels / Shorts Format (Vertical)
                  </label>
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <textarea
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Generate karaoke video..."
                      className="w-full bg-transparent text-white placeholder-white/60 text-base border-none outline-none resize-none min-h-[40px] max-h-[120px] py-2"
                      style={{ fontFamily: 'inherit' }}
                      rows="1"
                    />
                  </div>
                  
                  {inputText.length > 0 && (
                    <CharacterProgress currentLength={inputText.length} maxLength={MAX_CHARS} />
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={isSendDisabled}
                    className="send-button bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg p-2.5 flex items-center justify-center shrink-0"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="ml-4 mb-2 bg-red-600/80 hover:bg-red-700 transition-colors duration-200 rounded-lg px-4 py-3 text-sm font-medium border border-red-500/30 shrink-0"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rag;