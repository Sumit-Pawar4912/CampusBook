import api from './api.js';

const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  verifyUser: id => api.patch(`/admin/users/${id}/verify`),
  banUser: id => api.patch(`/admin/users/${id}/ban`),
  unbanUser: id => api.patch(`/admin/users/${id}/unban`),
  getPendingListings: () => api.get('/admin/books/pending'),
  approveListing: id => api.patch(`/admin/books/${id}/approve`),
  rejectListing: id => api.patch(`/admin/books/${id}/reject`),
};

export default adminApi;
