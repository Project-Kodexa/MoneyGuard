import { createSlice } from "@reduxjs/toolkit";


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
    },
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
  },
});

export const { setCredentials, logout, setRefreshing } = authSlice.actions;

export default authSlice.reducer;
