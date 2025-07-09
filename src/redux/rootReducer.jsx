import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import globalReducer from "./globalSlice";
import currencyReducer from "../features/currencyFeatures/currencySlice";



export const rootReducer = combineReducers({
  auth: authReducer,
   global: globalReducer,
  currency: currencyReducer,

});

  // diğer slice’lar buraya eklenir

// import transactionsReducer from "../features/transactions/transactionsSlice";

export default rootReducer;