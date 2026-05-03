import api from './api.js';

const authApi = {
  login: credentials => api.post('/auth/login', credentials),
  register: credentials => api.post('/auth/register', credentials),
  me: () => api.get('/auth/me'),
};

export default authApi;
