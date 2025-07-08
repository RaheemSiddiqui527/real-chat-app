import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Map());

  // Mock data for demonstration
  useEffect(() => {
    if (user) {
      // Initialize with mock chats
      const mockChats = [
        {
          id: '1',
          type: 'private',
          participants: [
            { id: user.id, username: user.username, avatar: '👤' },
            { id: '2', username: 'Alice', avatar: '👩', isOnline: true }
          ],
          lastMessage: {
            id: '1',
            content: 'Hey there! How are you?',
            sender: { id: '2', username: 'Alice' },
            timestamp: new Date(Date.now() - 300000)
          }
        },
        {
          id: '2',
          type: 'group',
          name: 'Team Discussion',
          participants: [
            { id: user.id, username: user.username, avatar: '👤' },
            { id: '3', username: 'Bob', avatar: '👨', isOnline: true },
            { id: '4', username: 'Carol', avatar: '👩', isOnline: false }
          ],
          lastMessage: {
            id: '2',
            content: 'Meeting at 3 PM today',
            sender: { id: '3', username: 'Bob' },
            timestamp: new Date(Date.now() - 600000)
          }
        }
      ];
      setChats(mockChats);
      setOnlineUsers(new Set(['2', '3']));
    }
  }, [user]);

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const updateTypingStatus = (userId, username, isTyping) => {
    setTypingUsers(prev => {
      const newMap = new Map(prev);
      if (isTyping) {
        newMap.set(userId, username);
      } else {
        newMap.delete(userId);
      }
      return newMap;
    });
  };

  const selectChat = (chat) => {
    setSelectedChat(chat);
    // Load mock messages for selected chat
    const mockMessages = [
      {
        id: '1',
        content: 'Hello! How are you doing?',
        sender: { id: '2', username: 'Alice', avatar: '👩' },
        timestamp: new Date(Date.now() - 3600000),
        chatId: chat.id
      },
      {
        id: '2',
        content: 'I\'m doing great! Thanks for asking.',
        sender: { id: user.id, username: user.username, avatar: '👤' },
        timestamp: new Date(Date.now() - 3500000),
        chatId: chat.id
      },
      {
        id: '3',
        content: 'That\'s wonderful to hear!',
        sender: { id: '2', username: 'Alice', avatar: '👩' },
        timestamp: new Date(Date.now() - 3400000),
        chatId: chat.id
      }
    ];
    setMessages(mockMessages);
  };

  const sendMessage = (content) => {
    if (selectedChat && content.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        content: content.trim(),
        sender: { id: user.id, username: user.username, avatar: '👤' },
        timestamp: new Date(),
        chatId: selectedChat.id
      };
      addMessage(newMessage);
      
      // Update last message in chat
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, lastMessage: newMessage }
          : chat
      ));
    }
  };

  const createNewChat = (otherUser) => {
    const newChat = {
      id: Date.now().toString(),
      type: 'private',
      participants: [
        { id: user.id, username: user.username, avatar: user.avatar },
        { id: otherUser.id, username: otherUser.username, avatar: otherUser.avatar, isOnline: otherUser.isOnline }
      ],
      lastMessage: null
    };
    setChats(prev => [newChat, ...prev]);
    return newChat;
  };

  const value = {
    chats,
    selectedChat,
    messages,
    onlineUsers,
    typingUsers,
    selectChat,
    sendMessage,
    addMessage,
    updateTypingStatus,
    createNewChat,
    setChats
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
