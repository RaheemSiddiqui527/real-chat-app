// components/ui/OnlineStatus.js
import { useState, useEffect } from 'react';

const OnlineStatus = ({ isOnline }) => {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    setShowIndicator(isOnline);
  }, [isOnline]);

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-3 h-3 rounded-full transition-colors ${
          showIndicator ? 'bg-green-500' : 'bg-gray-300'
        }`}
      />
      <span className="text-sm text-gray-600">
        {showIndicator ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};

export default OnlineStatus;