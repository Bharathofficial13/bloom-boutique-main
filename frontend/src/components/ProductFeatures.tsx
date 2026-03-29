import { motion } from "framer-motion";
import { productFeatures } from "@/data/products";

// Assets
import hairClipIcon from "@/assets/hariband.png";
import keychainIcon from "@/assets/keyblue.png";
import soapIcon from "@/assets/bluesoap.png";
import gearIcon from "@/assets/powersupply.png";
import redDecoration from "@/assets/recrred.png";
import yellowBg from "@/assets/recblue.png"; // This is your yellow-ish decor

const featureIconMap = {
  0: hairClipIcon,
  1: keychainIcon,
  2: soapIcon,
  3: gearIcon,
};

/** * TWEAK THESE VALUES TO MOVE THE YELLOW BACKGROUNDS 
 * Negative values move Left/Up, Positive values move Right/Down
 */
const yellowOffsets = {
  0: { x: "17px", y: "25px", scale: 0.8 },  // Hair Clips
  1: { x: "-20px", y: "-25px",  scale: 0.8 },  // Keychains
  2: { x: "20px",  y: "-25px", scale: 0.8 },  // Soaps
  3: { x: "17px", y: "25px", scale: 0.7 }, // Essentials
};

const ProductFeatures = () => {
  return (
    <section className="relative py-16 lg:py-24 bg-white overflow-hidden">
      
      {/* Decorative background plus symbols */}
      <div className="absolute top-10 right-6 lg:right-10 hidden sm:flex flex-col gap-2 pointer-events-none opacity-30">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4">
            {[...Array(3)].map((_, j) => (
              <span key={j} className="text-xl font-light text-gray-300">+</span>
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 lg:mb-20">
          <p className="text-[12px] lg:text-[14px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Products</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1a233a]">We Offer Best Products</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
          {productFeatures.map((feature, index) => {
            const offset = yellowOffsets[index as keyof typeof yellowOffsets];

            return (
              <div key={feature.title} className="relative group">
                
                {/* RED DECORATION - Strictly behind Keychains */}
                {index === 1 && (
                  <motion.div 
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-6 -bottom-8 lg:-left-10 lg:-bottom-12 w-24 h-24 lg:w-32 lg:h-32 z-0 pointer-events-none opacity-90"
                  >
                    <img src={redDecoration} alt="" className="w-full h-full object-contain" />
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ y: -15, scale: 1.02 }}
                  className={`relative p-8 lg:p-10 rounded-[30px] lg:rounded-[40px] transition-all duration-500 flex flex-col items-center text-center h-full z-10
                    ${index === 1 ? 'bg-white shadow-xl' : 'bg-transparent hover:bg-white hover:shadow-lg'}`}
                >
                  {/* ICON CONTAINER */}
                  <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                    
                    {/* YELLOW BACKGROUND - Individually Controllable */}
                    <motion.img 
                      src={yellowBg} 
                      alt="" 
                      style={{ 
                        x: offset.x, 
                        y: offset.y, 
                        scale: offset.scale 
                      }}
                      className="absolute inset-0 w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" 
                    />

                    {/* MAIN PRODUCT ICON */}
                    <img
                      src={featureIconMap[index as keyof typeof featureIconMap]}
                      alt={feature.title}
                      className="relative w-22 h-22 object-contain z-10"
                    />
                  </div>

                  <h3 className="text-xl lg:text-[22px] font-bold text-[#1a233a] mb-4">{feature.title}</h3>
                  <p className="text-gray-500 text-sm lg:text-[15px] leading-relaxed max-w-[220px]">{feature.description}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductFeatures;