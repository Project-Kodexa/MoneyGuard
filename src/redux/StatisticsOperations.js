import axios from 'axios';
import { setStatistics } from './StatisticsSlice';

export const fetchStatistics = (month, year) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/statistics/${month}/${year}`);
    dispatch(setStatistics(response.data.expenses)); // Veriyi Redux Store'a kaydediyoruz
  } catch (error) {
    console.error('Veri alınırken bir hata oluştu', error);
  }
};


