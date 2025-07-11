import axios from "axios";

const API = axios.create({
  baseURL: "https://wallet.b.goit.study/api",
});

export const setAuthToken = (token) => {
  if (token) {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export const clearAuthToken = () => {
  delete API.defaults.headers.common["Authorization"];
};

// Request interceptor - her istekte token kontrolü
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 hatalarını yakala
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz, localStorage'ı temizle
      localStorage.removeItem('token');
      clearAuthToken();
      // Login sayfasına yönlendir
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
