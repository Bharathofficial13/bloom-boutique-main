import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductFeatures from "@/components/ProductFeatures";
import ProductCarousel from "@/components/ProductCarousel";
import BookProducts from "@/components/BookProducts";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <ProductFeatures />
      <ProductCarousel />
      <BookProducts />
      <Testimonials />
      <section className="section-padding bg-secondary/30" id="contact">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Contact us to Book your glammies<br />from Glam Grip
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Index;
