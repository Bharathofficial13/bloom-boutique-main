import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Assets
import heroGirl from "@/assets/hero-girl.png";
import orbSoap from "@/assets/orb (3).png";
import orbKeychain from "@/assets/orb (2).png";
import orbClips from "@/assets/orb (4).png";
import orbBow from "@/assets/orb.png";
import decoreCloud from "@/assets/decore.png"; // <--- Your new asset

// Creating a perfect circle pattern
const items = [orbSoap, orbKeychain, orbClips, orbBow, orbSoap, orbKeychain, orbClips, orbBow];

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isMobile) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen flex items-center overflow-hidden bg-white"
    >
      {/* --- THE DECORE.PNG BACKGROUND --- */}
      <div className="absolute right-0 top-0 h-full w-[60%]  pointer-events-none">
        <img 
          src={decoreCloud} 
          alt="background decor" 
          className="h-full w-full object-cover object-left" 
        />
      </div>

      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 items-center h-full relative z-10">
        
        {/* --- LEFT CONTENT --- */}
        <div className="max-w-xl z-30">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#e07a3f] mt-20 lg:mb-4 block">
            Best Accessories Around The World
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight text-[#1a233a]">
            Experience the <br />
            <span className="relative inline-block">
              power of Glammies’s
              <svg className="absolute -bottom-2 left-0 w-full h-4 text-orange-400/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 7 Q 30 0, 60 7 T 100 7" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round" />
              </svg>
            </span> <br />
            Touch
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-sm">
            Discover elegant clips, trendy keychains, and natural herbal soaps crafted to elevate your everyday lifestyle.
          </p>
          <div className="mt-8">
            <Link to="/products" className="bg-[#f0a500] hover:bg-[#d99600] text-white px-8 py-3.5 rounded-xl shadow-lg inline-block font-bold transition-all hover:scale-105 active:scale-95">
              Find out more
            </Link>
          </div>
        </div>

        {/* --- RIGHT SECTION --- */}
        <div className="relative h-full w-full flex items-center justify-end">
          
          {/* 1. THE ORBITING CIRCLE */}
          {/* This container is centered on the right side of the screen */}
          <motion.div 
            className="absolute left-[40%] bottom-[10%]  xl:left-[50%] xl:top-[20%] -translate-y-1/2 w-[600px] h-[600px] z-20 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            {items.map((src, i) => {
              const angle = (i * 360) / items.length;
              const radius = 355; // <--- This controls the size of the circle
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
                  }}
                >
                  <motion.img 
                    src={src} 
                    className="w-22 h-20 xl:w-40 xl:h-40 md:w-20 md:h-20 object-contain drop-shadow-2xl"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              );
            })}
          </motion.div>

          {/* 2. THE GIRL (Locked to Half-Face Edge) */}
          <motion.div
            className="absolute right-0 h-full flex items-center pointer-events-none z-10"
            animate={{
              x: !isMobile ? (mousePos.x * -15) : 0,
              y: !isMobile ? (mousePos.y * -10) : 0
            }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
          >
            <img
              src={heroGirl}
              alt="Model"
              className="xl:h-[90vh] w-auto max-w-none object-contain translate-x-[55%] translate-y-[-80%] xl:translate-x-[57%] xl:translate-y-[10%]" 
            />
            {/* ADJUSTMENT TIP: 
                - To move her further OFF screen: Increase 45% to 55%.
                - To move her more ON screen: Decrease 45% to 35%.
            */}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;