import { combineReducers } from "redux";
import authReducer from "../features/auth/authSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";
import globalReducer from "../redux/globalSlice";
import statisticsReducer from "./StatisticsSlice";
import currencyReducer from "../features/currencyFeatures/currencySlice";

const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionsReducer,
  global: globalReducer,
  statistics: statisticsReducer,
  currency: currencyReducer, // <-- currency reducer eklendi
});

export default rootReducer;
