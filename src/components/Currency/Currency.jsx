import React, { useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrency } from "../../features/currencyFeatures/currencyOperation";
import Chart from "../Chart";
import styles from "./Currency.module.css";
import Loader from "../Loader/Loader";

export default function Currency() {
  const dispatch = useDispatch();
  const currencyState = useSelector(state => state.currency);
  const rates = currencyState?.rates || [];
  const error = currencyState?.error || null;
  const isLoading = useSelector(state => state.global.isLoading);

  useEffect(() => {
    dispatch(fetchCurrency());
  }, [dispatch]);

  // Sadece UAH karşılığı USD/EUR (currencyCodeB: 980) olanları al
  const usd = rates.find(r => r.currencyCodeA === 840 && r.currencyCodeB === 980);
  const eur = rates.find(r => r.currencyCodeA === 978 && r.currencyCodeB === 980);

  if (isLoading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <section className={styles.container}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px 0' }}>Currency</th>
            <th style={{ textAlign: 'center', padding: '8px 0' }}>Purchase</th>
            <th style={{ textAlign: 'center', padding: '8px 0' }}>Sale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: 600, padding: '8px 0' }}>USD</td>
            <td style={{ textAlign: 'center', padding: '8px 0' }}>{usd?.rateBuy?.toFixed(2) ?? '-'}</td>
            <td style={{ textAlign: 'center', padding: '8px 0' }}>{usd?.rateSell?.toFixed(2) ?? '-'}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600, padding: '8px 0' }}>EUR</td>
            <td style={{ textAlign: 'center', padding: '8px 0' }}>{eur?.rateBuy?.toFixed(2) ?? '-'}</td>
            <td style={{ textAlign: 'center', padding: '8px 0' }}>{eur?.rateSell?.toFixed(2) ?? '-'}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
