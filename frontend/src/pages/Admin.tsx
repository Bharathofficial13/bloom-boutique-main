import { useState, useEffect } from "react";
import { Star, Trash2, Plus } from "lucide-react";
import type { Testimonial } from "@/data/products";

const AdminPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState({ name: "", location: "", rating: 5, review: "", image: "" });
  const [orders, setOrders] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("glamgrip_testimonials");
      if (stored) setTestimonials(JSON.parse(stored));
      const storedOrders = localStorage.getItem("glamgrip_orders");
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    } catch {}
  }, []);

  const save = (updated: Testimonial[]) => {
    setTestimonials(updated);
    localStorage.setItem("glamgrip_testimonials", JSON.stringify(updated));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.review) return;
    const newT: Testimonial = { ...form, id: crypto.randomUUID() };
    save([...testimonials, newT]);
    setForm({ name: "", location: "", rating: 5, review: "", image: "" });
  };

  const handleDelete = (id: string) => save(testimonials.filter((t) => t.id !== id));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((p) => ({ ...p, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Admin Panel — Glam Grip</h1>

        {/* Add testimonial */}
        <div className="bg-card rounded-2xl p-6 border border-border/30 shadow-sm mb-8">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus size={20} /> Add Testimonial
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name *" className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
              <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location" className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body text-sm text-foreground">Rating:</span>
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r} type="button" onClick={() => setForm((p) => ({ ...p, rating: r }))}>
                  <Star size={20} className={r <= form.rating ? "fill-accent text-accent" : "text-border"} />
                </button>
              ))}
            </div>
            <textarea value={form.review} onChange={(e) => setForm((p) => ({ ...p, review: e.target.value }))} placeholder="Review *" rows={3} className="w-full rounded-lg border border-input bg-background px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" required />
            <div>
              <label className="font-body text-sm text-foreground">Photo (optional)</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 block w-full font-body text-sm" />
            </div>
            <button type="submit" className="bg-cta text-cta-foreground font-body font-semibold px-6 py-3 rounded-lg text-sm">
              Add Testimonial
            </button>
          </form>
        </div>

        {/* List testimonials */}
        <div className="bg-card rounded-2xl p-6 border border-border/30 shadow-sm mb-8">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Added Testimonials ({testimonials.length})</h2>
          {testimonials.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No testimonials added yet.</p>
          ) : (
            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.id} className="flex items-start gap-4 bg-secondary/50 rounded-xl p-4">
                  {t.image && <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-body font-semibold text-sm">{t.name}</span>
                      <span className="font-body text-xs text-muted-foreground">{t.location}</span>
                    </div>
                    <div className="flex gap-0.5 my-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < t.rating ? "fill-accent text-accent" : "text-border"} />
                      ))}
                    </div>
                    <p className="font-body text-sm text-muted-foreground">{t.review}</p>
                  </div>
                  <button onClick={() => handleDelete(t.id)} className="text-destructive hover:text-destructive/80" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="bg-card rounded-2xl p-6 border border-border/30 shadow-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {orders.map((o, i) => (
                <div key={i} className="bg-secondary/50 rounded-xl p-4 font-body text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{o.name}</span>
                    <span className="text-xs text-muted-foreground">{o.date ? new Date(o.date).toLocaleDateString() : ""}</span>
                  </div>
                  <p className="text-muted-foreground mt-1">{o.mobile} • {o.email}</p>
                  <p className="text-muted-foreground">{o.products}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
