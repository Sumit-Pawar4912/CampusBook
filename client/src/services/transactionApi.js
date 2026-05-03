import api from './api.js';

const transactionApi = {
  getMy: () => api.get('/transactions/my'),
  request: (bookId, payload) => api.post(`/transactions/request/${bookId}`, payload),
};

export default transactionApi;
