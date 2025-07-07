import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import transactionsReducer from "../redux/transactionsSlice";
import globalReducer from "../redux/globalSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionsReducer,
  global: globalReducer,
  // diğer slicelari buraya eklicez
});

export default rootReducer;
