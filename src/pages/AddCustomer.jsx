import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";

function CustomersPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");

  // Fetch all customers
  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle input change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (editingId) {
      const { error } = await supabase.from("customers").update(formData).eq("id", editingId);
      if (!error) {
        setMessage("✅ Customer updated successfully!");
        setEditingId(null);
        setFormData({ name: "", email: "", phone: "" });
        fetchCustomers();
      } else setMessage(`❌ Error: ${error.message}`);
    } else {
      const { error } = await supabase.from("customers").insert([formData]);
      if (!error) {
        setMessage("✅ Customer added successfully!");
        setFormData({ name: "", email: "", phone: "" });
        fetchCustomers();
      } else setMessage(`❌ Error: ${error.message}`);
    }

    setLoading(false);
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setFormData({ name: customer.name, email: customer.email, phone: customer.phone });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    await supabase.from("customers").delete().eq("id", id);
    fetchCustomers();
  };

  // Fetch invoices of a customer
  const handlePurchase = async (customer) => {
    setSelectedCustomer(customer);
    const { data, error } = await supabase
      .from("invoices")
      .select(`*, invoice_items(*, product_id(*))`)
      .eq("customer_id", customer.id)
      .order("date", { ascending: false });
    if (!error) setInvoices(data || []);
    setShowInvoicesModal(true);
  };

  // Filtered customers based on search
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (customer.email?.toLowerCase().includes(customerSearch.toLowerCase())) ||
    (customer.phone?.includes(customerSearch))
  );

  // Filtered invoices based on search
  const filteredInvoices = invoices.filter((invoice) => {
    const invoiceNumberMatch = invoice.invoice_number.toLowerCase().includes(invoiceSearch.toLowerCase());
    const productMatch = invoice.invoice_items.some((item) =>
      item.product_id?.name?.toLowerCase().includes(invoiceSearch.toLowerCase())
    );
    return invoiceNumberMatch || productMatch;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">👥 Customers</h1>

        {/* Add / Edit Form */}
        <div className="bg-white shadow-lg p-6 rounded-lg mb-6 border-t-4 border-indigo-500">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "✏️ Edit Customer" : "➕ Add New Customer"}
          </h2>
          {message && <p className="mb-3 text-sm text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white p-3 rounded-lg col-span-1 md:col-span-3 hover:bg-indigo-700 transition duration-300"
            >
              {loading ? "Saving..." : editingId ? "Update Customer" : "Add Customer"}
            </button>
          </form>
        </div>

        {/* Customer Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Search customer by name, email or phone"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            className="border p-3 rounded-lg w-full md:w-1/2 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
          />
        </div>

        {/* Customers List */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border-t-4 border-indigo-500">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-100 text-left">
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-indigo-50 transition duration-200">
                    <td className="border p-2">{customer.name}</td>
                    <td className="border p-2">{customer.email}</td>
                    <td className="border p-2">{customer.phone}</td>
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => handlePurchase(customer)}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                      >
                        Purchase
                      </button>
                      <button
                        onClick={() => handleEdit(customer)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoices Modal */}
      {showInvoicesModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-4xl overflow-auto max-h-[90vh] border-t-4 border-green-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-600">
                🧾 Invoices for {selectedCustomer?.name}
              </h2>
              <button
                onClick={() => setShowInvoicesModal(false)}
                className="px-3 py-1 border rounded hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>

            {/* Invoice Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="🔍 Search invoices by number or product"
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm"
              />
            </div>

            {filteredInvoices.length === 0 ? (
              <p className="text-gray-500">No invoices found matching your search.</p>
            ) : (
              filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="mb-4 border p-3 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between mb-2 font-medium">
                    <span>Invoice #: <b>{invoice.invoice_number}</b></span>
                    <span>Status: {invoice.status}</span>
                  </div>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-green-100">
                        <th className="border p-1">Product</th>
                        <th className="border p-1">Qty</th>
                        <th className="border p-1">Price</th>
                        <th className="border p-1">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.invoice_items.map((item) => (
                        <tr key={item.id} className="hover:bg-green-50 transition">
                          <td className="border p-1">{item.product_id?.name || "N/A"}</td>
                          <td className="border p-1">{item.quantity}</td>
                          <td className="border p-1">₹{item.price}</td>
                          <td className="border p-1">₹{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomersPage;
