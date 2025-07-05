// Bu içerik  store.js ve rootReducer.js dosyaların hata vermemesi için eklendi. Sonra Kişi 2 ve 3 kendi login/register işlemlerini buraya entegre edecekler.
import { createSlice } from "@reduxjs/toolkit";
import { registerThunk, loginThunk, logoutThunk, refreshThunk, getBalanceThunk } from "./authOperations.js";

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
    // Bu senkron reducer'lara şimdilik dokunmayabiliriz, ancak asenkron akış bittiğinde
    // belki artık ihtiyaç kalmaz veya başka amaçlarla kullanılırlar
    // Örneğin, sadece logout'u burada tutabiliriz, çünkü logoutThunk token ve user'ı temizliyor
    // setCredentials'a ise asenkron thunk'lar fulfilled olduğunda ihtiyacımız kalmayacak
  },
  extraReducers: (builder) => {
    builder
      // --- Register Thunk ---
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Yeni bir işlem başladığında önceki hataları temizle
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.token = action.payload.token;
        state.user.name = action.payload.user.name; 
        state.user.email = action.payload.user.email;
        state.user.balance = action.payload.user.balance;
        state.isLoggedIn = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Hata mesajını kaydet
        state.token = null;
        state.user = { name: null, email: null, balance: null };
        state.isLoggedIn = false;
      })
      // --- Login Thunk ---
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.token = action.payload.token;
        state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
        state.user.balance = action.payload.user.balance;
        state.isLoggedIn = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.token = null;
        state.user = { name: null, email: null, balance: null };
        state.isLoggedIn = false;
      })
      // --- Logout Thunk ---
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.token = null;
        state.user = { name: null, email: null, balance: null };
        state.isLoggedIn = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Hata olsa bile logout'u denediğimiz için çoğu zaman token ve user'ı temizliyoruz
        // Ancak API tarafında gerçekten başarılı bir logout gerçekleşmezse
        // burada state'i temizlememek daha mantıklı olabilir
        
        state.token = null;
        state.user = { name: null, email: null, balance: null };
        state.isLoggedIn = false;
      })
      // --- Refresh Thunk ---
      .addCase(refreshThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Refresh başarılı olduğunda token zaten api.js den geliyor
        // Burada sadece kullanıcı bilgilerini güncelliyoruz
        state.user.name = action.payload.name;
        state.user.email = action.payload.email;
        state.user.balance = action.payload.balance;
        state.isLoggedIn = true; // Token var ve kullanıcı bilgileri çekilebildiyse giriş yapılmıştır
      })
      .addCase(refreshThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.token = null; // Token geçerli değilse veya hata varsa temizle
        state.user = { name: null, email: null, balance: null };
        state.isLoggedIn = false;
      })
      // --- Get Balance Thunk (bakiyemiz auth state'inde kalsın diye yaratıldı) ---
      .addCase(getBalanceThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBalanceThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user.balance = action.payload; // Sadece bakiyeyi günceller
      })
      .addCase(getBalanceThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user.balance = null;
      });
  },
});

// Artık setCredentials ve logout reducer'ları yerine thunk'lar kullanılacak o yüzden aşağıdaki export u yorum satırına aldım değişiklikler kafa karıştırmasın diye
// export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
