import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import transactionsReducer from "../redux/transactionsSlice";
import globalReducer from "../redux/globalSlice";
<<<<<<< HEAD
=======

>>>>>>> 93cb302c28852ebff140e6e0a25914f4c2b9d33b
const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionsReducer,
  global: globalReducer,
  // diğer slicelari buraya eklicez
});

export default rootReducer;
