// src/pages/ThermalBill.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ThermalBill = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch invoice + items + customer
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Invoice
        const { data: invoiceData, error: invoiceError } = await supabase
          .from("invoices")
          .select("*")
          .eq("id", invoiceId)
          .single();
        if (invoiceError) throw invoiceError;

        setInvoice(invoiceData);

        // Invoice items
        const { data: itemData, error: itemError } = await supabase
          .from("invoice_items")
          .select("*, products(name)")
          .eq("invoice_id", invoiceId);
        if (itemError) throw itemError;

        setItems(itemData);

        // Customer (if any)
        if (invoiceData.customer_id) {
          const { data: custData } = await supabase
            .from("customers")
            .select("*")
            .eq("id", invoiceData.customer_id)
            .single();
          setCustomer(custData);
        }
      } catch (err) {
        console.error("Error loading invoice:", err);
      }
      setLoading(false);

      // Auto open print dialog after load
      setTimeout(() => window.print(), 600);
    };

    fetchData();
  }, [invoiceId]);

  if (loading) return <p className="p-4">Loading bill...</p>;
  if (!invoice) return <p className="p-4">Bill not found.</p>;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = invoice.discount || 0;
  const total = invoice.total_amount;

  return (
    <div
      className="mx-auto p-4 bg-white"
      style={{
        maxWidth: "80mm", // for thermal, fits roll width
        fontFamily: "monospace",
        fontSize: "12px",
      }}
    >
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-base font-bold">My Store</h2>
        <p className="text-xs">GSTIN: 29ABCDE1234F2Z5</p>
        <p className="text-xs">123, Main Road, City</p>
      </div>
      <hr />

      {/* Invoice info */}
      <p className="text-xs">
        Invoice: {invoice.invoice_number} <br />
        Date: {new Date(invoice.created_at).toLocaleString()} <br />
        Customer: {customer ? customer.name : "Walk-in Customer"}
      </p>
      <hr />

      {/* Items table */}
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left">Item</th>
            <th className="text-center">Qty</th>
            <th className="text-right">Price</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={idx}>
              <td>{it.products?.name || "Item"}</td>
              <td className="text-center">{it.quantity}</td>
              <td className="text-right">{it.price.toFixed(2)}</td>
              <td className="text-right">
                {(it.price * it.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />

      {/* Totals */}
      <div className="text-xs">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Discount: ₹{discount.toFixed(2)}</p>
        <p className="font-bold">Grand Total: ₹{total.toFixed(2)}</p>
      </div>
      <hr />

      <p className="text-center text-xs mt-2">*** Thank You! Visit Again ***</p>

      {/* Print button for manual printing */}
      <button
        className="w-full mt-2 bg-blue-600 text-white py-1 rounded text-xs print:hidden"
        onClick={() => window.print()}
      >
        Print Bill
      </button>
    </div>
  );
};

export default ThermalBill;
