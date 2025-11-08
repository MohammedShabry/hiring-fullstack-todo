import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('[API Timeout] Request timed out');
      error.message = 'Request timed out. Please try again.';
    } else if (error.code === 'ERR_NETWORK') {
      console.error('[API Network Error] Unable to connect to server');
      error.message = 'Unable to connect to server. Please check if the server is running.';
    } else if (error.response) {
      console.error(`[API Error] ${error.response.status} ${error.response.config.url}`, error.response.data);
    } else {
      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * TODO API Service
 * Handles all API calls to the backend
 */
const todoService = {
  /**
   * Get all todos
   * @returns {Promise} Array of todo objects
   */
  getAllTodos: async () => {
    const response = await api.get('/todos');
    return response.data;
  },

  /**
   * Create a new todo
   * @param {Object} todoData - Todo data with title and description
   * @returns {Promise} Created todo object
   */
  createTodo: async (todoData) => {
    const response = await api.post('/todos', todoData);
    return response.data;
  },

  /**
   * Update a todo
   * @param {string} id - Todo ID
   * @param {Object} todoData - Updated todo data
   * @returns {Promise} Updated todo object
   */
  updateTodo: async (id, todoData) => {
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data;
  },

  /**
   * Toggle todo done status
   * @param {string} id - Todo ID
   * @returns {Promise} Updated todo object
   */
  toggleTodoDone: async (id) => {
    const response = await api.patch(`/todos/${id}/done`);
    return response.data;
  },

  /**
   * Delete a todo
   * @param {string} id - Todo ID
   * @returns {Promise} Delete confirmation
   */
  deleteTodo: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },
};

export default todoService;
