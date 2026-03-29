import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, User, MapPin, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";

interface ContactFormProps {
  prefilledProduct?: string;
}

const ContactForm = ({ prefilledProduct }: ContactFormProps) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    whatsapp: "",
    address: "",
    products: prefilledProduct || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.mobile.trim()) errs.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, ""))) errs.mobile = "Enter a valid 10-digit number";
    if (form.whatsapp && !/^\d{10}$/.test(form.whatsapp.replace(/\s/g, ""))) errs.whatsapp = "Enter a valid 10-digit number";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.products.trim()) errs.products = "Please mention the products";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    try {
      // Store order locally and create mailto link
      const orders = JSON.parse(localStorage.getItem("glamgrip_orders") || "[]");
      const order = { ...form, id: crypto.randomUUID(), date: new Date().toISOString() };
      orders.push(order);
      localStorage.setItem("glamgrip_orders", JSON.stringify(orders));

      // Open mailto for admin notification
      const subject = encodeURIComponent(`New Glam Grip Order from ${form.name}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nMobile: ${form.mobile}\nWhatsApp: ${form.whatsapp || form.mobile}\nAddress: ${form.address}\n\nProducts:\n${form.products}`
      );
      window.open(`mailto:glamgrip.in@gmail.com?subject=${subject}&body=${body}`, "_blank");

      setStatus("success");
      setForm({ name: "", email: "", mobile: "", whatsapp: "", address: "", products: prefilledProduct || "" });
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (status === "success") {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card rounded-2xl p-8 text-center border border-border/30 shadow-lg">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
        <h3 className="font-heading text-2xl font-bold text-foreground">Order Placed!</h3>
        <p className="font-body text-muted-foreground mt-2">We'll contact you within 24 hours to confirm your order.</p>
        <button onClick={() => setStatus("idle")} className="mt-6 font-body text-sm text-cta font-semibold underline">
          Place another order
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 sm:p-8 border border-border/30 shadow-lg space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <InputField icon={<User size={16} />} label="Your Name" value={form.name} onChange={(v) => handleChange("name", v)} error={errors.name} placeholder="John Doe" />
        <InputField icon={<Mail size={16} />} label="Your Email" value={form.email} onChange={(v) => handleChange("email", v)} error={errors.email} placeholder="john@example.com" type="email" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <InputField icon={<Phone size={16} />} label="Mobile No" value={form.mobile} onChange={(v) => handleChange("mobile", v)} error={errors.mobile} placeholder="9876543210" />
        <InputField icon={<MessageSquare size={16} />} label="WhatsApp No" value={form.whatsapp} onChange={(v) => handleChange("whatsapp", v)} error={errors.whatsapp} placeholder="Same as mobile (optional)" />
      </div>
      <InputField icon={<MapPin size={16} />} label="Address" value={form.address} onChange={(v) => handleChange("address", v)} error={errors.address} placeholder="Your delivery address" />
      <div>
        <label className="font-body text-sm font-medium text-foreground mb-1 block">Product Interest/Details</label>
        <textarea
          value={form.products}
          onChange={(e) => handleChange("products", e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="1. Hair clips&#10;2. Keychains"
        />
        {errors.products && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.products}</p>}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-cta text-cta-foreground font-body font-semibold py-3 rounded-lg text-sm disabled:opacity-60 transition-opacity"
      >
        {status === "sending" ? "Submitting..." : "Book Now"}
      </motion.button>
      {status === "error" && <p className="text-xs text-destructive text-center">Something went wrong. Please try again.</p>}
    </form>
  );
};

const InputField = ({ icon, label, value, onChange, error, placeholder, type = "text" }: {
  icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; error?: string; placeholder: string; type?: string;
}) => (
  <div>
    <label className="font-body text-sm font-medium text-foreground mb-1 block">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-3 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder={placeholder}
      />
    </div>
    {error && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
  </div>
);

export default ContactForm;
