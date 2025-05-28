import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // to allow cookies to be sent
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

// User Services
export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
};

// Task Services
export const taskService = {
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  getAllTasks: async (filters = {}) => {
    const response = await api.get('/tasks', { params: filters });
    return response.data;
  },
  
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default api; 