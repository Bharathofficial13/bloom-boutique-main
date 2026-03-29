import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import type { Testimonial } from "@/data/products";

const Testimonials = () => {
  // 1. Start with an empty array instead of defaultTestimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const waitingOffset = isMobile 
    ? { x: 40, y: 70, scale: 0.95, opacity: 1 } 
    : { x: 110, y: 120, scale: 0.9, opacity: 1 };

  // 2. Modified Sync Logic (No default fallbacks)
  useEffect(() => {
    const syncTestimonials = () => {
      try {
        const stored = localStorage.getItem("glamgrip_testimonials");
        if (stored) {
          const parsed = JSON.parse(stored) as Testimonial[];
          if (parsed.length > 0) {
            setTestimonials(parsed);
          }
        }
      } catch (error) {
        console.error("Failed to load testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    syncTestimonials();
    window.addEventListener("storage", syncTestimonials);
    return () => window.removeEventListener("storage", syncTestimonials);
  }, []);

  // 3. Auto-play logic (only runs if we have items)
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Handle Empty State
  if (loading) return null; // Or a small spinner
  if (testimonials.length === 0) return null; // Hide section if no reviews exist

  const t = testimonials[current];
  const nextT = testimonials[(current + 1) % testimonials.length];

  return (
    <section className="py-12 lg:py-32 bg-white relative overflow-hidden" id="testimonials">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-start lg:items-center">
          
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <div>
              <span className="text-[12px] lg:text-[14px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 lg:mb-4 block">
                Testimonials
              </span>
              <h2 className="text-4xl lg:text-6xl font-black text-[#1a233a] leading-[1.2] lg:leading-[1.1] tracking-tight">
                What People Say <br className="hidden lg:block" /> About Us.
              </h2>
            </div>
            
            {/* Dots Navigation */}
            <div className="flex justify-center lg:justify-start gap-3 lg:gap-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 lg:h-3 rounded-full transition-all duration-300 ${
                    i === current ? "w-8 bg-[#1a233a]" : "w-2 lg:w-3 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative flex items-start justify-center lg:justify-start min-h-[480px] lg:min-h-[550px] mt-10 lg:mt-0">
            
            {/* BACKGROUND CARD (Next item in queue) */}
            {testimonials.length > 1 && (
                <div 
                style={{ 
                    transform: `translate(${waitingOffset.x}px, ${waitingOffset.y}px) scale(${waitingOffset.scale})`,
                    width: '100%',
                    maxWidth: isMobile ? '340px' : '550px'
                }}
                className="absolute top-0 bg-white rounded-[24px] p-8 lg:p-10 border border-gray-300 shadow-sm z-0 flex flex-col justify-end opacity-40 transition-transform duration-500 min-h-[280px] lg:min-h-[300px]"
                >
                <h4 className="text-[17px] lg:text-[19px] font-bold text-black-800 tracking-tight">{nextT.name}</h4>
                <p className="text-[11px] lg:text-[13px] font-bold text-black-400 uppercase tracking-wider">{nextT.location}</p>
                </div>
            )}

            {/* ACTIVE CARD */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={t.id || current}
                initial={{ 
                  opacity: 0, 
                  x: waitingOffset.x, 
                  y: waitingOffset.y, 
                  scale: waitingOffset.scale 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  y: 0, 
                  scale: 1,
                  zIndex: 10 
                }}
                exit={{ 
                  opacity: 0, 
                  x: isMobile ? 0 : -100,
                  y: isMobile ? -20 : 0, 
                  transition: { duration: 0.3 } 
                }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                style={{ width: '100%', maxWidth: isMobile ? '340px' : '550px' }}
                className="relative bg-white rounded-[24px] p-8 lg:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-gray-50 min-h-[280px] lg:min-h-[300px] flex flex-col"
              >
                <div className="absolute -top-8 -left-4 lg:-top-10 lg:-left-10">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-[4px] lg:border-[6px] border-white shadow-xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-[4px] lg:border-[6px] border-white bg-gray-200 shadow-xl flex items-center justify-center text-[#1a233a] font-bold text-xl">
                        {t.name.charAt(0)}
                    </div>
                  )}
                </div>

                <p className="text-[14px] lg:text-[16px] text-gray-500 leading-[1.6] lg:leading-[1.8] font-medium mb-8 lg:mb-12 italic">
                  "{t.review}"
                </p>

                <div className="mt-auto">
                  <h4 className="text-[18px] lg:text-[20px] font-black text-[#1a233a] tracking-tight">{t.name}</h4>
                  <p className="text-[12px] lg:text-[13px] font-bold text-gray-400 uppercase tracking-wider">{t.location}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* NAVIGATION - Only show if more than 1 testimonial */}
            {testimonials.length > 1 && (
                <div className="absolute -bottom-16 lg:bottom-auto lg:right-[-60px] flex lg:flex-col gap-8 lg:gap-10 text-gray-400 z-30">
                <button onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)} className="hover:text-[#1a233a] transition-colors"><ChevronUp size={28} /></button>
                <button onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)} className="hover:text-[#1a233a] transition-colors"><ChevronDown size={28} /></button>
                </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;