import axios from 'axios';

// Use environment-specific API URL
const API_URL = import.meta.env.PROD 
  ? 'http://localhost:5001/api'  // Replace with your actual production backend URL when deployed
  : 'http://localhost:5001/api';

console.log('Using API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // to allow cookies to be sent
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add token if it exists
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('auth_token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },
  
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      // Remove token from localStorage
      localStorage.removeItem('auth_token');
      return response.data;
    } catch (error) {
      // Even if API call fails, remove token
      localStorage.removeItem('auth_token');
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      // Try the /auth/me endpoint first
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // Fall back to /users/profile if /auth/me fails
      try {
        const response = await api.get('/users/profile');
        return response.data;
      } catch (secondError) {
        // If both fail, throw the error and clear token
        if (secondError.response && secondError.response.status === 401) {
          localStorage.removeItem('auth_token');
        }
        throw secondError;
      }
    }
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