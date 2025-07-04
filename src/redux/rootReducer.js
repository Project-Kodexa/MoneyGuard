import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  // diğer slice’lar buraya eklenir
});

export default rootReducer;
