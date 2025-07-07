// Bu içerik  store.js ve rootReducer.js dosyaların hata vermemesi için eklendi. Sonra Kişi 2 ve 3 kendi login/register işlemlerini buraya entegre edecekler.
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
    },  
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
