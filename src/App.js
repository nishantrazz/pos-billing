import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Header from "./components/Header";
import AddCustomer from "./pages/AddCustomer";
import ThermalBill from "./pages/ThermalBill";
import InvoicesPage from "./pages/InvoicesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/header" element={<Header />} />
      <Route path="/add-customer" element={<AddCustomer />} />
      <Route path="/thermal-bill/:invoiceId" element={<ThermalBill />} />
      <Route path="/invoicepages" element={<InvoicesPage />} />
    </Routes>
  );
}

export default App;
