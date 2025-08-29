import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <h2 className="text-2xl font-bold p-4 border-b border-gray-700">
        POS System
      </h2>
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <li><Link to="/dashboard" className="hover:text-yellow-400">Dashboard</Link></li>
          <li><Link to="/billing" className="hover:text-yellow-400">Billing</Link></li>
          <li><Link to="/products" className="hover:text-yellow-400">Products</Link></li>
          <li><Link to="/customers" className="hover:text-yellow-400">Customers</Link></li>
          <li><Link to="/reports" className="hover:text-yellow-400">Reports</Link></li>
          <li><Link to="/settings" className="hover:text-yellow-400">Settings</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
