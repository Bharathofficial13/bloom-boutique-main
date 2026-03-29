import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Send, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import decoreSpring from "@/assets/Decore2.png";
import OrderFormModal from "@/components/OrderFormModal"; // Ensure path is correct

// Types matching your MongoDB Schema
interface Category {
  _id: string;
  id: string;
  name: string;
  icon?: string;
}

interface Product {
  _id: string;
  name: string;
  price: string;
  category: string;
  image: {
    url: string;
    cloudinaryId?: string;
  };
}

const ProductCarousel = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // --- Modal State ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // 1. FETCH DATA FROM DATABASE
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const catRes = await fetch("https://clientkanishka.onrender.com/api/categories");
        const catData = await catRes.json();
        const prodRes = await fetch("https://clientkanishka.onrender.com/api/products?limit=50");
        const prodData = await prodRes.json();

        if (catData.success) {
          setCategories(catData.categories);
          if (catData.categories.length > 0) {
            setActiveCategory(catData.categories[0].id);
          }
        }
        if (prodData.success) {
          setProducts(prodData.products);
        }
      } catch (error) {
        console.error("Failed to load products from DB:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, []);

  const filteredProducts = products.filter((p) => p.category === activeCategory);

  const handleCategoryScroll = (dir: "left" | "right") => {
    if (categoryScrollRef.current) {
      const amount = 120;
      const multiplier = dir === "left" ? -1 : 1;
      categoryScrollRef.current.scrollBy({ left: amount * multiplier, behavior: "smooth" });
    }
  };

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section className="relative py-12 lg:py-20 bg-white overflow-hidden" id="products-section">
      <div className="max-w-7xl mx-auto px-4 relative z-20">
        
        {/* HEADER & CATEGORY NAV */}
        <div className="flex flex-col items-center mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">
            Top Selling
          </span>

          <div className="flex items-center w-full max-w-lg justify-between border-b border-gray-100 pb-3 px-2">
            <button onClick={() => handleCategoryScroll("left")} className="text-gray-900 z-30 hover:scale-110 transition-transform">
              <ChevronLeft size={22} />
            </button>

            <div ref={categoryScrollRef} className="flex items-center gap-6 overflow-x-auto no-scrollbar px-4 scroll-smooth">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 text-[13px] font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat.id ? "text-[#1a233a]" : "text-gray-300 hover:text-gray-500"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <button onClick={() => handleCategoryScroll("right")} className="text-gray-900 z-30 hover:scale-110 transition-transform">
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* PRODUCT CAROUSEL */}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-10 scroll-smooth min-h-[350px]">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-shrink-0 w-[220px] sm:w-[260px] snap-center relative"
                >
                  {index === filteredProducts.length - 1 && (
                    <div className="absolute -right-16 top-1/2 -translate-y-1/2 z-[-1] opacity-30 pointer-events-none">
                      <img src={decoreSpring} alt="" className="h-40 sm:h-56 w-auto object-contain" />
                    </div>
                  )}

                  <div className="bg-white rounded-[24px] overflow-hidden border border-gray-50 shadow-sm hover:shadow-lg transition-all group z-10">
                    <div className="aspect-square overflow-hidden bg-[#fcfcfc]">
                      <img
                        src={product.image?.url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="text-[12px] font-bold text-[#1a233a] truncate uppercase tracking-tight mb-4">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                        {/* CHANGED FROM Link TO button */}
                        <button
                          onClick={() => handleOrderClick(product)}
                          className="flex items-center gap-1.5 text-[10px] font-black text-gray-900 uppercase hover:text-orange-500 transition-colors"
                        >
                          <Send size={11} className="rotate-[-25deg]" />
                          Order Now
                        </button>

                        <span className="text-[11px] font-black text-[#1a233a] bg-gray-50 px-2 py-1 rounded-md">
                          Rs.{product.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="w-full text-center py-20 text-gray-300 text-sm italic">
                No products found in this category.
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* EXPLORE MORE BUTTON */}
        <div className="flex justify-center mt-6">
          <Link
            to="/products"
            className="group flex items-center gap-3 bg-[#1a233a] text-white px-8 py-4 rounded-full text-[13px] font-bold tracking-widest uppercase hover:bg-orange-500 transition-all duration-300 shadow-xl shadow-gray-200"
          >
            Explore More Products
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* --- ORDER MODAL COMPONENT --- */}
      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <OrderFormModal 
            product={selectedProduct} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ProductCarousel;