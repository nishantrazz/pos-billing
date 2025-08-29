// src/components/CategoryModal.jsx
import React from "react";

export default function CategoryModal({
  newCategory,
  setNewCategory,
  onAdd,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Category</h2>
        <input
          type="text"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
