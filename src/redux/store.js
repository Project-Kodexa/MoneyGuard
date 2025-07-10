import { configureStore } from '@reduxjs/toolkit';
import statisticsReducer from './StatisticsSlice';

export const store = configureStore({
  reducer: {
    statistics: statisticsReducer,
  },
});
