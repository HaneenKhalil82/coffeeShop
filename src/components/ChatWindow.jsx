import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';

const ChatWindow = () => {
  const { 
    isOpen, 
    messages, 
    isTyping, 
    addMessage, 
    closeChat, 
    clearChat 
  } = useChat();
  
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      addMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19A2 2 0 0 0 5 21H11V19H5V3H13V9H21Z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-sm">إدارة المقهى</div>
            <div className="text-xs opacity-90">Coffee Admin</div>
            <div className="flex items-center text-xs opacity-75">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
              متصل الآن / Online
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Clear Chat Button */}
          <button
            onClick={clearChat}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="مسح المحادثة / Clear Chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          
          {/* Close Button */}
          <button
            onClick={closeChat}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="إغلاق / Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-amber-600 text-white ml-2'
                  : 'bg-white text-gray-800 mr-2 shadow-sm border'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.text}
              </div>
              <div
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-amber-100' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl px-4 py-2 mr-2 shadow-sm border">
              <div className="flex items-center space-x-1">
                <div className="text-sm text-gray-600">الإدارة تكتب...</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2 rtl:space-x-reverse">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا... / Type your message..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 transform rotate-180 rtl:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        
        {/* Quick Reply Suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            'السعر؟ / Price?',
            'التوصيل / Delivery',
            'المنيو / Menu',
            'الموقع / Location'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInputMessage(suggestion)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow; 