import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import transactionsReducer from "./transactionsSlice";
import globalReducer from "./globalSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionsReducer,
  global: globalReducer,
  // diğer slicelari buraya eklicez
});

export default rootReducer;
