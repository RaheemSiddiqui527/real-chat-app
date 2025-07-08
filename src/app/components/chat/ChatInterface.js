// components/chat/ChatInterface.js
import { useAuth } from '../../../../context/AuthContext';
import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';
import ChatWindow from './ChatWindow';

const ChatInterface = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatInterface;