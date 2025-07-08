// components/ui/UserSearch.js
import { useState } from 'react';
import { Search, X, UserPlus } from 'lucide-react';
import { useChat } from '../../../../context/ChatContext';
import { useAuth } from '../../../../context/AuthContext';

const UserSearch = ({ onClose }) => {
  const { chats, createNewChat, selectChat } = useChat();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock users for demonstration
  const mockUsers = [
    { id: '5', username: 'john_doe', avatar: '👨', isOnline: true },
    { id: '6', username: 'jane_smith', avatar: '👩', isOnline: false },
    { id: '7', username: 'mike_wilson', avatar: '👨', isOnline: true },
    { id: '8', username: 'sarah_jones', avatar: '👩', isOnline: false },
  ];

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const results = mockUsers.filter(user => 
        user.username.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setLoading(false);
    }, 500);
  };

  const handleStartChat = (otherUser) => {
    // Check if chat already exists
    const existingChat = chats.find(chat => 
      chat.type === 'private' && 
      chat.participants.some(p => p.id === otherUser.id)
    );
    
    if (existingChat) {
      selectChat(existingChat);
    } else {
      const newChat = createNewChat(otherUser);
      selectChat(newChat);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-96 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Find Users</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p>Searching...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {searchTerm.length < 2 ? (
                <p>Type at least 2 characters to search</p>
              ) : (
                <p>No users found</p>
              )}
            </div>
          ) : (
            searchResults.map((user) => (
              <div
                key={user.id}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                        {user.avatar}
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{user.username}</h3>
                      <p className="text-sm text-gray-500">
                        {user.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleStartChat(user)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;