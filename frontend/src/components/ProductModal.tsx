
import { motion } from "framer-motion";
import { X } from "lucide-react";
const ProductModal = ({ product, onClose, onOrder }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-card rounded-3xl w-full shadow-2xl relative overflow-hidden
                   max-w-[90%] sm:max-w-[400px] lg:max-w-[360px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-foreground/50 text-white backdrop-blur-md flex items-center justify-center hover:bg-foreground transition-colors"
        >
          <X size={16} />
        </button>

        {/* Handle both Backend URL and Static Import */}
        <div className="aspect-square bg-muted">
          <img 
            src={product.image?.url || product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="p-6">
          <h3 className="font-heading text-xl font-bold text-foreground leading-tight">{product.name}</h3>
          <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-3">
            {product.description || "No description available for this premium item."}
          </p>

          {product.didYouKnow && (
            <div className="mt-4 p-3 bg-accent/5 rounded-xl border border-accent/10">
              <p className="text-[10px] font-bold text-accent uppercase tracking-wider">💡 Did you know?</p>
              <p className="text-xs text-muted-foreground mt-1">{product.didYouKnow}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <span className="font-body text-lg font-bold text-cta">{product.price}</span>
            <button
              onClick={onOrder}
              className="bg-cta text-white font-body text-sm font-semibold px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
            >
              Order Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default ProductModal;