// components/chat/ChatWindow.js
import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../../../context/ChatContext';
import { useAuth } from '../../../../context/AuthContext';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from '../ui/TypingIndicator';

const ChatWindow = () => {
  const { selectedChat, messages, sendMessage, typingUsers } = useChat();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
      handleTypingStop();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    
    if (e.target.value.length > 0 && !isTyping) {
      setIsTyping(true);
      // Emit typing event here
    } else if (e.target.value.length === 0 && isTyping) {
      setIsTyping(false);
      // Emit stop typing event here
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Emit stop typing event here
    }, 3000);
  };

  const handleTypingStop = () => {
    if (isTyping) {
      setIsTyping(false);
      // Emit stop typing event here
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const getChatDisplayName = () => {
    if (!selectedChat) return '';
    
    if (selectedChat.type === 'group') {
      return selectedChat.name || 'Group Chat';
    }
    
    const otherUser = selectedChat.participants.find(p => p.id !== user.id);
    return otherUser?.username || 'Unknown User';
  };

  const isUserOnline = () => {
    if (!selectedChat || selectedChat.type === 'group') return false;
    
    const otherUser = selectedChat.participants.find(p => p.id !== user.id);
    return otherUser?.isOnline || false;
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-300 text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Welcome to ChatApp
          </h2>
          <p className="text-gray-500">
            Select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                {selectedChat.type === 'group' ? '👥' : '👤'}
              </div>
              {isUserOnline() && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            <div>
              <h2 className="font-semibold text-gray-900">
                {getChatDisplayName()}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedChat.type === 'group' 
                  ? `${selectedChat.participants.length} members`
                  : isUserOnline() ? 'Online' : 'Offline'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-2">👋</div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.sender.id === user.id}
              showAvatar={selectedChat.type === 'group'}
            />
          ))
        )}
        
        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <TypingIndicator typingUsers={typingUsers} />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleTypingStop}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;