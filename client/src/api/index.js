import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Users
export const browseUsers = (params) => api.get('/users', { params });
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// Skills
export const getUserSkills = (userId) => api.get(`/skills/user/${userId}`);
export const createSkill = (data) => api.post('/skills', data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);

// Swaps
export const getMyRequests = () => api.get('/swaps');
export const sendRequest = (data) => api.post('/swaps', data);
export const respondToRequest = (id, status) => api.put(`/swaps/${id}`, { status });

// Reviews
export const getUserReviews = (userId) => api.get(`/reviews/user/${userId}`);
export const createReview = (data) => api.post('/reviews', data);
