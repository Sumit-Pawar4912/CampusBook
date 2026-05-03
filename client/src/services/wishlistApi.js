import api from './api.js';

const wishlistApi = {
  get: () => api.get('/wishlist'),
  add: bookId => api.post(`/wishlist/${bookId}`),
  remove: bookId => api.delete(`/wishlist/${bookId}`),
};

export default wishlistApi;
