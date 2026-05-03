import api from './api.js';

const bookApi = {
  search: params => api.get('/books', { params }),
  getById: id => api.get(`/books/${id}`),
  create: formData => api.post('/books', formData),
};

export default bookApi;
