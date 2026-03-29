import clipElegant from "@/assets/clip-elegant.jpg";
import clipColorful from "@/assets/clip-colorful.jpg";
import clipTransparent from "@/assets/clip-transparent.jpg";
import soapProduct from "@/assets/soap-product.jpg";
import keychainProduct from "@/assets/keychain-product.jpg";
import soapDoodle from "@/assets/soap-doodle.jpg";
import keychainDoodle from "@/assets/keychain-doodle.jpg";

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  description: string;
  didYouKnow: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  image?: string;
}

export const categories = [
  { id: "hairclips", name: "Hairclips", icon: "✦" },
  { id: "keychains", name: "Keychains", icon: "🔑" },
  { id: "herbal-soaps", name: "Herbal Soaps", icon: "🧼" },
  { id: "lifestyle", name: "Lifestyle Essentials", icon: "✨" },
  
];

export const products: Product[] = [
  { id: "1", name: "Elegant Fish Claw Clip", price: "Rs. 50/pack", image: clipElegant, category: "hairclips", description: "Crafted for comfort, style, and long-lasting hold.", didYouKnow: "Hair clips reduce breakage by 60% compared to elastic ties!" },
 
  
  { id: "2", name: "Mickey Mouse Clip", price: "Rs. 50/pack", image: clipColorful, category: "hairclips", description: "Fun, colorful clips in 12 vibrant shades.", didYouKnow: "Colorful accessories can boost your mood by triggering dopamine!" },
  { id: "3", name: "Transparent Jelly Clip", price: "Rs. 50/pack", image: clipTransparent, category: "hairclips", description: "Trendy translucent clips for a modern, chic look.", didYouKnow: "Transparent accessories match every outfit effortlessly!" },
  { id: "4", name: "Evil Eye Keychain", price: "Rs. 50/pack", image: keychainProduct, category: "keychains", description: "Minimal yet eye-catching piece for everyday use.", didYouKnow: "The evil eye symbol is believed to protect against negative energy!" },
  { id: "5", name: "Heart Book Keychain", price: "Rs. 50/pack", image: keychainDoodle, category: "keychains", description: "Adorable heart keychain for book lovers.", didYouKnow: "Carrying a meaningful keychain can reduce stress by 15%!" },
  { id: "6", name: "Organic Herbal Soap", price: "Rs. 50/pack", image: soapProduct, category: "herbal-soaps", description: "Pure ingredients for healthy, glowing skin.", didYouKnow: "Herbal soaps retain 90% more natural glycerin than commercial ones!" },
  { id: "7", name: "Lavender Bar Soap", price: "Rs. 50/pack", image: soapDoodle, category: "herbal-soaps", description: "Hand-crafted with real lavender extracts.", didYouKnow: "Lavender has been used for over 2,500 years for its calming properties!" },
  { id: "8", name: "Fish Claw Dark", price: "Rs. 50/pack", image: clipElegant, category: "lifestyle", description: "Sleek dark-toned clip for professional settings.", didYouKnow: "Minimal accessories are trending up 300% in fashion searches!" },
];

export const defaultTestimonials: Testimonial[] = [
  { id: "1", name: "Priya", location: "Trichy, Tamilnadu", rating: 5, review: "I absolutely love the quality of the products. The clips are stylish and hold perfectly all day. Definitely my go-to store now!" },
  { id: "2", name: "Rajesh", location: "CEO of Best Buttons", rating: 5, review: "Great products with amazing quality. The keychains are unique and make perfect gifts. Highly recommended!" },
  { id: "3", name: "Ananya", location: "Chennai, Tamilnadu", rating: 4, review: "The herbal soaps are fantastic! My skin feels so much better. Love the natural ingredients." },
];

export const productFeatures = [
  { title: "Elegant Hair Clips", description: "Crafted for comfort, style, and long-lasting hold.", icon: "✦" },
  { title: "Designer Keychains", description: "Minimal yet eye-catching pieces for everyday use.", icon: "🔑" },
  { title: "Organic Herbal Soaps", description: "Pure ingredients for healthy, glowing skin.", icon: "🧼" },
  { title: "Lifestyle Essentials", description: "Carefully curated products for modern living.", icon: "✨" },
];

export const howItWorks = [
  { step: 1, title: "Browse Products", description: "Explore our collection of clips, keychains, soaps, and more.", color: "hsl(45, 100%, 51%)" },
  { step: 2, title: "Click Order Now", description: "Click on Order Now button on your favorite product.", color: "hsl(8, 85%, 56%)" },
  { step: 3, title: "Call and Book", description: "Give your phone number, name, and email. Our team will call you within 24 hrs.", color: "hsl(220, 40%, 13%)" },
];
