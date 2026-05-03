import api from './api.js';

const chatApi = {
  createConversation: (bookId, sellerId) => api.post(`/chat/conversation/${bookId}/${sellerId}`),
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId) => api.get(`/chat/messages/${conversationId}`),
  sendMessage: (conversationId, content) => api.post(`/chat/messages/${conversationId}`, { content }),
};

export default chatApi;