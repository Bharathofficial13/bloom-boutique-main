import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Map, Navigation, Heart, Lightbulb } from "lucide-react";
import { products, howItWorks } from "@/data/products";

const BookProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 3 seconds for a snappier feel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentProduct = products[currentIndex];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Left: Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT SIDE: STEPS */}
          <div>
            <div className="mb-10">
              <span className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-4 block">
                Easy and Fast
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[#1a233a] leading-[1.1]">
                Book Your Glammies <br />
                In 3 Easy Steps
              </h2>
            </div>

            <div className="space-y-10">
              {howItWorks.map((step, idx) => {
                const Icons = [Send, Map, Navigation];
                const Icon = Icons[idx];
                
                return (
                  <div key={step.step} className="flex gap-5 items-start">
                    <div 
                      className="w-12 h-12 rounded-[15px] flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: step.color }}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[16px] text-gray-700 mb-1">
                        Step {step.step} – {step.title}
                      </h3>
                      <p className="text-[14px] text-gray-400 leading-relaxed max-w-[320px]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: THE EXACT CARD DESIGN */}
          <div className="relative flex justify-center lg:justify-end pr-0 lg:pr-12 mt-12 lg:mt-0">
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[80px] z-0" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                // Added flex-col so subcard stacks on mobile
                className="relative z-10 flex flex-col items-center sm:items-stretch bg-white rounded-[24px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-[800px] border border-gray-50"
              >
                {/* Product Image */}
                <div className="rounded-[20px] overflow-hidden aspect-video mb-5 w-full">
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="px-1 w-full">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    Try Our {currentProduct.name}
                  </h4>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-5">
                    <span>New arrival</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="font-medium text-gray-500">{currentProduct.price}</span>
                  </div>

                  {/* Icon Row */}
                  <div className="flex gap-3 mb-6">
                    <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      <Heart size={16} />
                    </div>
                    <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      <Map size={16} />
                    </div>
                    <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      <Navigation size={16} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Send size={14} className="rotate-[-25deg]" />
                      <span>24 people going</span>
                    </div>
                    <Heart size={18} className="text-blue-600 cursor-pointer" />
                  </div>
                </div>

                {/* --- FLOATING SUB-CARD (DID YOU KNOW) --- */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  /* CHANGES: 
                     - Mobile: position relative, margin-top 4, full width
                     - Desktop (sm:): absolute, right -20, bottom 16
                  */
                  className="relative mt-4 sm:mt-0 sm:absolute -right-10 sm:-right-20 sm:bottom-16 bg-white rounded-[18px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-50 flex gap-3 w-full max-w-[220px]"
                >
                  <div className="w-10 h-10 bg-yellow-400/10 rounded-full flex items-center justify-center shrink-0">
                    <Lightbulb size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter mb-1">
                      Did you know?
                    </p>
                    <p className="text-[12px] font-bold text-gray-800 leading-tight">
                      {currentProduct.didYouKnow || "Our products are eco-friendly."}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BookProducts;