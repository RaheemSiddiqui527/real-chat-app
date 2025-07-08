// components/chat/ChatList.js
import { useChat } from '../../../../context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { Users, MessageCircle } from 'lucide-react';

const ChatList = () => {
  const { chats, selectChat, selectedChat, onlineUsers } = useChat();

  const getChatDisplayName = (chat) => {
    if (chat.type === 'group') {
      return chat.name || 'Group Chat';
    }
    const otherUser = chat.participants.find(p => p.id !== chat.participants[0].id);
    return otherUser?.username || 'Unknown User';
  };

  const getChatAvatar = (chat) => {
    if (chat.type === 'group') {
      return '👥';
    }
    const otherUser = chat.participants.find(p => p.id !== chat.participants[0].id);
    return otherUser?.avatar || '👤';
  };

  const isUserOnline = (chat) => {
    if (chat.type === 'group') return false;
    const otherUser = chat.participants.find(p => p.id !== chat.participants[0].id);
    return onlineUsers.has(otherUser?.id);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No chats yet</p>
          <p className="text-sm">Start a new conversation</p>
        </div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => selectChat(chat)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                  {getChatAvatar(chat)}
                </div>
                {isUserOnline(chat) && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {getChatDisplayName(chat)}
                  </h3>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: true })}
                    </span>
                  )}
                </div>
                
                {chat.lastMessage && (
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage.sender.username === 'You' ? 'You: ' : ''}
                    {chat.lastMessage.content}
                  </p>
                )}
                
                {chat.type === 'group' && (
                  <div className="flex items-center mt-1">
                    <Users className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                      {chat.participants.length} members
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;
