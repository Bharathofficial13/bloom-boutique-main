import { motion } from "framer-motion";
import { X } from "lucide-react";
import ContactForm from "@/components/ContactForm";
const OrderFormModal = ({ product, onClose }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-background rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b flex items-center justify-between bg-card sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
               <img src={product.image?.url || product.image} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
               <p className="text-[10px] text-muted-foreground uppercase font-bold">Booking Product</p>
               <h4 className="font-heading font-bold text-sm truncate">{product.name}</h4>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Form Body - Note the no-scrollbar class */}
        <div className="overflow-y-auto no-scrollbar flex-1">
          <ContactForm 
            prefilledProduct={`${product.name} (${product.price})`} 
            onSuccess={onClose} // Optional: Close modal after form submit
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
export default OrderFormModal;