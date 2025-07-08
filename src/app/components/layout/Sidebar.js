// components/layout/Sidebar.js
import { useState } from 'react';
import { useChat } from '../../../../context/ChatContext';
import { Search, Plus, Users, MessageCircle } from 'lucide-react';
import UserSearch from '../ui/UserSearch';

const Sidebar = () => {
  const { chats, selectChat, selectedChat } = useChat();
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat => {
    const chatName = chat.type === 'group' ? chat.name : 
      chat.participants.find(p => p.id !== chat.participants[0].id)?.username || 'Unknown';
    return chatName.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
    return otherUser?.isOnline || false;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Search and New Chat */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowUserSearch(true)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No chats found</p>
            <p className="text-sm">Start a new conversation</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
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
                        {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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

      {/* User Search Modal */}
      {showUserSearch && (
        <UserSearch onClose={() => setShowUserSearch(false)} />
      )}
    </div>
  );
};

export default Sidebar;