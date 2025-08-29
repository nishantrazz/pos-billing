import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";


function Billing() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customers, setCustomers] = useState([]);
  const WALK_IN_CUSTOMER_ID = '11111111-1111-1111-1111-111111111111';
  const [customer, setCustomer] = useState(WALK_IN_CUSTOMER_ID);
  const [discount, setDiscount] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });



  const navigate = useNavigate();

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (!error) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // ✅ Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase.from("customers").select("*");
      if (!error) setCustomers(data);
    };
    fetchCustomers();
  }, []);

  // ✅ Add product to cart
  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // ✅ Remove item
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // ✅ Barcode scan or search
  const handleBarcodeScan = () => {
    if (!barcode.trim()) return;

    const product = products.find(
      (p) =>
        p.barcode?.toString() === barcode.trim() ||
        p.sku?.toString() === barcode.trim() ||
        p.name.toLowerCase() === barcode.trim().toLowerCase()
    );

    if (product) {
      addToCart(product);
    } else {
      alert("Product not found for barcode: " + barcode);
    }
    setBarcode("");
  };

  // ✅ Save new customer
  const handleAddCustomer = async () => {
    const { data, error } = await supabase.from("customers").insert([newCustomer]).select();
    if (!error && data) {
      setCustomers([...customers, data[0]]);
      setCustomer(data[0].id); // auto-select
      setNewCustomer({ name: "", email: "", phone: "" });
      setShowModal(false);
    }
  };

  // ✅ Filter products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category ? p.category === category : true)
  );

  // ✅ Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal - discount;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left Billing Panel */}
        <div className="w-full md:w-1/3 bg-white shadow-lg p-4 flex flex-col">
          <h2 className="text-lg font-bold mb-2">🧾 Billing</h2>

          {/* Customer Select */}
          <div className="flex gap-2 mb-4">
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value={WALK_IN_CUSTOMER_ID}>Walk-in Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone || "No phone"})
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-3 rounded"
            >
              +
            </button>
          </div>

          {/* Barcode Input + Search */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Scan / Enter Barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleBarcodeScan(); // ✅ scanner or enter key
              }}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={handleBarcodeScan} // ✅ manual search
              className="bg-blue-500 text-white px-3 rounded"
            >
              🔍
            </button>
          </div>


          {/* Cart Table */}
          <div className="overflow-x-auto">
            <table className="w-full border mb-4 text-xs md:text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">Item</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Subtotal</th>
                  <th className="p-2 border">Del</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">{item.qty}</td>
                    <td className="p-2 border">₹{item.price}</td>
                    <td className="p-2 border">₹{item.price * item.qty}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-auto">
            <div className="flex justify-between p-2">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between p-2">
              <span>Discount:</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="border p-1 rounded w-20 text-right"
              />
            </div>
            <div className="flex justify-between font-bold p-2 bg-gray-100">
              <span>Total Payable:</span>
              <span>₹{total}</span>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {/* Print Bill */}
              <button
                className="bg-green-600 text-white py-2 rounded"
                onClick={async () => {
                  if (!cart.length) return alert("Cart is empty!");

                  try {
                    const customer_id =
                      customer === "Walk-in Customer" ? null : customer;
                    const invoice_number = `INV-${Date.now()}`;

                    // Save invoice
                    const { data: invoiceData, error: invoiceError } = await supabase
                      .from("invoices")
                      .insert([
                        {
                          customer_id,
                          invoice_number,
                          total_amount: total,
                          discount,
                          status: "paid",
                        },
                      ])
                      .select()
                      .single();
                    if (invoiceError) throw invoiceError;

                    const invoice_id = invoiceData.id;

                    // Save invoice items
                    const itemsToSave = cart.map((item) => ({
                      invoice_id,
                      product_id: item.id,
                      quantity: item.qty,
                      price: item.price,
                    }));
                    const { error: itemsError } = await supabase
                      .from("invoice_items")
                      .insert(itemsToSave);
                    if (itemsError) throw itemsError;

                    // Navigate to thermal bill page
                    navigate(`/thermal-bill/${invoice_id}`);

                    // Clear cart
                    setCart([]);
                    setDiscount(0);
                    setCustomer("Walk-in Customer");
                  } catch (err) {
                    console.error(err);
                    alert("Error saving invoice: " + err.message);
                  }
                }}
              >
                Print Bill
              </button>


              <button
                className="bg-red-600 text-white py-2 rounded"
                onClick={() => {
                  if (window.confirm("Are you sure you want to cancel this bill?")) {
                    setCart([]);
                    setDiscount(0);
                    setCustomer("Walk-in Customer");
                  }
                }}
              >
                Cancel Bill
              </button>
              <button
                className="bg-yellow-500 text-white py-2 rounded"
                onClick={async () => {
                  if (!cart.length) return alert("Cart is empty!");

                  try {
                    const customer_id = customer === "Walk-in Customer" ? null : customer;
                    const invoice_number = `HOLD-${Date.now()}`;

                    await supabase.from("invoices").insert([{
                      customer_id,
                      invoice_number,
                      total_amount: total,
                      status: "hold"
                    }]);

                    alert("Bill put on hold successfully!");
                    setCart([]);
                    setDiscount(0);
                    setCustomer("Walk-in Customer");

                  } catch (err) {
                    console.error(err);
                    alert("Error holding invoice: " + err.message);
                  }
                }}
              >
                Hold Bill
              </button>
            </div>
          </div>
        </div>

        {/* Right Products Grid */}
        <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">🛒 Available Items</h2>
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
              onClick={() => navigate("/products")}
            >
              ➕ Add Product
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Search Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-3 py-2 w-full md:flex-1"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">All Categories</option>
              {[...new Set(products.map((p) => p.category))].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white shadow-sm rounded-lg p-3 cursor-pointer hover:shadow-md transition text-center"
                >
                  <img
                    src={product.image || "https://via.placeholder.com/80"}
                    alt={product.name}
                    className="h-16 w-full object-contain mx-auto mb-2"
                  />
                  <h3 className="text-xs md:text-sm font-semibold truncate">
                    {product.name}
                  </h3>
                  <p className="text-red-500 font-bold text-sm">
                    ₹{product.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add New Customer</h2>
            <input
              type="text"
              placeholder="Name"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Phone"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 border rounded">
                Cancel
              </button>
              <button onClick={handleAddCustomer} className="px-3 py-1 bg-blue-500 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Billing;
