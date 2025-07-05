import { createAsyncThunk } from '@reduxjs/toolkit';
import API, { setAuthToken, clearAuthToken } from "../../services/api.js";


export const registerThunk = createAsyncThunk('auth/register', async (credentials, thunkApi) => {
    try {
        const { data } = await API.post('/api/auth/sign-up', credentials);
        setAuthToken(data.token);
        return data;
    } catch (error) {
        thunkApi.rejectWithValue(error.message);
    }
});

export const loginThunk = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
    try {
        const { data } = await API.post('/api/auth/sign-in', credentials);
        setAuthToken(data.token);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const logoutThunk = createAsyncThunk('auth/logout', async (_, thunkApi) => {
    try {
        const { data } = await API.delete('/api/auth/sign-out');
        clearAuthToken();
        return data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.message);
    }
});

export const refreshThunk = createAsyncThunk('auth/refresh', async (_, thunkApi) => {
    const savedToken = thunkApi.getState().auth.token;
    if (savedToken) {
        setAuthToken(savedToken);
    } else {
        return thunkApi.rejectWithValue("Token doesn't exist");
    }

    try {
        const { data } = await API.get('/api/users/current');
        return data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.message);
    }
});

export const getBalanceThunk = createAsyncThunk('getBalance', async (_, thunkApi) => {
    try {
        const { data } = await API.get('/api/users/current');
        return data.balance;
    } catch (error) {
        return thunkApi.rejectWithValue(error.message);
    }
});