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
    // Önce localStorage'dan token'ı dene
    let token = localStorage.getItem('token');
    
    // Eğer localStorage'da yoksa, Redux store'dan al
    if (!token && window.store) {
      const authState = window.store.getState().auth;
      if (authState.token) {
        token = authState.token;
        // localStorage'a da kaydet
        localStorage.setItem('token', token);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data
    });
    
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
    console.log('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      message: error.message
    });
    
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
