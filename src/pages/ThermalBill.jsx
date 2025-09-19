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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: invoiceData, error: invoiceError } = await supabase
          .from("invoices")
          .select("*")
          .eq("id", invoiceId)
          .single();
        if (invoiceError) throw invoiceError;

        setInvoice(invoiceData);

        const { data: itemData, error: itemError } = await supabase
          .from("invoice_items")
          .select("*, products(name)")
          .eq("invoice_id", invoiceId);
        if (itemError) throw itemError;

        setItems(itemData);

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
        maxWidth: "80mm",
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#000",
      }}
    >
      {/* Header with logo + store info */}
     <div className="flex items-center justify-between mb-2">
        <img src="/logo.png" alt="Logo" className="w-12 h-12" />
        <div className="text-right">
          <h2 className="text-base font-bold">B2 Wholesale Mega Mart</h2>
          <p className="text-xs">Sohsarai, Nalanda, Bihar, 803101</p>
          <p className="text-xs">GSTIN: 10AJPPG8120K1ZC</p>
          <p className="text-xs">Mobile No.: 6204595801</p>
        </div>
      </div>
      <hr className="border-black" />

      {/* Invoice info */}
      <div className="my-2 text-xs">
        <p>
          <span className="font-bold">Invoice:</span> {invoice.invoice_number}
        </p>
        <p>
          <span className="font-bold">Date:</span>{" "}
          {new Date(invoice.created_at).toLocaleString()}
        </p>
        <p>
          <span className="font-bold">Customer:</span>{" "}
          {customer ? customer.name : "Walk-in Customer"}
        </p>
      </div>
      <hr className="border-black" />

      {/* Items */}
      <table className="w-full text-xs my-2">
        <thead className="border-b border-black">
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
      <hr className="border-black" />

      {/* Totals */}
      <div className="text-xs my-2">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Discount: ₹{discount.toFixed(2)}</p>
        <p className="font-bold text-lg text-black">
          GRAND TOTAL: ₹{total.toFixed(2)}
        </p>
      </div>
      <hr className="border-black" />

      {/* Footer */}
      <div className="text-center text-xs mt-2">
        <p>⚠ No return, no refund</p>
        <p>✔ Only exchange within 3 days</p>
        <p className="mt-2 font-bold">*** Thank You! Visit Again ***</p>
      </div>

      {/* Print button */}
      <button
        className="w-full mt-2 bg-black text-white py-1 rounded text-xs print:hidden"
        onClick={() => window.print()}
      >
        🖨 Print Bill
      </button>
    </div>
  );
};

export default ThermalBill;
