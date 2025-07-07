import React, { useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrency } from "../../features/currencyFeatures/currencyOperation"; // Adjust the import path as necessary

import styles from "./Currency.module.css";
import Loader from "../../components/Loader";

export default function Currency() {
  const dispatch = useDispatch();
  const { rates, error } = useSelector(state => state.currency);
   const isLoading = useSelector(state => state.global.isLoading);

  useEffect(() => {
    dispatch(fetchCurrency());
  }, [dispatch]);

  const filteredRates = rates.filter(
    r => r.currencyCodeA === 840 || r.currencyCodeA === 978 // USD & EUR
  );

  if (isLoading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Currency Rates</h2>
      <div className={styles.grid}>
        {filteredRates.map(item => (
          <div className={styles.card} key={item.currencyCodeA}>
            <div className={styles.code}>
              {item.currencyCodeA === 840 ? "USD" : "EUR"}
            </div>
            <div className={styles.value}>
              Buy: {item.rateBuy?.toFixed(2)} | Sell: {item.rateSell?.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
