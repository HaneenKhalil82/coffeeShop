import React from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useRTL } from '../App';

const ChatButton = () => {
  const { openChat, unreadCount } = useChat();
  const { isAuthenticated } = useAuth();
  const { showWarning } = useToast();
  const { isArabic } = useRTL();

  const handleChatClick = () => {
    if (!isAuthenticated) {
      // Show toast notification for unauthenticated users
      const message = isArabic 
        ? 'يجب تسجيل الدخول أولاً للدردشة مع الإدارة'
        : 'Please login first to chat with admin';
      
      showWarning(message, 5000);
      return;
    }
    
    // Open chat for authenticated users
    openChat();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleChatClick}
        className={`group relative ${
          isAuthenticated 
            ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 animate-pulse hover:animate-none' 
            : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
        } text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 ${
          isAuthenticated ? 'focus:ring-amber-300' : 'focus:ring-gray-300'
        }`}
        aria-label={isAuthenticated ? "Open chat" : "Login to chat"}
      >
        {/* Chat Icon */}
        {isAuthenticated ? (
          <svg 
            className="w-8 h-8 transition-transform group-hover:scale-110" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
        ) : (
          <div className="relative">
            <svg 
              className="w-8 h-8 transition-transform group-hover:scale-110 opacity-60" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            <svg 
              className="w-4 h-4 absolute top-0 right-0 bg-gray-800 rounded-full p-0.5" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.5rem] h-6 flex items-center justify-center px-1 animate-bounce">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
        
        {/* Pulse Ring - Only for authenticated users */}
        {isAuthenticated && (
          <div className="absolute inset-0 rounded-full bg-amber-600 opacity-20 animate-ping"></div>
        )}
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap">
          <div className="text-center">
            {isAuthenticated ? (
              <>
                <div>💬 دردشة مع الإدارة</div>
                <div className="text-xs opacity-75">Chat with Admin</div>
              </>
            ) : (
              <>
                <div>🔒 سجل دخولك أولاً</div>
                <div className="text-xs opacity-75">Login to Chat</div>
              </>
            )}
          </div>
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatButton; 