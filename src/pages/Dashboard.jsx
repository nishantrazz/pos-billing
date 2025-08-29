// Dashboard.jsx

import React from "react";
import Sidebar from "../components/Sidebar";


const Dashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800 tracking-tight">
          Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Total Sales
            </h2>
            <p className="text-3xl font-bold text-green-600">₹12,500</p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Today's Sales
            </h2>
            <p className="text-3xl font-bold text-blue-600">₹2,300</p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Products in Stock
            </h2>
            <p className="text-3xl font-bold text-orange-500">125</p>
          </div>
        </div>

        {/* Quick Shortcuts Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer">
              <h3 className="font-semibold">➕ Add Product</h3>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer">
              <h3 className="font-semibold">📦 Manage Stock</h3>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer">
              <h3 className="font-semibold">📊 Sales Report</h3>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer">
              <h3 className="font-semibold">👥 Customers</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
