import { useState } from 'react';

const ChatToggleButton = ({ 
  onToggle, 
  className = '',
  size = 'medium' 
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isChatOpen;
    setIsChatOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const sizeClasses = {
    small: 'w-12 h-12 text-sm',
    medium: 'w-14 h-14 text-base',
    large: 'w-16 h-16 text-lg'
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        fixed bottom-6 right-6 
        ${sizeClasses[size]}
        bg-blue-600 hover:bg-blue-700 
        text-white rounded-full 
        shadow-lg hover:shadow-xl 
        transition-all duration-300 ease-in-out
        flex items-center justify-center
        z-50
        ${isChatOpen ? 'rotate-45' : 'rotate-0'}
        ${className}
      `}
      aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
      title={isChatOpen ? 'Close chat' : 'Open chat'}
    >
      {isChatOpen ? (
        // Close icon (X)
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      ) : (
        // Chat icon
        <svg 
          className="w-6 h-6" 
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
      )}
    </button>
  );
};

export default ChatToggleButton;