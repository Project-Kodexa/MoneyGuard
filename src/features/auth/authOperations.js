import { createAsyncThunk } from '@reduxjs/toolkit';
import API, { setAuthToken, clearAuthToken } from '../../services/api.js';
import { setRefreshing } from './authSlice';

export const registerThunk = createAsyncThunk(
  'auth/sign-up',
  async (userData, thunkAPI) => {
    try {
      const { confirmPassword, name, ...rest } = userData;

      // name -> username dönüştür
      const signupData = {
        ...rest,
        username: name, // ✅ name yerine username gönderiyoruz
      };

      const response = await API.post('/auth/sign-up', signupData);

      const token = response.data.token;
      setAuthToken(token);
      localStorage.setItem('token', token);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await API.post('/auth/sign-in', credentials);

      setAuthToken(data.token);
      localStorage.setItem('token', data.token);

      // API'den gelen kullanıcı verilerini normalize et
      const normalizedUser = {
        ...data.user,
        name: data.user.username || data.user.name || 'Unknown User', // username'i name'e dönüştür
      };

      console.log('Original API response:', data);
      console.log('Normalized user data:', normalizedUser);

      return {
        token: data.token,
        user: normalizedUser
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      // API'ye logout isteği gönder
      await API.delete('/auth/sign-out');
    } catch (error) {
      // API hatası olsa bile devam et
      console.warn('Logout API error:', error);
    } finally {
      // Her durumda local state'i temizle
      clearAuthToken();
      localStorage.removeItem('token');
    }
    
    return { success: true };
  }
);

export const refreshThunk = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    const savedToken = localStorage.getItem('token');

    if (!savedToken) {
      return thunkAPI.rejectWithValue("Token doesn't exist");
    }

    setAuthToken(savedToken);
    
    // Refresh başladığında loading state'ini set et
    thunkAPI.dispatch(setRefreshing(true));

    try {
      const { data } = await API.get('/users/current');
      
      // Refresh'te de kullanıcı verilerini normalize et
      const normalizedUser = {
        ...data,
        name: data.username || data.name || 'Unknown User',
      };

      return normalizedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    } finally {
      // Refresh bittiğinde loading state'ini kaldır
      thunkAPI.dispatch(setRefreshing(false));
    }
  }
);

export const getBalanceThunk = createAsyncThunk(
  'getBalance',
  async (_, thunkAPI) => {
    try {
      // Kullanıcı bakiyesi kullanıcı bilgisi içinde gelir, bu yüzden current user endpoint'i kullanılır
      const { data } = await API.get('/users/current');
      return data.balance;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
