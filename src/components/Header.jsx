// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo / Title */}
        <h1 className="text-2xl font-bold">Nishant Raj</h1>

        {/* Navigation */}
        <nav className="flex space-x-6">
          <Link to="/dashboard" className="hover:text-gray-200">
            Home
          </Link>
          <Link to="/billing" className="hover:text-gray-200">
            Billing
          </Link>
           <Link to="/products" className="hover:text-gray-200">
            Products
          </Link>
          <Link to="/add-customer" className="hover:text-gray-200">
            Customers
          </Link>
          <Link to="/reports" className="hover:text-gray-200">
            Reports
          </Link>
           <Link to="/Invoicepages" className="hover:text-gray-200">
            invoice
          </Link>
          
        </nav>
      </div>
    </header>
  );
}

export default Header;
