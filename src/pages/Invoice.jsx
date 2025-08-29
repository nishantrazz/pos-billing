// invoice.jsx

import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import dayjs from "dayjs";

function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [todaySummary, setTodaySummary] = useState({
    totalIncome: 0,
    totalItems: 0,
    topProducts: [],
  });

  // Fetch all invoices
  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from("invoices")
      .select(`*, invoice_items(*, product_id(*)), customer_id(*)`)
      .order("date", { ascending: false });
    if (!error) setInvoices(data || []);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Filter invoices based on search
  useEffect(() => {
    const filtered = invoices.filter(
      (inv) =>
        inv.invoice_number.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        inv.customer_id?.name?.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        inv.invoice_items.some((item) =>
          item.product_id?.name?.toLowerCase().includes(invoiceSearch.toLowerCase())
        )
    );
    setFilteredInvoices(filtered);
  }, [invoiceSearch, invoices]);

  // Calculate today summary
  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");
    let totalIncome = 0;
    let totalItems = 0;
    const productCount = {};

    invoices.forEach((inv) => {
      if (dayjs(inv.date).format("YYYY-MM-DD") === today) {
        inv.invoice_items.forEach((item) => {
          totalIncome += item.total;
          totalItems += item.quantity;
          const name = item.product_id?.name || "Unknown";
          productCount[name] = (productCount[name] || 0) + item.quantity;
        });
      }
    });

    const topProducts = Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));

    setTodaySummary({ totalIncome, totalItems, topProducts });
  }, [invoices]);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handlePrintInvoice = (invoice) => {
    const printContent = document.getElementById(`invoice-${invoice.id}`);
    const win = window.open("", "_blank");
    win.document.write(printContent.innerHTML);
    win.document.close();
    win.print();
  };

  const highlightRow = (date) => {
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    if (dayjs(date).format("YYYY-MM-DD") === today) return "bg-green-100";
    if (dayjs(date).format("YYYY-MM-DD") === yesterday) return "bg-yellow-100";
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">🧾 Invoices</h1>

        {/* Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search by invoice, customer, or product"
            value={invoiceSearch}
            onChange={(e) => setInvoiceSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2 shadow-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">💰 Total Income Today</h3>
            <p className="text-2xl font-bold">₹{todaySummary.totalIncome}</p>
          </div>
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">📦 Total Items Sold Today</h3>
            <p className="text-2xl font-bold">{todaySummary.totalItems}</p>
          </div>
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">🔥 Top Products Today</h3>
            <ul className="list-disc list-inside">
              {todaySummary.topProducts.map((p, idx) => (
                <li key={idx}>
                  {p.name} ({p.qty})
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-2">Invoice #</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Total Items</th>
                <th className="border p-2">Total Amount</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const totalItems = inv.invoice_items.reduce((sum, item) => sum + item.quantity, 0);
                  const totalAmount = inv.invoice_items.reduce((sum, item) => sum + item.total, 0);
                  return (
                    <tr key={inv.id} className={`${highlightRow(inv.date)} hover:bg-gray-50`}>
                      <td className="border p-2">{inv.invoice_number}</td>
                      <td className="border p-2">{inv.customer_id?.name || "N/A"}</td>
                      <td className="border p-2">{dayjs(inv.date).format("DD/MM/YYYY")}</td>
                      <td className="border p-2">{totalItems}</td>
                      <td className="border p-2">₹{totalAmount}</td>
                      <td className="border p-2">{inv.status}</td>
                      <td className="border p-2 flex gap-2">
                        <button
                          onClick={() => handleViewInvoice(inv)}
                          className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handlePrintInvoice(inv)}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm"
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">
              Invoice #{selectedInvoice.invoice_number}
            </h2>
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="mb-4 px-3 py-1 border rounded"
            >
              Close
            </button>

            <div id={`invoice-${selectedInvoice.id}`}>
              <p><b>Customer:</b> {selectedInvoice.customer_id?.name || "N/A"}</p>
              <p><b>Date:</b> {dayjs(selectedInvoice.date).format("DD/MM/YYYY")}</p>
              <p><b>Status:</b> {selectedInvoice.status}</p>

              <table className="w-full text-sm border-collapse mt-3">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-1">Product</th>
                    <th className="border p-1">Qty</th>
                    <th className="border p-1">Price</th>
                    <th className="border p-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.invoice_items.map((item) => (
                    <tr key={item.id}>
                      <td className="border p-1">{item.product_id?.name || "N/A"}</td>
                      <td className="border p-1">{item.quantity}</td>
                      <td className="border p-1">₹{item.price}</td>
                      <td className="border p-1">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoice;
