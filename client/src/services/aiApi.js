import api from './api.js';

const aiApi = {
  checkImage: file => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/ai/image-check', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  ocr: file => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/ai/ocr', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  suggestPrice: payload => api.post('/ai/price', payload),
  trending: () => api.get('/ai/trending'),
};

export default aiApi;
