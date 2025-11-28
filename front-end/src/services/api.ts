/**
 * API client for backend communication
 */

/**
 * IMPORTS
 */
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { supabase } from '@/services/supabase';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {

    // Get current session from Supabase
    const { data } = await supabase.auth.getSession();

    // Session exists: add token to headers
    if (data.session?.access_token) {
      config.headers.Authorization = `Bearer ${data.session.access_token}`;
    }

    // Return config
    return config;
  },

  // Request error handler
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Token expired or invalid: try to refresh
    if (error.response?.status === 401) {
      const { data, error: refreshError } = await supabase.auth.refreshSession();

      // Refresh failed, logout user
      if (refreshError || !data.session) {
        await supabase.auth.signOut();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Retry the original request with new token
      const originalRequest = error.config;
      originalRequest.headers.Authorization = `Bearer ${data.session.access_token}`;
      return apiClient(originalRequest);
    }

    // Other errors: just propagate
    return Promise.reject(error);
  }
);

// API methods
export const api = {

  // Auth endpoints
  auth: {

    /**
     * Register a new user
     * 
     * @param userData - Object containing email, password, name, phone, birthday
     * 
     * @returns Registered user data
     */
    register: async (userData: {
      email: string;
      password: string;
      name: string;
      phone?: string;
      birthday?: string;
    }) => {
      const response = await apiClient.post('/api/auth/register', userData);
      return response.data;
    },


    /**     
     * Create user profile
     * 
     * @param profileData - Object containing supabase_id, email, name, phone, birthday, avatar_url
     * 
     * @returns Created user profile data
     */
    createProfile: async (profileData: {
      supabase_id: string;
      email: string;
      name: string;
      phone?: string;
      birthday?: string;
      avatar_url?: string;
    }) => {
      const response = await apiClient.post('/api/auth/profile', profileData);
      return response.data;
    },


    /**
     * Login a user
     * 
     * @param credentials - Object containing email and password
     * 
     * @returns Logged in user data
     */
    login: async (credentials: { email: string; password: string }) => {
      const response = await apiClient.post('/api/auth/login', credentials);
      return response.data;
    },


    /**     
     * Logout the current user
     * 
     * @returns Logout confirmation
     */
    logout: async () => {
      const response = await apiClient.post('/api/auth/logout');
      return response.data;
    },

    /**     
     * Get current logged in user
     * 
     * @returns Current user data
     */
    getCurrentUser: async () => {
      const response = await apiClient.get('/api/auth/me');
      return response.data;
    },


    /**     
     * Update current user profile
     * 
     * @param updateData - Object containing fields to update: name, phone, birthday, avatar_url, search_preferences, notification_settings
     * 
     * @returns Updated user profile data
     */
    updateProfile: async (updateData: {
      name?: string;
      phone?: string;
      birthday?: string;
      avatar_url?: string;
    }) => {
      const response = await apiClient.put('/api/auth/me', updateData);
      return response.data;
    },


    /**     
     * Delete current user account
     * 
     * @returns Deletion confirmation
     */
    deleteAccount: async () => {
      const response = await apiClient.delete('/api/auth/me');
      return response.data;
    },
  },
};

/**
 * EXPORTS
 */
export default apiClient;
