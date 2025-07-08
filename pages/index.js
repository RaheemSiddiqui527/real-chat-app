// WhatsApp-Style Multi-User Chat Application
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Simple Auth Context
const useSimpleAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing user
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    if (password === 'password') {
      const userData = {
        id: Date.now().toString(),
        username: email.split('@')[0],
        email: email,
        avatar: getRandomAvatar(),
        phone: '+1 ' + Math.floor(Math.random() * 9000000000 + 1000000000),
        status: 'Available',
        lastSeen: new Date()
      };
      setUser(userData);
      localStorage.setItem('chatUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = (username, email, password) => {
    const userData = {
      id: Date.now().toString(),
      username: username,
      email: email,
      avatar: getRandomAvatar(),
      phone: '+1 ' + Math.floor(Math.random() * 9000000000 + 1000000000),
      status: 'Available',
      lastSeen: new Date()
    };
    setUser(userData);
    localStorage.setItem('chatUser', JSON.stringify(userData));
    return true;
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('chatUser', JSON.stringify(updatedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatUser');
  };

  const getRandomAvatar = () => {
    const avatars = ['👤', '👨', '👩', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨', '👨‍🔬', '👩‍🔬', '👨‍💼', '👩‍💼'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  return { user, isLoading, login, register, logout, updateProfile };
};

// WhatsApp-Style Chat Context
const useWhatsAppChat = (currentUser) => {
  const [messages, setMessages] = useState({});
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());

  // Initialize with mock data
  useEffect(() => {
    if (currentUser) {
      // Mock contacts
      const mockContacts = [
        { 
          id: '2', 
          username: 'Alice Johnson', 
          avatar: '👩', 
          isOnline: true, 
          lastSeen: new Date(),
          phone: '+1 234 567 8901',
          status: 'Hey there! I am using ChatApp'
        },
        { 
          id: '3', 
          username: 'Bob Smith', 
          avatar: '👨', 
          isOnline: true, 
          lastSeen: new Date(),
          phone: '+1 234 567 8902',
          status: 'Busy'
        },
        { 
          id: '4', 
          username: 'Carol Davis', 
          avatar: '👩‍💼', 
          isOnline: false, 
          lastSeen: new Date(Date.now() - 300000),
          phone: '+1 234 567 8903',
          status: 'At work'
        },
        { 
          id: '5', 
          username: 'David Wilson', 
          avatar: '👨‍💻', 
          isOnline: true, 
          lastSeen: new Date(),
          phone: '+1 234 567 8904',
          status: 'Coding...'
        },
        { 
          id: '6', 
          username: 'Emma Brown', 
          avatar: '👩‍🎨', 
          isOnline: false, 
          lastSeen: new Date(Date.now() - 600000),
          phone: '+1 234 567 8905',
          status: 'Creating art'
        },
        { 
          id: '7', 
          username: 'Frank Miller', 
          avatar: '👨‍🔬', 
          isOnline: true, 
          lastSeen: new Date(),
          phone: '+1 234 567 8906',
          status: 'In the lab'
        }
      ];
      
      setContacts(mockContacts);
      setOnlineUsers(new Set(['2', '3', '5', '7']));
      
      // Initialize messages for each contact
      const initialMessages = {};
      mockContacts.forEach(contact => {
        initialMessages[contact.id] = [
          {
            id: '1',
            type: 'text',
            content: `Hi ${currentUser.username}! How are you?`,
            sender: { id: contact.id, username: contact.username, avatar: contact.avatar },
            timestamp: new Date(Date.now() - Math.random() * 86400000),
            status: 'read'
          }
        ];
      });
      setMessages(initialMessages);
    }
  }, [currentUser]);

  const sendMessage = (content, contactId = activeChat?.id) => {
    if (!contactId || !content.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      type: 'text',
      content: content.trim(),
      sender: { id: currentUser.id, username: currentUser.username, avatar: currentUser.avatar },
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMessage]
    }));
    
    // Update message status after a delay
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [contactId]: prev[contactId].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      }));
    }, 1000);
    
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [contactId]: prev[contactId].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      }));
    }, 2000);
    
    // Simulate contact response
    setTimeout(() => {
      const responses = [
        "That's great! 😊",
        "I agree with you!",
        "Tell me more about that",
        "Interesting! 🤔",
        "Thanks for sharing!",
        "Cool! 👍",
        "Nice to hear from you!",
        "How's your day going?",
        "That sounds awesome!",
        "I understand 💭"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const contactMessage = {
        id: (Date.now() + 1).toString(),
        type: 'text',
        content: randomResponse,
        sender: { id: contactId, username: activeChat?.username, avatar: activeChat?.avatar },
        timestamp: new Date(),
        status: 'read'
      };
      
      setMessages(prev => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), contactMessage]
      }));
    }, 2000 + Math.random() * 3000);
  };

  const sendFile = (file, contactId = activeChat?.id) => {
    if (!contactId) return;
    
    const fileUrl = URL.createObjectURL(file);
    const fileType = getFileType(file);
    
    const newMessage = {
      id: Date.now().toString(),
      type: 'file',
      fileType: fileType,
      fileName: file.name,
      fileSize: file.size,
      fileUrl: fileUrl,
      content: `📎 ${file.name}`,
      sender: { id: currentUser.id, username: currentUser.username, avatar: currentUser.avatar },
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMessage]
    }));
    
    // Update status
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [contactId]: prev[contactId].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      }));
    }, 1000);
    
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [contactId]: prev[contactId].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      }));
    }, 2000);
  };

  const selectChat = (contact) => {
    setActiveChat(contact);
  };

  const getLastMessage = (contactId) => {
    const contactMessages = messages[contactId] || [];
    return contactMessages[contactMessages.length - 1];
  };

  const getUnreadCount = (contactId) => {
    const contactMessages = messages[contactId] || [];
    return contactMessages.filter(msg => 
      msg.sender.id !== currentUser.id && msg.status !== 'read'
    ).length;
  };

  const getFileType = (file) => {
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('pdf') || type.includes('document') || type.includes('text') || 
        type.includes('spreadsheet') || type.includes('presentation')) return 'document';
    return 'other';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (date) => {
    const now = new Date();
    const lastSeen = new Date(date);
    const diffMs = now - lastSeen;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'online';
    if (diffMins < 60) return `last seen ${diffMins} minutes ago`;
    if (diffHours < 24) return `last seen ${diffHours} hours ago`;
    if (diffDays === 1) return 'last seen yesterday';
    return `last seen ${diffDays} days ago`;
  };

  return { 
    messages: messages[activeChat?.id] || [], 
    contacts,
    activeChat,
    onlineUsers,
    typingUsers,
    sendMessage, 
    sendFile, 
    selectChat,
    getLastMessage,
    getUnreadCount,
    formatFileSize,
    formatTime,
    formatLastSeen
  };
};

// Login Form Component
const SimpleLoginForm = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin(email, password)) {
      setError('');
    } else {
      setError('Invalid credentials. Use password "password"');
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">💬</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ChatApp</h1>
        <p className="text-gray-600">WhatsApp-style messaging</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            placeholder="Enter password"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Sign In
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Sign up
          </button>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Demo: Use any email and password "password"
        </p>
      </div>
    </div>
  );
};

// Register Form Component
const SimpleRegisterForm = ({ onRegister, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    onRegister(username, email, password);
    setError('');
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">💬</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join ChatApp</h1>
        <p className="text-gray-600">Create your account</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            placeholder="Choose a username"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            placeholder="Create a password"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Create Account
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

// WhatsApp-Style Chat Interface
const WhatsAppChatInterface = ({ user, onLogout, onUpdateProfile }) => {
  const { 
    messages, 
    contacts,
    activeChat,
    onlineUsers,
    sendMessage, 
    sendFile, 
    selectChat,
    getLastMessage,
    getUnreadCount,
    formatFileSize,
    formatTime,
    formatLastSeen
  } = useWhatsAppChat(user);
  
  const [inputValue, setInputValue] = useState('');
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: user.username,
    status: user.status,
    avatar: user.avatar
  });
  
  // Settings state
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('chatSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      darkMode: false,
      notifications: true,
      soundEnabled: true,
      typingIndicators: true,
      readReceipts: true,
      lastSeen: true,
      autoDownload: true,
      enterToSend: true,
      fontSize: 'medium'
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleFileUpload = (files) => {
    Array.from(files).forEach(file => {
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }
      sendFile(file);
    });
    setShowFileOptions(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const triggerFileInput = (accept) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = true;
    input.onchange = (e) => handleFileUpload(e.target.files);
    input.click();
  };

  const handleProfileEdit = () => {
    setEditingProfile(true);
    setProfileForm({
      username: user.username,
      status: user.status,
      avatar: user.avatar
    });
  };

  const handleProfileSave = () => {
    onUpdateProfile(profileForm);
    setEditingProfile(false);
    setShowProfile(false);
  };

  const handleProfileCancel = () => {
    setEditingProfile(false);
    setProfileForm({
      username: user.username,
      status: user.status,
      avatar: user.avatar
    });
  };

  const handleAvatarChange = (newAvatar) => {
    setProfileForm(prev => ({ ...prev, avatar: newAvatar }));
  };

  const availableAvatars = ['👤', '👨', '👩', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨', '👨‍🔬', '👩‍🔬', '👨‍💼', '👩‍💼', '🧑‍🎓', '👨‍🏫', '👩‍🏫', '👨‍⚕️', '👩‍⚕️'];

  // Settings functions
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('chatSettings', JSON.stringify(newSettings));
  };

  const toggleSetting = (key) => {
    updateSetting(key, !settings[key]);
  };

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const getMessageStatus = (message) => {
    if (message.sender.id !== user.id) return null;
    
    switch (message.status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return <span className="text-blue-500">✓✓</span>;
      default:
        return '⏰';
    }
  };

  return (
    <div className={`h-screen flex ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className={`${settings.darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Appearance */}
              <div>
                <h3 className="text-lg font-medium mb-4">Appearance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Switch to dark theme</p>
                    </div>
                    <button
                      onClick={() => toggleSetting('darkMode')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.darkMode ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Font Size</p>
                      <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Adjust text size</p>
                    </div>
                    <select
                      value={settings.fontSize}
                      onChange={(e) => updateSetting('fontSize', e.target.value)}
                      className={`px-3 py-1 rounded border ${
                        settings.darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-lg font-medium mb-4">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Show message notifications</p>
                    </div>
                    <button
                      onClick={() => toggleSetting('notifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sound</p>
                      <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Play notification sounds</p>
                    </div>
                    <button
                      onClick={() => toggleSetting('soundEnabled')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.soundEnabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div>
                <h3 className="text-lg font-medium mb-4">Privacy</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Read Receipts</p>
                      <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Show when messages are read</p>
                    </div>
                    <button
                      onClick={() => toggleSetting('readReceipts')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.readReceipts ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.readReceipts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Last Seen</p>
                      <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Show your last seen time</p>
                    </div>
                    <button
                      onClick={() => toggleSetting('lastSeen')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.lastSeen ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.lastSeen ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Typing Indicators</p>
                      <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Show when you're typing</p>
                    </div>
                    <button
                      onClick={() => toggleSetting('typingIndicators')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.typingIndicators ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.typingIndicators ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat */}
              <div>
                <h3 className="text-lg font-medium mb-4">Chat</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enter to Send</p>
                      <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Press Enter to send messages</p>
                    </div>
                    <button
                      onClick={() => toggleSetting('enterToSend')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.enterToSend ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.enterToSend ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto Download</p>
                      <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Automatically download media</p>
                    </div>
                    <button
                      onClick={() => toggleSetting('autoDownload')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.autoDownload ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.autoDownload ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProfile ? 'Edit Profile' : 'My Profile'}
              </h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {editingProfile ? (
              /* Edit Mode */
              <div className="space-y-6">
                {/* Avatar Selection */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                    {profileForm.avatar}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Choose your avatar:</p>
                  <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                    {availableAvatars.map((avatar, index) => (
                      <button
                        key={index}
                        onClick={() => handleAvatarChange(avatar)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${
                          profileForm.avatar === avatar 
                            ? 'bg-green-100 border-2 border-green-500' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your username"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <input
                    type="text"
                    value={profileForm.status}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your status"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Let your contacts know what you're up to
                  </p>
                </div>

                {/* Phone (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={user.phone}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Phone number cannot be changed
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleProfileCancel}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                    {user.avatar}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{user.username}</h3>
                  <p className="text-gray-600">{user.phone}</p>
                  <p className="text-sm text-gray-500 mt-2">{user.status}</p>
                </div>

                {/* Profile Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">About</h4>
                    <p className="text-gray-600">{user.status}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Phone</h4>
                    <p className="text-gray-600">{user.phone}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleProfileEdit}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowProfile(false)}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Info Modal */}
      {showContactInfo && activeChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                {activeChat.avatar}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{activeChat.username}</h3>
              <p className="text-gray-600">{activeChat.phone}</p>
              <p className="text-sm text-gray-500 mt-2">{activeChat.status}</p>
              <p className="text-sm text-gray-500 mt-1">
                {onlineUsers.has(activeChat.id) ? '🟢 Online' : formatLastSeen(activeChat.lastSeen)}
              </p>
            </div>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <span>📞</span>
                <span>Voice Call</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <span>📹</span>
                <span>Video Call</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowContactInfo(false)}
              className="w-full mt-4 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sidebar - Chat List */}
      <div className={`w-96 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
        {/* Header */}
        <div className={`${settings.darkMode ? 'bg-gray-700' : 'bg-green-600'} text-white p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowProfile(true)}
                className={`w-10 h-10 ${settings.darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-green-500 hover:bg-green-400'} rounded-full flex items-center justify-center transition-colors`}
              >
                {user.avatar}
              </button>
              <h1 className="text-xl font-semibold">ChatApp</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowSettings(true)}
                className={`p-2 ${settings.darkMode ? 'hover:bg-gray-600' : 'hover:bg-green-500'} rounded-full transition-colors`}
                title="Settings"
              >
                ⚙️
              </button>
              <button className={`p-2 ${settings.darkMode ? 'hover:bg-gray-600' : 'hover:bg-green-500'} rounded-full transition-colors`}>
                💬
              </button>
              <button 
                onClick={onLogout}
                className={`p-2 ${settings.darkMode ? 'hover:bg-gray-600' : 'hover:bg-green-500'} rounded-full transition-colors`}
                title="Logout"
              >
                🚪
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className={`p-3 ${settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b`}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search or start new chat"
              className={`w-full pl-10 pr-4 py-2 ${settings.darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${settings.darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              🔍
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => {
            const lastMessage = getLastMessage(contact.id);
            const unreadCount = getUnreadCount(contact.id);
            
            return (
              <div
                key={contact.id}
                onClick={() => selectChat(contact)}
                className={`p-4 ${settings.darkMode ? 'border-gray-700' : 'border-gray-100'} border-b cursor-pointer ${settings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors ${
                  activeChat?.id === contact.id ? (settings.darkMode ? 'bg-gray-700' : 'bg-green-50') : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-12 h-12 ${settings.darkMode ? 'bg-gray-600' : 'bg-gray-100'} rounded-full flex items-center justify-center text-lg`}>
                      {contact.avatar}
                    </div>
                    {onlineUsers.has(contact.id) && (
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 ${settings.darkMode ? 'border-gray-800' : 'border-white'}`}></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium ${settings.darkMode ? 'text-white' : 'text-gray-900'} truncate`}>{contact.username}</h3>
                      {lastMessage && (
                        <span className={`text-xs ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatTime(lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>
                        {lastMessage ? (
                          <>
                            {lastMessage.sender.id === user.id && '✓✓ '}
                            {lastMessage.type === 'file' ? '📎 ' + lastMessage.fileName : lastMessage.content}
                          </>
                        ) : (
                          'No messages yet'
                        )}
                      </p>
                      {unreadCount > 0 && (
                        <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className={`${settings.darkMode ? 'bg-gray-700' : 'bg-green-600'} text-white p-4`}>
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => setShowContactInfo(true)}
                >
                  <div className={`w-10 h-10 ${settings.darkMode ? 'bg-gray-600' : 'bg-green-500'} rounded-full flex items-center justify-center`}>
                    {activeChat.avatar}
                  </div>
                  <div>
                    <h2 className="font-semibold">{activeChat.username}</h2>
                    <p className={`text-sm ${settings.darkMode ? 'text-gray-300' : 'text-green-100'}`}>
                      {onlineUsers.has(activeChat.id) ? 'online' : formatLastSeen(activeChat.lastSeen)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className={`p-2 ${settings.darkMode ? 'hover:bg-gray-600' : 'hover:bg-green-500'} rounded-full transition-colors`}>
                    📞
                  </button>
                  <button className={`p-2 ${settings.darkMode ? 'hover:bg-gray-600' : 'hover:bg-green-500'} rounded-full transition-colors`}>
                    📹
                  </button>
                  <button className={`p-2 ${settings.darkMode ? 'hover:bg-gray-600' : 'hover:bg-green-500'} rounded-full transition-colors`}>
                    ���
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              className={`flex-1 overflow-y-auto p-4 ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-50'} ${dragOver ? (settings.darkMode ? 'bg-gray-800' : 'bg-green-50') : ''}`}
              style={{
                backgroundImage: settings.darkMode 
                  ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {dragOver && (
                <div className="fixed inset-0 bg-green-100 bg-opacity-50 flex items-center justify-center z-10">
                  <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <div className="text-4xl mb-4">📁</div>
                    <p className="text-lg font-medium text-gray-700">Drop files here to share</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender.id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        message.sender.id === user.id
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-900 shadow-sm'
                      }`}
                    >
                      {/* Render different message types */}
                      {message.type === 'text' ? (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      ) : (
                        <div className="space-y-2">
                          {message.fileType === 'image' && (
                            <div>
                              <img 
                                src={message.fileUrl} 
                                alt={message.fileName}
                                className="max-w-full h-auto rounded-lg cursor-pointer"
                                onClick={() => window.open(message.fileUrl, '_blank')}
                              />
                            </div>
                          )}
                          
                          {message.fileType === 'video' && (
                            <div>
                              <video 
                                src={message.fileUrl} 
                                controls 
                                className="max-w-full h-auto rounded-lg"
                                style={{ maxHeight: '200px' }}
                              />
                            </div>
                          )}
                          
                          {message.fileType === 'audio' && (
                            <div>
                              <audio src={message.fileUrl} controls className="w-full" />
                            </div>
                          )}
                          
                          {(message.fileType === 'document' || message.fileType === 'other') && (
                            <div className="flex items-center space-x-3 p-2 bg-gray-100 rounded-lg">
                              <div className="text-2xl">📄</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{message.fileName}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(message.fileSize)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                        message.sender.id === user.id ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {getMessageStatus(message)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t border-gray-200">
              {/* File Upload Options */}
              {showFileOptions && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-4 gap-3">
                    <button
                      onClick={() => triggerFileInput('image/*')}
                      className="flex flex-col items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-2xl mb-1">🖼️</div>
                      <span className="text-xs">Photos</span>
                    </button>
                    <button
                      onClick={() => triggerFileInput('video/*')}
                      className="flex flex-col items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-2xl mb-1">🎬</div>
                      <span className="text-xs">Videos</span>
                    </button>
                    <button
                      onClick={() => triggerFileInput('.pdf,.doc,.docx')}
                      className="flex flex-col items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-2xl mb-1">📄</div>
                      <span className="text-xs">Documents</span>
                    </button>
                    <button
                      onClick={() => triggerFileInput('*')}
                      className="flex flex-col items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-2xl mb-1">📎</div>
                      <span className="text-xs">Files</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Message Input */}
              <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFileOptions(!showFileOptions)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  📎
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message"
                    className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    😊
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  ➤
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-8xl mb-6">💬</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Welcome to ChatApp
              </h2>
              <p className="text-gray-500 mb-4">
                Select a chat to start messaging
              </p>
              <p className="text-sm text-gray-400">
                WhatsApp-style interface for seamless communication
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
export default function ChatApp() {
  const { user, isLoading, login, register, logout, updateProfile } = useSimpleAuth();
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();

  // Handle routing
  useEffect(() => {
    if (router.query.page === 'register') {
      setShowRegister(true);
    } else {
      setShowRegister(false);
    }
  }, [router.query]);

  const handleSwitchToRegister = () => {
    setShowRegister(true);
    router.push('/?page=register', undefined, { shallow: true });
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    router.push('/', undefined, { shallow: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        {showRegister ? (
          <SimpleRegisterForm
            onRegister={register}
            onSwitchToLogin={handleSwitchToLogin}
          />
        ) : (
          <SimpleLoginForm
            onLogin={login}
            onSwitchToRegister={handleSwitchToRegister}
          />
        )}
      </div>
    );
  }

  return <WhatsAppChatInterface user={user} onLogout={logout} onUpdateProfile={updateProfile} />;
}


