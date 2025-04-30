import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllTransactions } from "../../services/transactionService";
import TransactionItem from "../../components/transactions/TransactionItem";

const TransactionHistory = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsData = await getAllTransactions();
        setTransactions(transactionsData);
      } catch (err) {
        setError("Failed to load transaction history. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  if (!user) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded my-4">
        Please log in to view your transaction history.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-10">Loading transaction history...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        {error}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
        <div className="text-center py-8">
          <p className="text-gray-500">You don't have any transactions yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

      {Object.keys(groupedTransactions).map((date) => (
        <div key={date} className="mb-8">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b">{date}</h2>

          <div className="space-y-6">
            {groupedTransactions[date].map((transaction) => (
              <div key={transaction.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-gray-500">Transaction ID:</span>
                    <span className="ml-2 font-mono">{transaction.id}</span>
                  </div>
                  <div className="text-lg font-bold">
                    ${parseFloat(transaction.total).toFixed(2)}
                  </div>
                </div>

                <div className="space-y-2">
                  {transaction.items.map((item) => (
                    <TransactionItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;