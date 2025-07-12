import { createAsyncThunk } from '@reduxjs/toolkit';
import API, { setAuthToken, clearAuthToken } from '../../services/api.js';

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

      console.log("Kayıt için gönderilen data:", signupData);

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
      const { data } = await API.delete('/auth/sign-out');

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
    const savedToken = localStorage.getItem('token');

    if (!savedToken) {
      return thunkAPI.rejectWithValue("Token doesn't exist");
    }

    setAuthToken(savedToken);

    try {
      const { data } = await API.get('/users/current');
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
      const { data } = await API.get('/users/current');
      return data.balance;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
