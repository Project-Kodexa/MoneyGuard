import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import globalReducer from "./globalSlice";


export const rootReducer = combineReducers({
  auth: authReducer,
   global: globalReducer,

});

  // diğer slice’lar buraya eklenir

// import transactionsReducer from "../features/transactions/transactionsSlice";

export default rootReducer;