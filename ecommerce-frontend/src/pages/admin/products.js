import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast'
// import { useRouter } from "next/router";
import { useAuth } from '../../context/AuthContext';  // import your auth hook

export default function AdminProducts() {
  const { token, loading, user } = useAuth(); // get token and loading from context
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [restockAmounts, setRestockAmounts] = useState({});
//   const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: [],
    quantity: '',
    categoryId: '',
    imageFiles: [],
  });
 

  const fetchProducts = async (token) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/getAllProducts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data.result.data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const fetchCategories = async (token) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories/getAllCategories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data.result.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  // Fetch products and categories when token is ready
    useEffect(() => {
        if (loading || !token) return;
      
        fetchProducts(token);
        fetchCategories(token);
      }, [loading, token]);
      console.log("TOKEN:", token);
      console.log("USER:", user);
      console.log("LOADING:", loading);
  
    if (loading) {
        return (
          <div className="h-screen flex items-center justify-center text-gray-600 text-lg">
            Loading...
          </div>
        );
      }
      
      if (!token) {
        return (
          <div className="h-screen flex items-center justify-center text-red-600 text-lg">
            Please login as admin to manage products.
          </div>
        );
      }
      

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Admin token missing. Login as admin.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('stock', form.quantity);
      formData.append('categoryId', form.categoryId);

      form.imageUrl.forEach((url) => {
        formData.append('imageUrl', url);
      });

      // Append images
      form.imageFiles.forEach((file) => {
        formData.append('imageUrl', file);
      });
      

      const url = editingProduct
        ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/updateProduct/${editingProduct.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/createProduct`;

      const method = editingProduct ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setForm({
        name: '',
        price: '',
        description: '',
        imageUrl: [],
        stock: '',
        categoryId: '',
        imageFiles: [],
      });
      setEditingProduct(null);
      fetchProducts(token);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: Array.isArray(product.imageUrl) ? product.imageUrl: [],
      quantity: product.stock,
      categoryId: product.categoryId,
      imageFiles: [],
    });
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!token) {
      alert('Admin token missing. Login as admin.');
      return;
    }

    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/deleteProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts(token);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  if (loading) {
    // You can customize this loading UI as needed
    return <div className="text-center mt-20 text-pink-600">Loading...</div>;
  }

  if (!token) {
    return <div className="text-center mt-20 text-red-600">Please login as admin to manage products.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-montserrat">
      <h1 className="text-4xl font-bold mb-8 text-pink-600 text-center">Manage Products</h1>

      <div className="mb-10">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-pink-600 font-semibold hover:underline mb-4"
        >
          {isOpen ? '− Hide Create Product Form' : '+ Create New Product'}
        </button>

        <div
          className={`transition-all duration-500 overflow-hidden ${
            isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {/* Form Section */}
          <form
            onSubmit={handleCreateOrUpdate}
            className="bg-white border border-pink-200 p-10 rounded-3xl shadow-xl mb-12 space-y-6"
          >
            <h2 className="text-3xl font-bold text-pink-600 mb-6 border-b pb-2">
              {editingProduct ? 'Edit Product' : 'Create New Product'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="E.g. Hydrating Serum"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleFormChange}
                  placeholder="E.g. 29.99"
                  type="number"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  name="quantity"
                  value={form.stock}
                  onChange={handleFormChange}
                  placeholder="E.g. 50"
                  type="number"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleFormChange}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="E.g. Lightweight serum with vitamin C..."
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                  rows={4}
                />
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <label className="cursor-pointer bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition">
                    Select Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setForm({ ...form, imageFiles: Array.from(e.target.files) })}
                      className="hidden"
                      required={!editingProduct}
                    />
                  </label>

                  {form.imageFiles.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-2">
                      {form.imageFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="w-24 h-24 object-cover rounded-xl border border-pink-200 shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                imageFiles: form.imageFiles.filter((_, i) => i !== index),
                              })
                            }
                            className="absolute -top-2 -right-2 bg-white border border-gray-300 text-gray-500 rounded-full p-1 shadow hover:bg-gray-100"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {form.imageUrl.length > 0 && (
  <div className="flex flex-wrap gap-4 mt-2">
    {form.imageUrl.map((url, index) => (
      <div key={index} className="relative group">
        <img
          src={url}
          alt={`Existing ${index}`}
          className="w-24 h-24 object-cover rounded-xl border border-pink-200 shadow-lg"
        />
        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              imageUrl: form.imageUrl.filter((_, i) => i !== index),
            })
          }
          className="absolute -top-2 -right-2 bg-white border border-gray-300 text-gray-500 rounded-full p-1 shadow hover:bg-gray-100"
          title="Remove image"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}


                {form.imageFiles.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {form.imageFiles.length} image(s) selected
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-xl transition"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setForm({
                      name: '',
                      price: '',
                      description: '',
                      imageUrl: [],
                      quantity: '',
                      categoryId: '',
                      imageFiles: [],
                    });
                    setIsOpen(false);
                  }}
                  className="bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-pink-50 p-4 rounded-2xl shadow hover:shadow-md transition">
            <img
              src={Array.isArray(p.imageUrl) ? p.imageUrl[0] : p.imageUrl}
              alt={p.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
              onError={(e) => (e.target.src = '/placeholder.png')}
            />
            <h3 className="text-lg font-semibold text-pink-800">{p.name}</h3>
            <p className="text-sm text-gray-600 mb-1">
  {p.category?.name || 'Uncategorized'} • Rs.{p.price.toFixed(2)}
</p>

<p className="text-sm">
  Stock:
  <span className={`font-semibold ml-1 ${p.stock < 5 ? 'text-red-600' : 'text-gray-700'}`}>
    {p.stock}
  </span>
</p>

{p.stock === 0 && (
  <p className="text-red-600 text-sm font-semibold">🚫 Out of Stock</p>
)}

{p.stock > 0 && p.stock < 5 && (
  <>
    <p className="text-yellow-500 text-sm font-medium">⚠️ Low Stock</p>
    <div className="mt-2 flex items-center gap-2">
  <input
    type="number"
    min="1"
    value={restockAmounts[p.id] !== undefined ? restockAmounts[p.id] : 1}
    onChange={(e) => {
      const val = e.target.value;
      if (val === '') {
        setRestockAmounts({ ...restockAmounts, [p.id]: '' });
      } else {
        const num = Number(val);
        if (!isNaN(num) && num >= 0) {
          setRestockAmounts({ ...restockAmounts, [p.id]: num });
        }
      }
    }}
    className="w-20 rounded-xl border border-pink-300 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
  />
  <button
    onClick={async () => {
      try {
        await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/admin/products/${p.id}/restock`, {
          amount: restockAmounts[p.id] || 1,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(`Restocked ${restockAmounts[p.id] || 1} items successfully!`);

        fetchProducts(token);
      } catch (error) {
        console.error('Restock failed', error);
      }
    }}
    className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-xl shadow transition"
  >
    Add Stock
  </button>
</div>

  </>
)}


            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => handleEdit(p)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <Pencil size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="flex items-center gap-1 text-sm text-red-600 hover:underline"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
