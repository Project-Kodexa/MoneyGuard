import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import globalReducer from "./globalSlice";

const rootReducer = combineReducers({
  auth: authReducer,
   global: globalReducer,
  // diğer slice’lar buraya eklenir
});

export default rootReducer;
