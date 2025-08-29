import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
    <Router>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/Billing" element={<Billing />} />
        <Route path="/Reports" element={<Reports />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/thermal-bill/:invoiceId" element={<ThermalBill />} />

        <Route path="/invoicepages" element={<InvoicesPage />}/>
      </Routes>
    </Router>
  );
}


export default App;
