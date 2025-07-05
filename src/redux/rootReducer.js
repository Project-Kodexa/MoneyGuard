import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
 habibe
import globalReducer from "./globalSlice";

const rootReducer = combineReducers({
  auth: authReducer,
   global: globalReducer,
  // diğer slice’lar buraya eklenir

import transactionsReducer from "../features/transactions/transactionsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionsReducer,
  // diğer slicelari buraya eklicez
 main
});

export default rootReducer;
