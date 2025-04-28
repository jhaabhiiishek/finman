import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Auth from "./Auth";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import BillPayments from "./pages/BillPayments";
import FinancialAnalysis from "./pages/FinancialAnalysis";
import Settings from "./pages/Settings";
import { useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);

  return user ? (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/transactions" element={<Transactions user={user} />} />
          <Route path="/bills" element={<BillPayments user={user} />} />
          <Route path="/analysis" element={<FinancialAnalysis user={user} />} />
          <Route path="/settings" element={<Settings user={user} />} />
        </Routes>
      </DashboardLayout>
    </Router>
  ) : (
    <Auth setUser={setUser} />
  );
};

export default App;
