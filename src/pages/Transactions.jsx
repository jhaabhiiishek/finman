import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseEntry from "../components/ExpenseEntry";

const Transactions = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        const transactionsRes = await axios.post("http://localhost:5000/api/transactions", {
          email: user.email
        });

        // Fetch expenses
        const expensesRes = await axios.post("http://localhost:5000/api/expenses", {
          userEmail: user.email
        });
        setTransactions(transactionsRes.data.transactions);
        setExpenses(expensesRes.data.expenses);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchData();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-6 rounded-lg mb-6">
      <h1 className="text-3xl text-center font-bold mb-6">Your Transactions & Expenses</h1>
      <ExpenseEntry user={user} />

      {loading ? (
        <p className="text-center mt-4">Loading data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Transactions Section */}
          <h2 className="text-xl font-semibold mt-6">Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500">No transactions found.</p>
          ) : (
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full bg-white border rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-left">Category</th>
                    <th className="py-2 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn._id} className="border-t">
                      <td className="py-2 px-4">{new Date(txn.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{txn.description}</td>
                      <td className="py-2 px-4">{txn.category}</td>
                      <td
                        className={`py-2 px-4 text-right font-medium ${
                          txn.senderEmail===user.email ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        ₹{txn.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Expenses Section */}
          <h2 className="text-xl font-semibold mt-6">Expenses</h2>
          {expenses.length === 0 ? (
            <p className="text-center text-gray-500">No expenses found.</p>
          ) : (
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full bg-white border rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Expense Type</th>
                    <th className="py-2 px-4 text-left">Recipient</th>
                    <th className="py-2 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp._id} className="border-t">
                      <td className="py-2 px-4">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{exp.expenseType}</td>
                      <td className="py-2 px-4">{exp.recipient}</td>
                      <td className="py-2 px-4 text-right text-red-500 font-medium">
                        ₹{exp.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Transactions;
