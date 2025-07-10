
// redux/statistics/statisticsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedMonth: 'March',
  selectedYear: '2023',
  expenses: [
    { category: 'Car', amount: 1500, color: '#FF6384' },
    { category: 'Self care', amount: 800, color: '#36A2EB' },
    { category: 'Child care', amount: 2208.5, color: '#FFCE56' },
    { category: 'Household products', amount: 300, color: '#9966FF' },
    { category: 'Education', amount: 3400, color: '#4BC0C0' },
    { category: 'Leisure', amount: 1230, color: '#FF9F40' },
    { category: 'Other expenses', amount: 610, color: '#C9CBCF' },
  ],
  totalExpense: 22549.24,
  totalIncome: 27350,
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    setMonth(state, action) {
      state.selectedMonth = action.payload;
    },
    setYear(state, action) {
      state.selectedYear = action.payload;
    },
  },
});

export const { setMonth, setYear } = statisticsSlice.actions;
export default statisticsSlice.reducer;

