import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('coffee-chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
        
        // Count unread admin messages
        const unread = parsedMessages.filter(msg => 
          msg.sender === 'admin' && !msg.read
        ).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error loading chat messages:', error);
      }
    } else {
      // Welcome message from admin
      const welcomeMessage = {
        id: 1,
        text: "مرحباً! كيف يمكنني مساعدتك اليوم؟ / Hello! How can I help you today?",
        sender: 'admin',
        timestamp: new Date().toISOString(),
        read: false
      };
      setMessages([welcomeMessage]);
      setUnreadCount(1);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('coffee-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  const addMessage = (text, sender = 'user') => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date().toISOString(),
      read: sender === 'user' || isOpen
    };

    setMessages(prev => [...prev, newMessage]);

    // Increment unread count for admin messages
    if (sender === 'admin' && !isOpen) {
      setUnreadCount(prev => prev + 1);
    }

    // Auto-respond as admin for demo purposes
    if (sender === 'user') {
      simulateAdminResponse(text);
    }
  };

  const simulateAdminResponse = (userMessage) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      // Simple auto-responses based on keywords
      let response = getAutoResponse(userMessage);
      
      const adminMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'admin',
        timestamp: new Date().toISOString(),
        read: isOpen
      };

      setMessages(prev => [...prev, adminMessage]);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
  };

  const getAutoResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Arabic and English auto-responses
    if (lowerMessage.includes('price') || lowerMessage.includes('سعر') || lowerMessage.includes('تكلفة')) {
      return 'أسعارنا تبدأ من 15 ريال للقهوة العادية. يمكنك مراجعة القائمة الكاملة في صفحة المنيو. / Our prices start from 15 SAR for regular coffee. You can check the full menu on our Menu page.';
    }
    
    if (lowerMessage.includes('delivery') || lowerMessage.includes('توصيل')) {
      return 'نوفر خدمة التوصيل خلال 30-45 دقيقة. التوصيل مجاني للطلبات أكثر من 50 ريال. / We provide delivery within 30-45 minutes. Free delivery for orders over 50 SAR.';
    }
    
    if (lowerMessage.includes('menu') || lowerMessage.includes('قائمة') || lowerMessage.includes('منيو')) {
      return 'يمكنك مراجعة قائمة القهوة والمشروبات الكاملة في صفحة المنيو. لدينا أكثر من 10 أنواع مختلفة! / You can check our complete coffee and drinks menu on the Menu page. We have over 10 different varieties!';
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('موقع') || lowerMessage.includes('عنوان')) {
      return 'نحن موجودون في عدة مواقع بالمملكة. يمكنك مراجعة صفحة اتصل بنا للعناوين الكاملة. / We have multiple locations across Saudi Arabia. Check our Contact page for complete addresses.';
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('شكر')) {
      return 'العفو! نحن هنا لخدمتك دائماً ☕ / You\'re welcome! We\'re always here to serve you ☕';
    }
    
    if (lowerMessage.includes('arabic') || lowerMessage.includes('عربي')) {
      return 'نعم، لدينا القهوة العربية التقليدية بالهيل والزعفران. طعم أصيل ومميز! / Yes, we have traditional Arabic coffee with cardamom and saffron. Authentic and distinctive taste!';
    }

    if (lowerMessage.includes('order') || lowerMessage.includes('طلب')) {
      return 'يمكنك الطلب مباشرة من موقعنا أو زيارة أحد فروعنا. هل تحتاج مساعدة في الطلب؟ / You can order directly from our website or visit one of our branches. Do you need help with ordering?';
    }
    
    // Default responses
    const defaultResponses = [
      'شكراً لتواصلك معنا! كيف يمكنني مساعدتك أكثر؟ / Thank you for contacting us! How can I help you further?',
      'أقدر استفسارك. هل يمكنك توضيح أكثر حتى أتمكن من مساعدتك بشكل أفضل؟ / I appreciate your inquiry. Can you clarify more so I can help you better?',
      'نحن هنا لخدمتك! إذا كان لديك أي استفسار آخر، لا تتردد في السؤال. / We\'re here to serve you! If you have any other questions, don\'t hesitate to ask.',
      'ممتاز! هل تحتاج لمعلومات إضافية عن قائمة القهوة أو خدماتنا؟ / Excellent! Do you need additional information about our coffee menu or services?'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const openChat = () => {
    setIsOpen(true);
    markAllAsRead();
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    setMessages(prev => 
      prev.map(msg => ({ ...msg, read: true }))
    );
    setUnreadCount(0);
  };

  const clearChat = () => {
    setMessages([]);
    setUnreadCount(0);
    localStorage.removeItem('coffee-chat-messages');
  };

  const value = {
    isOpen,
    messages,
    isTyping,
    unreadCount,
    addMessage,
    openChat,
    closeChat,
    clearChat,
    markAllAsRead
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 