import { useState } from "react";
import axios from "axios";

const Home = ({ user }) => {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [expenseType, setExpenseType] = useState("");
  const [customType, setCustomType] = useState("");

  const [updateBalanceAmount, setUpdateBalanceAmount] = useState("");
  const [updateMoneyLoading, setAddMoneyLoading] = useState(false);
  const [addMoneyMessage, setAddMoneyMessage] = useState("");

  const handleAddCustomType = async () => {
    if (customType.trim() === "" || expenseTypes.some(t => t.name === customType)) return;
    try {
      const response = await axios.post("http://localhost:5000/api/expense-types", { name: customType });
      setExpenseTypes([...expenseTypes, response.data]);
      setExpenseType(response.data.name);
      setCustomType("");
    } catch (error) {
      console.error("Error adding expense type:", error);
    }
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setExpenseType(selectedType === "Other" ? "" : selectedType);
  };

  const handleUpdateMoney = async () => {
    if (!updateBalanceAmount || Number(updateBalanceAmount) <= 0) {
      setAddMoneyMessage("Please enter a valid amount to add.");
      return;
    }
  
    setAddMoneyLoading(true);
    setAddMoneyMessage("");
  
    try {
      const response = await axios.post("http://localhost:5000/api/updateBalance", {
        email: user.email,
        balance: Number(updateBalanceAmount),
      });
  
      if (response.data.message === "Balance updated successfully") {
        setAddMoneyMessage("Balance updated successfully!");
        user.balance= Number(updateBalanceAmount);  // Update UI immediately
        setUpdateBalanceAmount("");
      } else {
        setAddMoneyMessage(response.data.message || "Failed to update balance.");
      }
    } catch (error) {
      setAddMoneyMessage("Error updating balance. Please try again.");
    } finally {
      setAddMoneyLoading(false);
    }
  };
  
  const handleTransaction = async () => {
    if (!receiverEmail || !amount) {
      setMessage("Please enter a valid email and amount.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/transfer", {
        senderEmail: user.email,
        receiverEmail: receiverEmail,
        date: new Date(),
        description: description,
        category:expenseType,
        amount: Number(amount),
      });

      if (response.data.message === "Transfer Successful") {
        setMessage("Transaction successful!");
        setReceiverEmail("");
        setAmount("");
      } else {
        setMessage(response.data.message || "Transaction failed.");
      }
    } catch (error) {
      setMessage("Transaction could not be completed. Ensure the receiver's email is linked.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-lg">
      {/* User Welcome Section */}
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>
      <h2 className="text-xl mb-4">
        Balance: <span className="font-semibold">Rs.{user.balance}</span>
      </h2>

      <p className="text-gray-600 mb-4">You can send money to your friends and family using their email.</p>

      {/* Update current balance  */}

      <div className="bg-green-100 p-5 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-3">Update your Current Balance</h3>
        <div className="flex items-center space-x-3 mb-3">
          <input
            type="number"
            placeholder="Enter your balance"
            value={updateBalanceAmount}
            onChange={(e) => setUpdateBalanceAmount(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <button
            onClick={handleUpdateMoney}
            className={`px-4 py-2 text-white rounded ${
              updateMoneyLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={updateMoneyLoading}
          >
            {updateMoneyLoading ? "Updating..." : "Update"}
          </button>
        </div>
        {addMoneyMessage && (
          <p className={`text-sm ${addMoneyMessage.includes("successfully") ? "text-green-700" : "text-red-600"}`}>
            {addMoneyMessage}
          </p>
        )}
      </div>

      {/* Transaction Caution */}
      <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg mb-4">
        ⚠️ Ensure the recipient's email is linked to the system before making a transaction.
      </div>

      {/* Make Transaction Section */}
      <div className="bg-gray-100 p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Make a Transaction</h3>
        <div className="mb-3">
          <label className="block font-medium">Recipient's Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <label className="block text-gray-700 text-sm font-medium">Expense Type</label>
        <select className="border p-2 w-full mt-2 rounded" onChange={handleTypeChange} value={expenseType || ""}>
          <option value="" disabled>Select a type</option>
          {expenseTypes.map((type) => (
            <option key={type._id} value={type.name}>{type.name}</option>
          ))}
          <option value="Other">Other (Add new)</option>
        </select>
        {expenseType === "" && (
          <div className="mt-3">
            <input type="text" className="border p-2 w-full rounded" placeholder="Enter new expense type" value={customType} onChange={(e) => setCustomType(e.target.value)} />
            <button onClick={handleAddCustomType} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Add Type</button>
          </div>
        )}
        <div className="mb-3">
          <label className="block font-medium">Description:</label>
          <input
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium">Amount (Rs):</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <button
          onClick={handleTransaction}
          className={`w-full py-2 text-white font-semibold rounded ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Send Money"}
        </button>

        {/* Message Display */}
        {message && <p className={`mt-3 text-center text-sm ${message==='Transaction successful!'? "text-green-600":" text-red-600"}`}>{message}</p>}
      </div>
    </div>
  );
};

export default Home;
