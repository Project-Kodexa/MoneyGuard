import { createAsyncThunk } from '@reduxjs/toolkit';
import API, { setAuthToken, clearAuthToken } from '../../services/api.js';

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await API.post('/api/auth/sign-up', credentials);

      setAuthToken(data.token);
      localStorage.setItem('token', data.token);

      return data;
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
      const { data } = await API.post('/api/auth/sign-in', credentials);

      setAuthToken(data.token);
      localStorage.setItem('token', data.token);

      return data;
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
      const { data } = await API.delete('/api/auth/sign-out');

      clearAuthToken();
      localStorage.removeItem('token');

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const refreshThunk = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    const savedToken =
      thunkAPI.getState().auth.token || localStorage.getItem('token');

    if (!savedToken) {
      return thunkAPI.rejectWithValue("Token doesn't exist");
    }

    setAuthToken(savedToken);

    try {
      const { data } = await API.get('/api/users/current');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getBalanceThunk = createAsyncThunk(
  'getBalance',
  async (_, thunkAPI) => {
    try {
      // Kullanıcı bakiyesi kullanıcı bilgisi içinde gelir, bu yüzden current user endpoint’i kullanılır
      const { data } = await API.get('/api/users/current');
      return data.balance;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
