import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, logoutThunk, refreshThunk } from "./authOperations";

const initialState = {
  token: null,
  user: {
    name: null,
    email: null,
    balance: null, 
  },
  isLoading: false,
  error: null,
  isLoggedIn: false,
  isRefreshing: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.error = null; // Hata state'ini temizle
    },
    logout: (state) => {
      state.token = null;
      state.user = {
        name: null,
        email: null,
        balance: null,
      };
      state.isLoggedIn = false;
      state.isRefreshing = false;
      state.error = null;
    },
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login işlemleri
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout işlemleri
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.token = null;
        state.user = { name: null, email: null, balance: null };
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Refresh işlemleri
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isRefreshing = false;
        state.error = null;
      })
      .addCase(refreshThunk.rejected, (state) => {
        state.token = null;
        state.user = { name: null, email: null, balance: null };
        state.isLoggedIn = false;
        state.isRefreshing = false;
      });
  },
});

export const { setCredentials, logout, setRefreshing, setUser } = authSlice.actions;

export default authSlice.reducer;
