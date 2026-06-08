import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_role');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/profile/');
      const userData = response.data;
      setUser(userData);
      // Сохраняем роль в localStorage
      if (userData.role) {
        localStorage.setItem('user_role', userData.role);
        console.log('✅ Role saved to localStorage:', userData.role);
      } else {
        console.warn('⚠️ No role field in user data:', userData);
        // Если роль не пришла, устанавливаем по умолчанию 'client'
        localStorage.setItem('user_role', 'client');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_role');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, {
        username,
        password,
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      await fetchProfile();
      toast.success('Вход выполнен успешно!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка входа');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await axios.post(`${API_URL}/auth/register/`, userData);
      toast.success('Регистрация успешна! Теперь войдите.');
      return true;
    } catch (error) {
      const errorMsg = Object.values(error.response?.data || {}).flat()[0] || 'Ошибка регистрации';
      toast.error(errorMsg);
      return false;
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await axios.post(`${API_URL}/auth/logout/`, { refresh_token: refreshToken });
      } catch (e) {}
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    setUser(null);
    toast.success('Вы вышли из системы');
    window.location.href = '/';
  };

  const updateProfile = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      const response = await axiosInstance.patch('/auth/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(response.data);
      if (response.data.role) {
        localStorage.setItem('user_role', response.data.role);
      }
      toast.success('Профиль обновлён!');
      return true;
    } catch (error) {
      toast.error('Ошибка обновления профиля');
      return false;
    }
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    axiosInstance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};