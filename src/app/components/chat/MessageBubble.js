// components/chat/MessageBubble.js (Complete)
import { formatDistanceToNow } from 'date-fns';

const MessageBubble = ({ message, isOwnMessage, showAvatar }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwnMessage
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-900 border border-gray-200'
          }`}
        >
          {showAvatar && !isOwnMessage && (
            <p className="text-xs font-medium mb-1 opacity-70">
              {message.sender.username}
            </p>
          )}
          
          <p className="text-sm leading-relaxed">
            {message.content}
          </p>
          
          <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
      
      {showAvatar && !isOwnMessage && (
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm ml-2 order-2">
          {message.sender.avatar || '👤'}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;