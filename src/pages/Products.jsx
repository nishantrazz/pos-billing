// src/pages/Products.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { supabase } from "../supabaseClient";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import CategoryModal from "../components/CategoryModal";

export default function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["Beverages", "Snacks", "Dairy"]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id: null,
    sku: "",
    name: "",
    category: "",
    brand: "",
    unit: "",
    price: "",
    cost_price: "",
    tax: "",
    discount: "",
    stock: "",
    barcode: "",
    description: "",
    image: "",
  });

  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  // fetch products
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (!error) setProducts(data);
  };

  // input handlers
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0]);
  };



  const generateSKU = () => {
    const newSKU = "B2-" + Math.floor(Math.random() * 100000);
    setForm({ ...form, sku: newSKU });
  };


  const generateBarcode = () => {
    const newBarcode = "B2-" + Math.floor(Math.random() * 100000);
    setForm({ ...form, barcode: newBarcode });
  };

  // upload image to supabase
  const uploadImage = async () => {
    if (!file) return form.image;
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) return form.image;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // add new product
  const handleAdd = async () => {
    if (!form.sku || !form.name || !form.category || !form.price || !form.stock) {
      alert("Please fill in SKU, Name, Category, Price, and Stock");
      return;
    }
    setLoading(true);
    const imageUrl = file ? await uploadImage() : form.image;

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          sku: form.sku,
          name: form.name,
          category: form.category,
          brand: form.brand,
          unit: form.unit,
          price: Number(form.price) || 0,
          cost_price: Number(form.cost_price) || 0,
          tax: Number(form.tax) || 0,
          discount: Number(form.discount) || 0,
          stock: Number(form.stock) || 0,
          barcode: form.barcode,
          description: form.description,
          image: imageUrl,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding product:", error.message);
      alert("Failed to add product: " + error.message);
    } else {
      setProducts([...products, ...data]);
      closeProductModal();
    }
    setLoading(false);
  };

  // edit
  const handleEdit = (product) => {
    setForm(product);
    setFile(null);
    setIsEditing(true);
    setShowProductModal(true);
  };

  // update
  const handleUpdate = async () => {
    if (!form.id) {
      alert("Product ID missing for update");
      return;
    }
    setLoading(true);
    const imageUrl = file ? await uploadImage() : form.image;

    const { data, error } = await supabase
      .from("products")
      .update({
        sku: form.sku,
        name: form.name,
        category: form.category,
        brand: form.brand,
        unit: form.unit,
        price: Number(form.price) || 0,
        cost_price: Number(form.cost_price) || 0,
        tax: Number(form.tax) || 0,
        discount: Number(form.discount) || 0,
        stock: Number(form.stock) || 0,
        barcode: form.barcode,
        description: form.description,
        image: imageUrl,
      })
      .eq("id", form.id)
      .select();

    if (error) {
      console.error("Error updating product:", error.message);
      alert("Failed to update product: " + error.message);
    } else {
      setProducts(products.map((p) => (p.id === form.id ? data[0] : p)));
      closeProductModal();
    }
    setLoading(false);
  };

  // delete
  const handleDelete = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) setProducts(products.filter((p) => p.id !== id));
    setLoading(true);
    setLoading(false);
  };

  // add category
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      setShowCategoryModal(false);
    }
  };

  // close modal
  const closeProductModal = () => {
    setForm({
      id: null,
      sku: "",
      name: "",
      category: "",
      brand: "",
      unit: "",
      price: "",
      cost_price: "",
      tax: "",
      discount: "",
      stock: "",
      barcode: "",
      description: "",
      image: "",
    });
    setFile(null);
    setIsEditing(false);
    setShowProductModal(false);
  };

  // filter search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Product Management</h1>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowProductModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          >
            ➕ Add Product
          </button>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          >
            🗂️ Add Category
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
        />

        {filteredProducts.length > 0 ? (
          <ProductTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <p>No products found</p>
        )}
      </div>

      <div>

        {showProductModal && (
          <ProductForm
            form={form}
            categories={categories}
            isEditing={isEditing}
            onChange={handleChange}
            onFileChange={handleFileChange}
            onSubmit={isEditing ? handleUpdate : handleAdd}
            onCancel={closeProductModal}
            onGenerateSKU={generateSKU}          // ✅ passed down
            onGenerateBarcode={generateBarcode}  // ✅ passed down
          />
        )}
      </div>

      {showCategoryModal && (
        <CategoryModal
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          onAdd={handleAddCategory}
          onCancel={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  );
}
