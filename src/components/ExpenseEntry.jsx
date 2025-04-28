import { useState, useEffect } from "react";
import axios from "axios";

const ExpenseEntry = ({user}) => {
  const [expenseType, setExpenseType] = useState("");
  const [customType, setCustomType] = useState("");
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/expense-types")
      .then((response) => setExpenseTypes(response.data))
      .catch((error) => console.error("Error fetching expense types:", error));
  }, []);

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setExpenseType(selectedType === "Other" ? "" : selectedType);
  };

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

  const handleSaveExpense = async () => {
    if (!expenseType || !recipient || !amount || !date) {
      alert("Please fill all required fields.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/add-expense", {
		    userEmail: user.email,
        expenseType: expenseType,
        recipient:recipient,
        amount: parseFloat(amount),
        remarks: remarks,
        date:date
      }).then((response) => {
        if(response.data.message === "Expense saved successfully"){
          alert("Expense saved successfully!");
          setExpenseType("");
          setRecipient("");
          setAmount("");
          setRemarks("");
          setDate("");
          window.location.reload();
        }else{
          alert(response.data.message || "Failed to save expense.");
        }
      });
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Manual Expense Entry</h2>
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
      <label className="block text-gray-700 text-sm font-medium mt-4">Transferred/Given To</label>
      <input type="text" className="border p-2 w-full rounded" placeholder="Recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      <label className="block text-gray-700 text-sm font-medium mt-4">Amount</label>
      <input type="number" className="border p-2 w-full rounded" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <label className="block text-gray-700 text-sm font-medium mt-4">Remarks</label>
      <input type="text" className="border p-2 w-full rounded" placeholder="Notes (optional)" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
      <label className="block text-gray-700 text-sm font-medium mt-4">Date of Transaction</label>
      <input type="date" className="border p-2 w-full rounded" value={date} onChange={(e) => setDate(e.target.value)} />
      <button onClick={handleSaveExpense} className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full">Save Expense</button>
    </div>
  );
};

export default ExpenseEntry;
