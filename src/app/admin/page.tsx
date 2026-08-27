"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, Package, Plus, Trash2, Edit3, Upload, X, Save,
  Eye, CheckCircle, Loader2
} from "lucide-react";
import { categories, formatPrice } from "@/data/products";
import { Product } from "@/data/types";

type AdminTab = "dashboard" | "products" | "add-product";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load products from Supabase API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProductList(data);
    } catch {
      console.error("Failed to fetch products");
    }
    setLoading(false);
  };

  // Product form state
  const [form, setForm] = useState({
    name: "", slug: "", category: "Rings", categorySlug: "rings",
    price: "", originalPrice: "", description: "", shortDescription: "",
    metal: "18K White Gold", metalWeight: "", stone: "", stoneWeight: "",
    sku: "", tags: "", isNew: false, isBestseller: false, images: [] as string[],
  });

  const resetForm = () => {
    setForm({
      name: "", slug: "", category: "Rings", categorySlug: "rings",
      price: "", originalPrice: "", description: "", shortDescription: "",
      metal: "18K White Gold", metalWeight: "", stone: "", stoneWeight: "",
      sku: "", tags: "", isNew: false, isBestseller: false, images: [],
    });
    setEditingProduct(null);
  };

  // Upload images to Supabase Storage
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadStatus("uploading");
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) uploadedUrls.push(data.url);
      } catch {
        console.error("Upload failed for:", file.name);
      }
    }

    if (uploadedUrls.length > 0) {
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      setUploadStatus("success");
    } else {
      setUploadStatus("error");
    }
    setTimeout(() => setUploadStatus("idle"), 3000);
  }, []);

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // Save product to Supabase
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const price = parseInt(form.price) || 0;
    const originalPrice = form.originalPrice ? parseInt(form.originalPrice) : undefined;
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined;

    const productData = {
      id: editingProduct?.id || `adm-${Date.now()}`,
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      category: form.category,
      categorySlug: form.categorySlug,
      price, originalPrice, discount,
      description: form.description,
      shortDescription: form.shortDescription,
      images: form.images.length > 0 ? form.images : ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&q=80"],
      metal: form.metal, metalWeight: form.metalWeight,
      stone: form.stone || undefined, stoneWeight: form.stoneWeight || undefined,
      sku: form.sku || `ADM-${Date.now()}`,
      rating: 4.5, reviewCount: 0, inStock: true,
      isNew: form.isNew, isBestseller: form.isBestseller,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingProduct) {
        // Update via API
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (res.ok) {
          const updated = await res.json();
          setProductList((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)));
        }
      } else {
        // Create via API
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (res.ok) {
          const created = await res.json();
          setProductList((prev) => [created, ...prev]);
        }
      }
    } catch {
      console.error("Failed to save product");
      // Fallback: add/update locally
      if (editingProduct) {
        setProductList((prev) => prev.map((p) => (p.id === editingProduct.id ? productData as Product : p)));
      } else {
        setProductList((prev) => [productData as Product, ...prev]);
      }
    }

    setSaving(false);
    resetForm();
    setActiveTab("products");
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name, slug: product.slug,
      category: product.category, categorySlug: product.categorySlug,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      description: product.description, shortDescription: product.shortDescription,
      metal: product.metal, metalWeight: product.metalWeight,
      stone: product.stone || "", stoneWeight: product.stoneWeight || "",
      sku: product.sku, tags: product.tags.join(", "),
      isNew: product.isNew || false, isBestseller: product.isBestseller || false,
      images: product.images,
    });
    setActiveTab("add-product");
  };

  // Delete product from Supabase
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
    } catch {
      console.error("Delete API failed, removing locally");
    }
    setProductList((prev) => prev.filter((p) => p.id !== id));
  };

  const avgPrice = productList.length > 0
    ? productList.reduce((sum, p) => sum + p.price, 0) / productList.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-xl font-bold text-gray-800">GOLDEN GRACE</Link>
            <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full font-medium">Admin</span>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-brand transition-colors flex items-center gap-1">
            <Eye className="h-4 w-4" /> View Store
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {[
                { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
                { id: "products" as const, label: "Products", icon: Package },
                { id: "add-product" as const, label: "Add Product", icon: Plus },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id === "add-product") resetForm(); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${activeTab === tab.id ? "bg-brand/5 text-brand border-l-2 border-brand" : "text-gray-600 hover:bg-gray-50"}`}>
                    <Icon className="h-4 w-4" /> {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 text-brand animate-spin" />
                <span className="ml-3 text-gray-500">Loading products...</span>
              </div>
            ) : (
              <>
                {/* Dashboard */}
                {activeTab === "dashboard" && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-bold text-gray-800">Dashboard</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Total Products", value: productList.length, icon: Package },
                        { label: "Categories", value: categories.length, icon: LayoutDashboard },
                        { label: "Avg. Price", value: formatPrice(Math.round(avgPrice)), icon: Package },
                        { label: "In Stock", value: productList.filter((p) => p.inStock).length, icon: CheckCircle },
                      ].map((stat) => {
                        const Icon = stat.icon;
                        return (
                          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4">
                            <Icon className="h-5 w-5 text-brand mb-2" />
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                      <h3 className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</h3>
                      <div className="flex flex-wrap gap-3">
                        <button onClick={() => { setActiveTab("add-product"); resetForm(); }}
                          className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors">
                          <Plus className="h-4 w-4" /> Add New Product
                        </button>
                        <button onClick={() => setActiveTab("products")}
                          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          <Package className="h-4 w-4" /> View All Products
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Products List */}
                {activeTab === "products" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-serif text-2xl font-bold text-gray-800">Products ({productList.length})</h2>
                      <button onClick={() => { setActiveTab("add-product"); resetForm(); }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors">
                        <Plus className="h-4 w-4" /> Add Product
                      </button>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                              <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                              <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                              <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {productList.map((product) => (
                              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                                      <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-800 truncate max-w-[200px]">{product.name}</p>
                                      {product.discount && <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded">{product.discount}% OFF</span>}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-500">{product.category}</td>
                                <td className="px-4 py-3">
                                  <span className="font-semibold text-gray-800">{formatPrice(product.price)}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.inStock ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                                    {product.inStock ? "In Stock" : "Out of Stock"}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-end gap-1">
                                    <button onClick={() => handleEdit(product)} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors" title="Edit">
                                      <Edit3 className="h-4 w-4 text-gray-500" />
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-md hover:bg-red-50 transition-colors" title="Delete">
                                      <Trash2 className="h-4 w-4 text-red-400" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add/Edit Product */}
                {activeTab === "add-product" && (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-gray-800 mb-4">
                      {editingProduct ? "Edit Product" : "Add New Product"}
                    </h2>
                    <form onSubmit={handleSaveProduct} className="space-y-6">
                      {/* Image Upload */}
                      <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Product Images (Uploaded to Supabase Storage)</h3>
                        <div className="flex flex-wrap gap-3">
                          {form.images.map((img, i) => (
                            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                              <Image src={img} alt="" fill className="object-cover" sizes="96px" />
                              <button type="button" onClick={() => removeImage(i)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          <button type="button" onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-brand hover:text-brand transition-colors">
                            <Upload className="h-6 w-6 mb-1" />
                            <span className="text-[10px]">Upload</span>
                          </button>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                        {uploadStatus === "uploading" && <p className="text-xs text-brand mt-2 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Uploading to Supabase...</p>}
                        {uploadStatus === "success" && <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Uploaded successfully</p>}
                        {uploadStatus === "error" && <p className="text-xs text-red-500 mt-2">Upload failed. Check Supabase Storage bucket.</p>}
                      </div>

                      {/* Basic Info */}
                      <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                              placeholder="e.g., Eternal Diamond Solitaire" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select value={form.categorySlug} onChange={(e) => { const cat = categories.find((c) => c.slug === e.target.value); setForm({ ...form, categorySlug: e.target.value, category: cat?.name || "" }); }}
                              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20">
                              {categories.map((cat) => <option key={cat.slug} value={cat.slug}>{cat.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                            <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                              placeholder="Auto-generated if empty" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                            <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                              placeholder="e.g., 18K White Gold | 1 Ct Diamond" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                              placeholder="Describe the product..." rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none" required />
                          </div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Pricing</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                              placeholder="45999" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                            <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                              placeholder="52999 (optional)" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
                          </div>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Product Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Metal</label>
                            <select value={form.metal} onChange={(e) => setForm({ ...form, metal: e.target.value })}
                              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20">
                              {["18K White Gold", "14K White Gold", "14K Rose Gold", "14K Yellow Gold", "22K Yellow Gold", "Platinum"].map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Metal Weight</label>
                            <input type="text" value={form.metalWeight} onChange={(e) => setForm({ ...form, metalWeight: e.target.value })}
                              placeholder="e.g., 3.2g" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stone</label>
                            <input type="text" value={form.stone} onChange={(e) => setForm({ ...form, stone: e.target.value })}
                              placeholder="e.g., Diamond" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stone Weight</label>
                            <input type="text" value={form.stoneWeight} onChange={(e) => setForm({ ...form, stoneWeight: e.target.value })}
                              placeholder="e.g., 1.00 Ct" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                              placeholder="diamond, solitaire, engagement" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" />
                          </div>
                        </div>
                      </div>

                      {/* Flags */}
                      <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Visibility</h3>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="rounded border-gray-300 text-brand focus:ring-brand" />
                            <span className="text-sm text-gray-700">Mark as New</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={form.isBestseller} onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })} className="rounded border-gray-300 text-brand focus:ring-brand" />
                            <span className="text-sm text-gray-700">Mark as Bestseller</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button type="submit" disabled={saving}
                          className="flex items-center gap-2 px-6 py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-50">
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {saving ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                        </button>
                        <button type="button" onClick={() => { resetForm(); setActiveTab("products"); }}
                          className="px-6 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
