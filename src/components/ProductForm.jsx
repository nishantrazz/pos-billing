// src/components/ProductForm.jsx
import React from "react";

export default function ProductForm({
  form,
  categories,
  isEditing,
  onChange,
  onFileChange,
  onSubmit,
  onCancel,
  onGenerateSKU,
  onGenerateBarcode,
  loading, // ✅ new prop to show uploading state
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto p-4 z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
          {isEditing ? "✏️ Edit Product" : "➕ Add Product"}
        </h2>

        <div className="grid grid-cols-2 gap-5">
          {/* SKU */}
          <label className="flex flex-col text-sm font-medium text-gray-600">
            SKU
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={onChange}
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                readOnly
              />
              <button
                type="button"
                onClick={onGenerateSKU}
                className="bg-gray-700 hover:bg-gray-800 text-white px-3 rounded-lg text-sm"
              >
                Generate
              </button>
            </div>
          </label>

          {/* Barcode */}
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Barcode
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                name="barcode"
                value={form.barcode}
                onChange={onChange}
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                readOnly
              />
              <button
                type="button"
                onClick={onGenerateBarcode}
                className="bg-gray-700 hover:bg-gray-800 text-white px-3 rounded-lg text-sm"
              >
                Generate
              </button>
            </div>
          </label>

          {/* Name */}
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              className="border p-2 mt-1 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </label>

          {/* Category */}
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Category
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              className="border p-2 mt-1 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          {/* Brand */}
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Brand
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={onChange}
              className="border p-2 mt-1 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </label>

          {/* Unit */}
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Unit
            <input
              type="text"
              name="unit"
              value={form.unit}
              onChange={onChange}
              className="border p-2 mt-1 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </label>

          {/* Price */}
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Price
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={onChange}
              className="border p-2 mt-1 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </label>

          {/* Cost Price */}
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Cost Price
            <input
              type="number"
              name="cost_price"
              value={form.cost_price}
              onChange={onChange}
              className="border p-2 mt-1 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </label>

          {/* Tax */}
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Tax (%)
            <input
              type="number"
              name="tax"
              value={form.tax}
              onChange={onChange}
              className="border p-2 mt-1 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </label>

          {/* Discount */}
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Discount (%)
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={onChange}
              className="border p-2 mt-1 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </label>

          {/* Stock */}
          <label className="flex flex-col text-sm font-medium text-gray-600">
            Stock
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={onChange}
              className="border p-2 mt-1 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </label>

          {/* Description */}
          <label className="col-span-2 flex flex-col text-sm font-medium text-gray-600">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              className="border p-2 mt-1 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows="1"
            />
          </label>

          {/* Image */}
          <label className="col-span-2 flex flex-col text-sm font-medium text-gray-600">
            Product Image
            <input
              type="file"
              onChange={onFileChange}
              className="border p-2 mt-1 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-3 w-28 h-28 object-cover rounded-lg shadow"
              />
            )}
          </label>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onSubmit}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>{isEditing ? "Update" : "Add"}</>
            )}
          </button>

          <button
            onClick={onCancel}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
