"use client";

import FeaturedCategories from "@/components/ui/FeaturedCategories";
import { Sparkles, Heart, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/ui/HeroSection";
import { LookbookGrid } from "@/components/ui/LookbookGrid";
import { TestimonialBlock } from "@/components/ui/TestimonialBlock";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { ProductCard } from "@/components/ui/ProductCard";
import { FAQSection } from "@/components/ui/FAQSection";
import { GiftBuilderCarousel } from "@/components/ui/GiftBuilderCarousel";
import { TrustBanner } from "@/components/ui/TrustBanner";

export default function Home() {
  const lookbookItems = [
    {
      id: "lb1",
      title: "The Summer Solstice",
      client: "Summer Garden Party",
      imageUrl: "https://plus.unsplash.com/premium_photo-1664790560123-c5f839457591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c3VtbWVyJTIwd2VkZGluZ3xlbnwwfHx8fDE3NzQ0NTMyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      size: "2x2" as const,
    },
    {
      id: "lb2",
      title: "Midnight Noir",
      client: "Creative Launch Event",
      imageUrl: "https://plus.unsplash.com/premium_photo-1661315452408-ab1839e8d468?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bmlnaHQlMjBwYXJ0eXxlbnwwfHx8fDE3NzQ0NTMyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      size: "1x2" as const,
    },
    {
      id: "lb3",
      title: "Blush Romance",
      client: "Private Wedding",
      imageUrl: "https://plus.unsplash.com/premium_photo-1661593195819-5bad3a4daffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8cGluayUyMHJvbWFuY2V8ZW58MHx8fHwxNzc0NDUzMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      size: "1x1" as const,
    },
    {
      id: "lb4",
      title: "Gilded Era",
      client: "Luxury Gala",
      imageUrl: "https://plus.unsplash.com/premium_photo-1698529232673-19a1bda87a35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y2hhbXBhZ25lJTIwZ2FsYXxlbnwwfHx8fDE3NzQ0NTMyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      size: "1x1" as const,
    },
  ];

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <HeroSection
        type="full-bleed"
        headline="Unforgettable Impressions, Expertly Crafted."
        subheadline="Elevate your significant milestones with bespoke, artisanal favors designed to reflect your unique vision and leave a lasting legacy of appreciation."
        ctaText="Begin Personalizing"
        imageUrl="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069"
        onCtaClick={() => window.location.href = '/demo-builder'}
        secondaryCtaText="Explore Bestsellers"
        onSecondaryCtaClick={() => window.location.href = '#signature-collection'}
      />

      {/* Trust Banner - Added for immediate authority/social proof */}
      <TrustBanner />

      {/* Featured Curations - Moved UP for immediate conversion focus */}
      <section id="signature-collection" className="py-24 px-6 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4">
           <div>
             <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-accent-gold)] mb-3 block">
               Signature Collection
             </span>
             <h2 className="text-h2 font-serif text-[var(--color-text-primary)] mb-2">Renowned Favorites</h2>
             <p className="text-body-m text-[var(--color-text-secondary)] font-light italic">Meticulously curated pieces preferred by our most distinguished clients.</p>
           </div>
           <a href="/demo-builder" className="group flex items-center gap-3 text-ui font-medium uppercase tracking-widest text-sm luxury-transition hover:text-[var(--color-accent-gold)] mt-6 md:mt-0">
             <span>Explore Collection</span>
             <div className="w-10 h-px bg-[var(--color-text-tertiary)] group-hover:bg-[var(--color-accent-gold)] group-hover:w-16 luxury-transition" />
           </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 px-4">
          <ProductCard
            id="p1"
            title="Golden Hour Truffles"
            price={28.00}
            badge="Best Seller"
            primaryImage="/images/golden_truffles_1774452516961.png"
            hoverImage="/images/golden_truffles_hover_1774452609879.png"
          />
          <ProductCard
            id="p2"
            title="Signature Scent Candle"
            price={45.00}
            primaryImage="/images/signature_candle_1774452825856.png"
            hoverImage="/images/signature_candle_hover_1774452843163.png"
          />
          <ProductCard
            id="p3"
            title="Velvet Vow Box"
            price={85.00}
            badge="New Request"
            primaryImage="/images/velvet_vow_box_1774453073891.png"
            hoverImage="https://plus.unsplash.com/premium_photo-1739841781605-2f16957513b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dmVsdmV0JTIwcmluZyUyMGJveHxlbnwwfHx8fDE3NzQ0NTMzNDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
          />
          <ProductCard
            id="p4"
            title="Matte Onyx Flask"
            price={55.00}
            primaryImage="https://plus.unsplash.com/premium_photo-1673884221507-3cf36d88f92a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YmxhY2slMjBmbGFza3xlbnwwfHx8fDE3NzQ0NTMyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          />
        </div>
      </section>

      {/* GiftBuilder Carousel Preview - Moved UP for interactive engagement */}
      <div className="border-t border-[var(--color-border-subtle)]/50 pt-16">
        <GiftBuilderCarousel />
      </div>

      {/* Featured Categories */}
      <div className="border-t border-[var(--color-border-subtle)]/50 pt-16">
        <FeaturedCategories />
      </div>

      {/* Value Proposition Section - Revised for Trust and Professionalism */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto border-t border-[var(--color-border-subtle)]/50 mt-16">
        <div className="text-center mb-16">
           <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--color-text-tertiary)] mb-4 block">The Celebration Finds Standard</span>
           <h2 className="text-h2 font-serif text-[var(--color-text-primary)] mb-4">Uncompromising Quality & Service</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center border border-[var(--color-border-subtle)]">
              <ShieldCheck className="w-6 h-6 text-[var(--color-accent-gold)]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-h3 font-serif text-[var(--color-text-primary)] tracking-tight">Artisanal Craftsmanship</h3>
              <p className="text-body-m text-[var(--color-text-secondary)] leading-relaxed max-w-sm font-light">
                We believe excellence lies in the details. Each piece is meticulously assembled by hand using sustainably sourced, premium materials to ensure an unboxing experience that commands attention.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center border border-[var(--color-border-subtle)]">
              <Zap className="w-6 h-6 text-[var(--color-accent-gold)]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-h3 font-serif text-[var(--color-text-primary)] tracking-tight">Seamless Personalization</h3>
              <p className="text-body-m text-[var(--color-text-secondary)] leading-relaxed max-w-sm font-light">
                Our intuitive design studio bridges your vision with our execution. Specify hues, select premium fragrances, and engrave bespoke messages with absolute confidence and ease.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center border border-[var(--color-border-subtle)]">
              <Sparkles className="w-6 h-6 text-[var(--color-accent-gold)]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-h3 font-serif text-[var(--color-text-primary)] tracking-tight">Curated for Milestones</h3>
              <p className="text-body-m text-[var(--color-text-secondary)] leading-relaxed max-w-sm font-light">
                From executive corporate galas to exclusive private ceremonies, our collections are sophisticated accompaniments designed to elevate the ambiance of your most significant events.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Parallax Testimonial - Moved UP for Social Proof */}
      <TestimonialBlock
        quote="The precision and elegance of these favors exceeded our expectations entirely. Our guests were genuinely captivated by the presentation. Absolute perfection."
        author="Eleanor V."
        role="Event Director"
      />

      {/* Lookbook Grid Showcase */}
      <section className="py-24 bg-[var(--color-bg-secondary)]/30">
        <div className="text-center mb-16">
           <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--color-text-tertiary)] mb-4 block">Event Portfolio</span>
           <h2 className="text-h2 font-serif text-[var(--color-text-primary)] mb-4">The Lookbook</h2>
           <p className="text-body-m text-[var(--color-text-secondary)] font-light max-w-xl mx-auto italic">Visual chronicles of distinguished events, enhanced by our custom creations.</p>
        </div>
        <LookbookGrid items={lookbookItems} />
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto bg-white rounded-3xl my-24 border border-[var(--color-border-subtle)] shadow-sm">
        <FAQSection 
          title="Client Inquiries & Protocol"
          items={[
            {
              question: "What is the recommended lead time for bespoke orders?",
              answer: "To ensure uncompromising attention to detail, we request that bespoke commissions be finalized 4 to 6 weeks prior to your event date."
            },
            {
              question: "Can I preview my customized selections before production?",
              answer: "Certainly. Our digital GiftBuilder provides a high-fidelity rendering of your chosen specifications, allowing you to review foil stamping, palette alignments, and component selections instantly."
            },
            {
              question: "Do you accommodate high-volume corporate or grand-scale events?",
              answer: "Yes. We maintain a dedicated fulfillment protocol for grand-scale galas and corporate gifting, complete with tiered pricing structures for extensive commissions."
            },
            {
              question: "What defines the premium nature of your products?",
              answer: "Our commitment to excellence dictates our sourcing: we utilize heavy-stock textured vellum, authentic metallic foil stamping, and sustainably harvested natural soy waxes, ensuring every touchpoint exudes refinement."
            },
            {
              question: "Are you able to precisely match my event's unique color palette?",
              answer: "We offer a meticulously curated spectrum of contemporary hues designed to harmonize flawlessly with modern aesthetics, from subtle, sophisticated blushes to deep, dramatic emeralds."
            },
            {
              question: "Will the favors require assembly upon delivery?",
              answer: "No. Your order will arrive flawlessly assembled, elegantly packaged, and immediately ready for placement at your venue."
            }
          ]}
        />
      </section>

      {/* Inquiry Form Call to Action */}
      <section className="py-32 bg-[var(--color-bg-primary)] border-t border-[var(--color-border-subtle)]">
         <InquiryForm onSubmit={async (data) => console.log("Form Submitted:", data)} />
      </section>
    </div>
  );
}

