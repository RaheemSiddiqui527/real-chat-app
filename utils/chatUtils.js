// utils/chatUtils.js
export const getChatDisplayName = (chat, currentUserId) => {
  if (chat.type === 'group') {
    return chat.name || 'Group Chat';
  }
  
  const otherUser = chat.participants.find(p => p.id !== currentUserId);
  return otherUser?.username || 'Unknown User';
};

export const getChatAvatar = (chat, currentUserId) => {
  if (chat.type === 'group') {
    return '👥';
  }
  
  const otherUser = chat.participants.find(p => p.id !== currentUserId);
  return otherUser?.avatar || '👤';
};

export const sortChatsByLastMessage = (chats) => {
  return chats.sort((a, b) => {
    const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp) : new Date(0);
    const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp) : new Date(0);
    return bTime - aTime;
  });
};

export const generateChatId = (participants) => {
  return participants.sort().join('-');
};