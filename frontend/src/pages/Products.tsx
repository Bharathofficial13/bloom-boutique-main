import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Search, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { categories as staticCategories } from "@/data/products"; // Fallback categories
import type { Product } from "@/data/products";
import ProductModal from "@/components/ProductModal";
import OrderFormModal from "@/components/OrderFormModal";

const PRODUCTS_PER_PAGE = 20;

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { data: catData } = useQuery({
  queryKey: ["categories"],
  queryFn: async () => {
    const response = await fetch("https://clientkanishka.onrender.com/api/categories");
    const json = await response.json();
    return json.categories || [];
  }
});

const categories = catData || [];

  // 1. Fetch products from your Node.js Backend
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { page: currentPage, category: activeCategory, search: searchTerm }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: PRODUCTS_PER_PAGE.toString(),
        ...(activeCategory && { category: activeCategory }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`https://clientkanishka.onrender.com/api/products?${params}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json(); // Expected: { success: true, products: [], pagination: {} }
    },
    placeholderData: (previousData) => previousData, // Smooth transitions
  });

  // 2. Prevent background scroll when modals are open
  useEffect(() => {
    document.body.style.overflow = selectedProduct || showOrderForm ? "hidden" : "unset";
  }, [selectedProduct, showOrderForm]);

  // Extract data with safety fallbacks
  const products = data?.products || [];
  const pagination = data?.pagination || { total: 0, pages: 1 };

  const handleCategoryChange = (catId: string | null) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Navbar />

      <main className="pt-24 pb-16 min-h-screen bg-background">
        <div className="container-main px-4">
          
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground">Our Products</h1>
            <p className="font-body text-muted-foreground mt-2">
              {isLoading ? "Fetching items..." : `Showing ${pagination.total} products • Page ${currentPage} of ${pagination.pages}`}
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-border/50 bg-card focus:ring-2 focus:ring-cta font-body text-sm"
            />
          </div>

          {/* Categories Slider */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6">
  <button
    onClick={() => handleCategoryChange(null)}
    className={`flex-shrink-0 px-6 py-3 rounded-full font-body text-sm font-semibold transition-all ${
      activeCategory === null ? "bg-foreground text-white shadow-lg" : "bg-card border border-border/50 text-foreground"
    }`}
  >
              All Products
           </button>
  {/* Map through DYNAMIC categories from DB */}
  {categories.map((cat: any) => (
    <button
      key={cat._id || cat.id}
      onClick={() => handleCategoryChange(cat.id)}
      className={`flex-shrink-0 px-6 py-3 rounded-full font-body text-sm font-semibold transition-all whitespace-nowrap ${
        activeCategory === cat.id ? "bg-foreground text-white shadow-lg" : "bg-card border border-border/50 text-foreground"
      }`}
    >
      {cat.icon} {cat.name}
    </button>
  ))}
</div>

          {/* Grid Logic */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="animate-spin text-cta mb-4" size={40} />
              <p className="font-body text-muted-foreground">Syncing with store...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-bold underline">Connection Failed</p>
              <p className="text-muted-foreground">Make sure your backend is running at localhost:5000</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-muted-foreground">No products found in this category.</p>
            </div>
          ) : (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <AnimatePresence mode="popLayout">
                {products.map((product: any) => (
                  <motion.div
                    key={product._id || product.id} // Backend uses _id
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-card rounded-2xl overflow-hidden border border-border/30 hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="aspect-square bg-secondary relative overflow-hidden">
                      {/* Note: product.image.url because of your Backend Schema */}
                      <img
                        src={product.image?.url || product.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading font-semibold text-foreground line-clamp-1">{product.name}</h3>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-cta font-bold text-sm">{product.price}</span>
                        <button 
                           onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); setShowOrderForm(true); }}
                           className="bg-cta text-white p-2 rounded-lg"
                        >
                          <ShoppingBag size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination Component */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 py-8">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border rounded-lg bg-card"><ChevronLeft /></button>
              <span className="flex items-center px-4 font-body font-bold text-sm">Page {currentPage} of {pagination.pages}</span>
              <button disabled={currentPage === pagination.pages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border rounded-lg bg-card"><ChevronRight /></button>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedProduct && !showOrderForm && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onOrder={() => setShowOrderForm(true)} />
        )}
        {selectedProduct && showOrderForm && (
          <OrderFormModal product={selectedProduct} onClose={() => { setShowOrderForm(false); setSelectedProduct(null); }} />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

// Internal Modals... (Use your previous Modal code here, just update image source to product.image?.url)

export default ProductsPage;  