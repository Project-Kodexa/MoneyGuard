import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import transactionsReducer from "../redux/transactionsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionsReducer,
  // diğer slicelari buraya eklicez
});

export default rootReducer;
