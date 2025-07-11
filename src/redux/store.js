import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "transactions", "statistics", "currency"], // auth, transactions, statistics ve currency slice'ları persist edilecek
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
