
const HomeTab = () => {
  const dispatch = useDispatch();
  const { transactions, isLoading, error } = useSelector(state => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="home-tab">
      <h2>Transactions</h2>
      <TransactionsList transactions={transactions} />
    </div>
  );
};

export default HomeTab;