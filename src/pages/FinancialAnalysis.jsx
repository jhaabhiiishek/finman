import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend, ResponsiveContainer } from "recharts";

const FinancialAnalysis = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsRes = await axios.post("http://localhost:5000/api/transactions", { email: user.email });
        const expensesRes = await axios.post("http://localhost:5000/api/expenses", { userEmail: user.email });

        setTransactions(transactionsRes.data.transactions);
        setExpenses(expensesRes.data.expenses);
      } catch (err) {
        setError("Failed to fetch data.");
      }
    };

    if (user?.email) fetchData();
  }, [user]);

  // Compute financial stats
  const totalSpentTransactions = transactions.reduce((acc, tx) => acc + Number(tx.amount), 0);
  const highestTransaction = Math.max(...transactions.map(tx => Number(tx.amount)), 0);
  const totalSpentExpenses = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);
  const highestExpense = Math.max(...expenses.map(exp => Number(exp.amount)), 0);

  // Pie chart: Expense category breakdown
  const expenseCategoryData = expenses.reduce((acc, exp) => {
    const found = acc.find(item => item.name === exp.expenseType);
    if (found) {
      found.value += Number(exp.amount);
    } else {
      acc.push({ name: exp.expenseType, value: Number(exp.amount) });
    }
    return acc;
  }, []);

  // Generate monthly spending data for bar chart
  const monthlySpending = [...transactions, ...expenses].reduce((acc, item) => {
    const month = new Date(item.date).toLocaleString("default", { month: "short" });
    const found = acc.find(entry => entry.name === month);
    if (found) {
      found.value += Number(item.amount);
    } else {
      acc.push({ name: month, value: Number(item.amount) });
    }
    return acc;
  }, []);
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: "#fff", padding: "8px", border: "1px solid #ccc" }}>
          <p>{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  // Generate daily spending data for line chart
  const dailySpending = transactions.reduce((acc, txn) => {
    const date = new Date(txn.date).toLocaleDateString();
    const found = acc.find(item => item.name === date);
    if (found) {
      found.value += Number(txn.amount);
    } else {
      acc.push({ name: date, value: Number(txn.amount) });
    }
    return acc;
  }, []);

  // Colors for pie chart
  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800", "#9C27B0"];

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Financial Dashboard</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-center">
        <div className="bg-blue-500 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Transactions</h3>
          <p className="text-xl">₹{totalSpentTransactions.toFixed(2)}</p>
        </div>
        <div className="bg-green-500 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Highest Transaction</h3>
          <p className="text-xl">₹{highestTransaction}</p>
        </div>
        <div className="bg-purple-500 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Expenses</h3>
          <p className="text-xl">₹{totalSpentExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-red-500 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Highest Expense</h3>
          <p className="text-xl">₹{highestExpense}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart: Expense Breakdown */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-center font-semibold mb-2">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={expenseCategoryData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label>
                {expenseCategoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip/>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Monthly Spending */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-center font-semibold mb-2">Monthly Transactions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4CAF50" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart: Daily Spending */}
        <div className="bg-gray-100 p-4 rounded-lg shadow md:col-span-2">
          <h3 className="text-center font-semibold mb-2">Daily Spending Pattern</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#FF9800" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysis;
