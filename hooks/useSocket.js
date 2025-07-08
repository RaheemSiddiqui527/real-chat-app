// hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

export const useSocket = () => {
  const { token, user } = useAuth();
  const { addMessage, updateTypingStatus } = useChat();
  const socketRef = useRef(null);

  useEffect(() => {
    if (token && user) {
      // Initialize socket connection
      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
        auth: {
          token: token
        }
      });

      const socket = socketRef.current;

      // Connection events
      socket.on('connect', () => {
        console.log('Connected to server');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      // Message events
      socket.on('newMessage', (message) => {
        addMessage(message);
      });

      // Typing events
      socket.on('userTyping', (data) => {
        updateTypingStatus(data.userId, data.username, data.isTyping);
      });

      // Cleanup on unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [token, user, addMessage, updateTypingStatus]);

  const sendMessage = (chatId, content) => {
    if (socketRef.current) {
      socketRef.current.emit('sendMessage', {
        chatId,
        content,
        type: 'text'
      });
    }
  };

  const emitTyping = (chatId) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { chatId });
    }
  };

  const emitStopTyping = (chatId) => {
    if (socketRef.current) {
      socketRef.current.emit('stopTyping', { chatId });
    }
  };

  return {
    sendMessage,
    emitTyping,
    emitStopTyping
  };
};