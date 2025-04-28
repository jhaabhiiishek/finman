import { useState } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiList, FiCreditCard, FiBarChart, FiSettings } from "react-icons/fi"; // Icons

export default function DashboardLayout({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg ${expanded ? "w-64" : "w-20"} transition-all duration-300`}>
        <div className="p-5 flex items-center justify-between">
          <h2 className={`text-xl font-bold text-gray-800 ${!expanded && "hidden"}`}>FinMan</h2>
          <button onClick={() => setExpanded(!expanded)} className="p-2">
            {expanded ? "←" : "→"}
          </button>
        </div>

        <nav className="mt-5">
          <NavItem to="/" icon={<FiHome />} label="Home" expanded={expanded} />
          <NavItem to="/transactions" icon={<FiList />} label="Transactions" expanded={expanded} />
          <NavItem to="/bills" icon={<FiCreditCard />} label="Bill Payments" expanded={expanded} />
          <NavItem to="/analysis" icon={<FiBarChart />} label="Financial Analysis" expanded={expanded} />
          <NavItem to="/settings" icon={<FiSettings />} label="Settings" expanded={expanded} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}

function NavItem({ to, icon, label, expanded }) {
  return (
    <Link to={to} className="flex items-center p-3 hover:bg-gray-200 rounded-md mx-3">
      <span className="text-lg">{icon}</span>
      <span className={`ml-4 text-gray-700 text-sm font-medium ${!expanded && "hidden"}`}>{label}</span>
    </Link>
  );
}
