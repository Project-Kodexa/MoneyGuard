
const TransactionsList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="transactions-list-empty">
        <p>No transactions found. Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <div className="transactions-list-container">
      <div className="transactions-list">
        {transactions.map(transaction => (
          <TransactionsItem 
            key={transaction.id} 
            transaction={transaction} 
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionsList;