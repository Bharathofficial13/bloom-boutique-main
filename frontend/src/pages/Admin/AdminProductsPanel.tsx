import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Edit2, Trash2, Upload, Loader, Check, AlertCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  didYouKnow: string;
  image: string;
  stock?: number;
  rating?: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const AdminProductsPanel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load products on mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

 // 1. Load Categories (Matches your app.get("/api/categories"))
const loadCategories = async () => {
  try {
    const response = await fetch("https://clientkanishka.onrender.com/api/categories");
    const data = await response.json();
    // Your backend returns { success: true, categories: [...] }
    setCategories(data.categories || []);
  } catch (error) {
    console.error("Category fetch error:", error);
  }
};

// 2. Load Products (Matches your app.get("/api/products"))
const loadProducts = async () => {
  try {
    setLoading(true);
    const response = await fetch("https://clientkanishka.onrender.com/api/products");
    const data = await response.json();
    // Your backend returns { success: true, products: [...] }
    setProducts(data.products || []);
  } catch (error) {
    setMessage({ type: "error", text: "Failed to load products" });
  } finally {
    setLoading(false);
  }
};

  const handleAddProduct = async (productData: any) => {
  const ADMIN_TOKEN = "your_secure_admin_token_123";

  // Remove _id and id if they exist in the form state 
  // to let MongoDB generate a fresh, valid one
  const { _id, id, ...cleanData } = productData;

  try {
    const response = await fetch("https://clientkanishka.onrender.com/api/admin/products", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify({
        ...cleanData,
        // Ensure image is an object to match your Mongoose Schema
        image: typeof cleanData.image === 'string' 
          ? { url: cleanData.image, cloudinaryId: "" } 
          : cleanData.image
      }),
    });

    const data = await response.json();
    if (data.success) {
      setProducts(prev => [data.product, ...prev]);
      setShowForm(false);
      setMessage({ type: "success", text: "Product added with a valid ID!" });
    }
  } catch (error) {
    console.error("Add Error:", error);
  }
};
const handleUpdateProduct = async (productId: string, productData: any) => {
  const ADMIN_TOKEN = "your_secure_admin_token_123"; 

  try {
    // Ensure image matches the Schema: { url: String, cloudinaryId: String }
    const formattedImage = typeof productData.image === 'string' 
      ? { url: productData.image, cloudinaryId: "" } 
      : productData.image;

    const response = await fetch(`https://clientkanishka.onrender.com/api/admin/products/${productId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify({
        ...productData,
        image: formattedImage
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Update the list locally using _id
      setProducts(prev => prev.map(p => 
        (p as any)._id === productId ? data.product : p
      ));
      setEditingProduct(null);
      setMessage({ type: "success", text: "Category/Product updated!" });
    } else {
      throw new Error(data.error || "Update failed");
    }
  } catch (error: any) {
    console.error("Update Error:", error);
    setMessage({ type: "error", text: error.message });
  }
};

const handleDeleteProduct = async (productId: string) => {
  // 1. Safety Check
  if (!productId || productId === "undefined") {
    setMessage({ type: "error", text: "Invalid Product ID" });
    return;
  }

  if (!confirm("Are you sure you want to delete this product?")) return;

  // Use your admin token from your .env
  const ADMIN_TOKEN = "your_secure_admin_token_123"; 

  try {
    const response = await fetch(`https://clientkanishka.onrender.com/api/admin/products/${productId}`, { 
      method: "DELETE",
      headers: {
        // ADD THIS: The backend requires the token to allow deletion
        "Authorization": `Bearer ${ADMIN_TOKEN}`
      }
    });

    const data = await response.json();

    if (data.success) {
      // FIX: Filter using _id (the key MongoDB sends back)
      setProducts(prevProducts => prevProducts.filter(p => (p as any)._id !== productId));
      
      setMessage({ type: "success", text: "Product deleted successfully!" });
    } else {
      throw new Error(data.error || "Delete failed");
    }
  } catch (error: any) {
    console.error("Delete Error:", error);
    setMessage({ type: "error", text: `Failed to delete: ${error.message}` });
  }
};
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });


// Inside AdminProductsPanel component



const handleAddCategory = async (catData: { name: string; id: string; icon: string }) => {
  const ADMIN_TOKEN = "your_secure_admin_token_123";

  try {
   const response = await fetch("https://clientkanishka.onrender.com/api/admin/categories", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json", // CRITICAL: Tells Express to parse the body
    "Authorization": `Bearer ${ADMIN_TOKEN}`
  },
  body: JSON.stringify({ 
    id: catData.id,
    name: catData.name,
    icon: catData.icon,
    description: `Premium ${catData.name}`
  }),
});

    const data = await response.json();
    
    if (data.success) {
      setCategories(prev => [...prev, data.category]);
      setMessage({ type: "success", text: `${catData.name} added successfully!` });
    } else {
      setMessage({ type: "error", text: data.error || "Failed to add category" });
    }
  } catch (error) {
    setMessage({ type: "error", text: "Connection error. Is the server running?" });
  }
};

const handleDeleteCategory = async (mongoId: string) => {
  // If the ID is the literal string "ObjectId", we can't delete via API easily
  if (mongoId === "ObjectId") {
    alert("This is a corrupted document. Please delete it manually in MongoDB Atlas/Compass.");
    return;
  }

  if (!confirm("Delete this category?")) return;

  const ADMIN_TOKEN = "your_secure_admin_token_123";

  try {
    const response = await fetch(`https://clientkanishka.onrender.com/api/admin/categories/${mongoId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${ADMIN_TOKEN}` }
    });

    if (response.ok) {
      setCategories(prev => prev.filter(c => (c as any)._id !== mongoId));
      setMessage({ type: "success", text: "Category removed." });
    }
  } catch (error) {
    setMessage({ type: "error", text: "Delete request failed." });
  }
};
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Product Management</h1>
          <p className="text-muted-foreground">Manage all your products in one place</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-card rounded-xl p-4 border border-border/50">
            <p className="text-muted-foreground text-sm mb-1">Total Products</p>
            <p className="text-3xl font-bold text-foreground">{products.length}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/50">
            <p className="text-muted-foreground text-sm mb-1">Categories</p>
            <p className="text-3xl font-bold text-foreground">{categories.length}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/50">
            <p className="text-muted-foreground text-sm mb-1">Filtered Results</p>
            <p className="text-3xl font-bold text-foreground">{filteredProducts.length}</p>
          </div>
        </motion.div>

        {/* Message Alert */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {message.type === "success" ? <Check size={20} /> : <AlertCircle size={20} />}
              <p className="font-body text-sm">{message.text}</p>
              <button
                onClick={() => setMessage(null)}
                className="ml-auto text-sm underline"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-cta text-cta-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            Add New Product
          </button>

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-cta"
          />

          <select
            value={filterCategory || ""}
            onChange={(e) => setFilterCategory(e.target.value || null)}
            className="px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-cta"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
              <Loader className="text-cta" size={40} />
            </motion.div>
          </div>
        )}
        <div className="mb-12 bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-bold text-foreground">Live Categories</h2>
    <button 
  type="button" // Force it not to submit a form
  onClick={(e) => {
    e.preventDefault(); // Stop any parent form from reloading
    console.log("Button clicked!"); // 1. DEBUG LOG

    const name = prompt("Category Name (e.g. Hair Clips)");
    if (!name) return;

    const icon = prompt("Icon Emoji (e.g. ✦)");
    if (!icon) return;

    const id = name.toLowerCase().trim().replace(/\s+/g, '-');
    
    console.log("Data collected:", { name, id, icon }); // 2. DEBUG LOG

    // This MUST match the function name exactly
    handleAddCategory({ name, id, icon });
  }}
  className="text-sm bg-cta text-cta-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90"
>
  + Quick Add Category
</button>
  </div>
  
  <div className="flex flex-wrap gap-4">
    {categories.map((cat: any) => (
      <div 
        key={cat._id || cat.id} 
        className="flex items-center gap-3 bg-background border border-border p-3 rounded-xl group hover:border-cta/50 transition-colors"
      >
        <span className="text-xl">{cat.icon}</span>
        <div>
          <p className="font-bold text-sm">{cat.name}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{cat.productCount || 0} Products</p>
        </div>
        <button 
          onClick={() => handleDeleteCategory(cat._id)}
          className="ml-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={14} />
        </button>
      </div>
    ))}
  </div>
</div>

        {/* Products Table */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border/50">
                  <tr className="text-left">
                    <th className="px-6 py-4 font-semibold text-foreground">Product</th>
                    <th className="px-6 py-4 font-semibold text-foreground">Category</th>
                    <th className="px-6 py-4 font-semibold text-foreground">Price</th>
                    <th className="px-6 py-4 font-semibold text-foreground">Stock</th>
                    <th className="px-6 py-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Replace the content inside <tbody> with this: */}
{filteredProducts.length === 0 ? (
  <tr>
    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
      No products found
    </td>
  </tr>
) : (
  filteredProducts.map((product, i) => {
    // 1. Extract the MongoDB _id (since your backend uses _id)
    const mongoId = (product as any)._id || (product as any).id;
    
    // 2. Safely get the image URL from the nested object { url: "..." }
    const imageUrl = typeof product.image === 'object' 
      ? (product.image as any).url 
      : product.image;

    return (
      <motion.tr
        key={mongoId}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05 }}
        className="border-b border-border/30 hover:bg-secondary/30 transition-colors"
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-10 h-10 rounded object-cover bg-secondary"
            />
            <div>
              <p className="font-semibold text-foreground text-sm">{product.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {product.description}
              </p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-foreground">
          {categories.find(c => c.id === product.category)?.name || product.category}
        </td>
        <td className="px-6 py-4 font-semibold text-cta">{product.price}</td>
        <td className="px-6 py-4 text-sm text-foreground">
          {product.stock !== undefined ? product.stock : "—"}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditingProduct(product)} // Pass whole product for the form
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="Edit"
            >
              <Edit2 size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDeleteProduct(mongoId)} // Pass mongoId specifically
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </td>
      </motion.tr>
    );
  })
)}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {(showForm || editingProduct) && (
      <ProductFormModal
  product={editingProduct}
  categories={categories}
  onSubmit={(formData: any) => {
    if (editingProduct) {
      // 1. In your DB, the unique key is _id
      // 2. We MUST use the string value, not the word "ObjectId"
      const mongoId = (editingProduct as any)._id;

      console.log("Attempting to update document with _id:", mongoId);

      if (!mongoId || mongoId === "ObjectId") {
        console.error("The _id is missing or incorrectly labeled in the state.");
        return;
      }

      handleUpdateProduct(mongoId, formData);
    } else {
      handleAddProduct(formData);
    }
  }}
  onClose={() => {
    setShowForm(false);
    setEditingProduct(null);
  }}
/>
        )}
      </AnimatePresence>
    </div>
  );
};

// Product Form Modal Component
const ProductFormModal = ({ product, categories, onSubmit, onClose }: any) => {
  const [form, setForm] = useState<Partial<Product>>(
    product || {
      name: "",
      price: "",
      category: categories[0]?.id || "",
      description: "",
      didYouKnow: "",
      image: "",
      stock: 100,
    }
  );
  const [uploading, setUploading] = useState(false);

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    // 1. Ensure this matches your UNSIGNED preset name exactly
    formData.append("upload_preset", "glamgrip"); 
    formData.append("folder", "glam-grip");

    const response = await fetch(
      // 2. CHANGE 'glamgrip' TO 'dzda5ucp5' HERE
      "https://api.cloudinary.com/v1_1/dzda5ucp5/image/upload", 
      { 
        method: "POST", 
        body: formData,
        headers: {} // Keep this empty to avoid injecting keys
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    setForm({ ...form, image: data.secure_url });
    console.log("Upload Success:", data.secure_url);

  } catch (error: any) {
    console.error("Cloudinary Error:", error.message);
    alert(`Upload failed: ${error.message}`); 
  } finally {
    setUploading(false);
  }
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  // ... rest of your return JSX code remains the same

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 p-6 border-b border-border/50 bg-card flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Product Image</label>
            <div className="flex items-center gap-4">
              {form.image && (
                <img src={form.image} alt="preview" className="w-20 h-20 rounded-lg object-cover" />
              )}
              <label className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-cta transition-colors">
                <Upload size={20} />
                <span className="text-sm font-medium">
                  {uploading ? "Uploading..." : "Click to upload image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  hidden
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Product Name</label>
            <input
              type="text"
              required
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-cta"
              placeholder="e.g., Elegant Fish Claw Clip"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
              <select
                required
                value={form.category || ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-cta"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Price</label>
              <input
                type="text"
                required
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-cta"
                placeholder="e.g., Rs. 50/pack"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
            <textarea
              required
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-cta resize-none"
              placeholder="Describe the product..."
            />
          </div>

          {/* Did You Know */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Did You Know?</label>
            <textarea
              required
              value={form.didYouKnow || ""}
              onChange={(e) => setForm({ ...form, didYouKnow: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-cta resize-none"
              placeholder="Interesting fact about the product..."
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Stock</label>
            <input
              type="number"
              value={form.stock || 0}
              onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-cta"
              min="0"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-border/50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 bg-cta text-cta-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {product ? "Update Product" : "Add Product"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="flex-1 bg-card border border-border/50 text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/30 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminProductsPanel;