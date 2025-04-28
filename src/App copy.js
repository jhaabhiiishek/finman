import Auth from "./Auth";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseEntry from "./components/ExpenseEntry";

const App = () => {
  const [user, setUser] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [manualEntries, setManualEntries] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/transactions/${user.email}`).then(res => setTransactions(res.data));
    }
  }, [user]);

  const handleTransfer = async () => {
    await axios.post("http://localhost:5000/transfer", { senderEmail: user.email, receiverEmail, amount });
    setUser({ ...user, balance: user.balance - amount });
  };

  const addManualExpense = () => {
    setManualEntries([...manualEntries, { transferredTo: "", amount: "", remarks: "", date: "" }]);
  };

  return user ? (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>
        <h2 className="text-xl mb-2">Balance: <span className="font-semibold">Rs.{user.balance}</span></h2>

        {/* Fund Transfer */}
        <div className="my-5">
          <h3 className="text-lg font-semibold">Send Money</h3>
          <input className="border p-2 w-full mt-2 rounded" placeholder="Receiver Email" onChange={(e) => setReceiverEmail(e.target.value)} />
          <input className="border p-2 w-full mt-2 rounded" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
          <button onClick={handleTransfer} className="bg-blue-500 text-white py-2 px-4 rounded mt-3">Transfer</button>
        </div>

        {/* Transactions */}
        <div className="my-5">
          <h3 className="text-lg font-semibold">Transactions</h3>
          <ul className="mt-2">
            {transactions.map((tx, index) => (
              <li key={index} className="border-b py-2">{tx.sender} → {tx.receiver} | Rs.{tx.amount}</li>
            ))}
          </ul>
        </div>

        {/* Financial Analysis */}
        <div className="mt-5">
          <h3 className="text-lg font-semibold">Financial Overview</h3>
          <div className="bg-blue-100 p-4 rounded mt-2">
            <p>Total Transactions: {transactions.length}</p>
            <p>Total Spent: Rs.{transactions.reduce((acc, tx) => acc + Number(tx.amount), 0)}</p>
            <p>Highest Transaction: Rs.{Math.max(...transactions.map(tx => Number(tx.amount)), 0)}</p>
          </div>
        </div>


        {/* Bill Payments */}
        <div className="my-5">
          <h3 className="text-lg font-semibold">Bill Payments</h3>
          <select className="border p-2 w-full mt-2 rounded">
            <option>Electricity Bill</option>
            <option>Water Bill</option>
            <option>Internet Bill</option>
          </select>
          <input className="border p-2 w-full mt-2 rounded" placeholder="Amount" />
          <button className="bg-purple-500 text-white py-2 px-4 rounded mt-3">Pay Bill</button>
        </div>

        {/* Manual Expense Entry */}
        {/* <div className="mt-5">
          <h3 className="text-lg font-semibold">Manual Expense Entry</h3>
          {manualEntries.map((entry, index) => (
            <div key={index} className="mt-3 bg-gray-200 p-3 rounded">
              <input className="border p-2 w-full rounded" placeholder="Transferred To" />
              <input className="border p-2 w-full mt-2 rounded" placeholder="Amount" />
              <select className="border p-2 w-full mt-2 rounded">
                <option>Electricity Bill</option>
                <option>Water Bill</option>
                <option>Internet Bill</option>
              </select>
              <input className="border p-2 w-full mt-2 rounded" placeholder="Remarks" />
              <input type="date" className="border p-2 w-full mt-2 rounded" />
            </div>
          ))}
          <button onClick={addManualExpense} className="bg-green-500 text-white py-2 px-4 rounded mt-3">+ Add Expense</button>
        </div> */}

        <ExpenseEntry />
      </div>
    </div>
  ) : <Auth setUser={setUser} />;
};

export default App;
