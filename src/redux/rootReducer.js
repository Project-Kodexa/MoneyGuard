import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import transactionsReducer from "./transactionsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionsReducer,
  // diğer slice'lar buraya eklenir
});

export default rootReducer;
