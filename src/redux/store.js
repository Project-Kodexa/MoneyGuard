import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";

// Date transform fonksiyonu - localStorage'dan yüklenen date string'lerini Date objesine dönüştürür
const dateTransform = {
  in: (state) => {
    if (!state || !state.transactions) return state;
    
    // Transactions array'ini kontrol et ve date'leri dönüştür
    const transformedTransactions = state.transactions.map(transaction => {
      if (transaction.date && typeof transaction.date === 'string') {
        // Date string'ini Date objesine dönüştür
        const date = new Date(transaction.date);
        // Eğer geçerli bir date ise, ISO string olarak sakla
        if (!isNaN(date.getTime())) {
          return {
            ...transaction,
            date: date.toISOString()
          };
        }
      }
      return transaction;
    });
    
    return {
      ...state,
      transactions: transformedTransactions
    };
  },
  out: (state) => {
    // Kaydetme sırasında herhangi bir dönüşüm yapmaya gerek yok
    return state;
  }
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "transactions", "statistics", "currency"], // auth, transactions, statistics ve currency slice'ları persist edilecek
  transforms: [dateTransform], // Date transform'u ekle
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

// Development ortamında store'u global olarak erişilebilir hale getir
if (process.env.NODE_ENV === 'development') {
  window.store = store;
}
