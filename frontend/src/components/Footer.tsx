import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Heart } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "https://facebook.com/glamgrip" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/glamgrip" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com/glamgrip" },
  ];

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact Us", href: "#contact" },
  ];

  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16"
        >
          {/* Column 1: Branding */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="Glam Grip"
                className="h-10 w-auto brightness-0 invert"
              />
              <span className="font-bold font-heading text-lg">Glam Grip</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed font-body max-w-xs">
              Discover elegant clips, trendy keychains, and natural herbal soaps crafted to elevate your everyday lifestyle.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-primary-foreground/60">
              <span>Made with</span>
              <Heart size={14} className="fill-cta text-cta" />
              <span>in Trichy, Tamilnadu</span>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <h4 className="font-heading font-bold text-lg mb-6 text-primary-foreground">
              Quick Links
            </h4>
            <div className="space-y-3 flex-1 font-body text-sm">
              {quickLinks.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block text-primary-foreground/70 hover:text-cta transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => {
                      const el = document.querySelector(link.href);
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="block w-full text-left text-primary-foreground/70 hover:text-cta transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                )
              )}
            </div>
          </motion.div>

          {/* Column 3: Contact Info */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <h4 className="font-heading font-bold text-lg mb-6 text-primary-foreground">
              Contact
            </h4>
            <div className="space-y-3 font-body text-sm flex-1">
              <div>
                <p className="text-primary-foreground/50 text-xs uppercase tracking-wide mb-1">
                  Email
                </p>
                <a
                  href="mailto:glamgrip.in@gmail.com"
                  className="text-primary-foreground/70 hover:text-cta transition-colors duration-300"
                >
                  glamgrip.in@gmail.com
                </a>
              </div>
              <div>
                <p className="text-primary-foreground/50 text-xs uppercase tracking-wide mb-1">
                  Location
                </p>
                <p className="text-primary-foreground/70">Trichy, Tamilnadu</p>
              </div>
              <div>
                <p className="text-primary-foreground/50 text-xs uppercase tracking-wide mb-1">
                  Hours
                </p>
                <p className="text-primary-foreground/70">Mon - Fri: 10am - 6pm</p>
              </div>
            </div>
          </motion.div>

          {/* Column 4: Social & Newsletter */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <h4 className="font-heading font-bold text-lg mb-6 text-primary-foreground">
              Discover Us On
            </h4>
            <div className="flex gap-3 mb-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-cta transition-colors duration-300 text-primary-foreground hover:text-foreground"
                  aria-label={label}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="mt-auto">
              <p className="text-xs uppercase tracking-wide text-primary-foreground/50 mb-3">
                Subscribe to our updates
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thanks for subscribing!");
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 text-xs focus:outline-none focus:ring-2 focus:ring-cta transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-cta text-foreground font-bold rounded-lg text-xs hover:bg-cta/90 transition-colors duration-300"
                >
                  Go
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-primary-foreground/10 mb-8" />
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-foreground/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-body">
            {/* Copyright */}
            <div className="text-primary-foreground/60 text-center sm:text-left">
              <p>
                © {currentYear} <span className="font-bold text-primary-foreground">Glam Grip</span>. All rights reserved.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-6 text-primary-foreground/60 text-xs">
              <a
                href="#"
                className="hover:text-cta transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-cta transition-colors duration-300"
              >
                Terms & Conditions
              </a>
              <a
                href="#"
                className="hover:text-cta transition-colors duration-300"
              >
                Sitemap
              </a>
            </div>

            {/* Development Credit */}
            <div className="text-primary-foreground/60 text-xs">
              <p>
                Crafted with <span className="text-cta">❤️</span> for your glammies
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-cta text-foreground flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 z-40"
        aria-label="Scroll to top"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ↑
        </motion.div>
      </motion.button>
    </footer>
  );
};

export default Footer;