// src/components/ProductTable.jsx
import React from "react";

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-sm bg-white shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Image</th>
            <th className="border p-2">SKU</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Brand</th>
            <th className="border p-2">Unit</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Cost Price</th>
            <th className="border p-2">Tax</th>
            <th className="border p-2">Discount</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Barcode</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              {/* Image */}
              <td className="border p-2">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  "—"
                )}
              </td>
              <td className="border p-2">{p.sku}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.category}</td>
              <td className="border p-2">{p.brand}</td>
              <td className="border p-2">{p.unit}</td>
              <td className="border p-2">${p.price}</td>
              <td className="border p-2">${p.cost_price}</td>
              <td className="border p-2">{p.tax}%</td>
              <td className="border p-2">{p.discount}%</td>
              <td className="border p-2">{p.stock}</td>
              <td className="border p-2">{p.barcode}</td>
              <td className="border p-2">{p.description}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => onEdit(p)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
