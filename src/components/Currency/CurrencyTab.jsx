// src/components/Currency/CurrencyTab.jsx
import React from "react";
import Currency from "./Currency";
import styles from "./CurrencyTab.module.css"; // Eğer stil varsa

export default function CurrencyTab() {
  return (
    <section className={styles.currencyTabContainer}>
      <h1>Döviz Kurları</h1>
      <Currency />
      {}
    </section>
  );
}
