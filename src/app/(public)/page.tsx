"use client";

import FeaturedCategories from "@/components/ui/FeaturedCategories";
import { Sparkles, Heart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/ui/HeroSection";
import { LookbookGrid } from "@/components/ui/LookbookGrid";
import { TestimonialBlock } from "@/components/ui/TestimonialBlock";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { ProductCard } from "@/components/ui/ProductCard";
import { FAQSection } from "@/components/ui/FAQSection";
import { GiftBuilderCarousel } from "@/components/ui/GiftBuilderCarousel";

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
        headline="Gifts You Will Never Forget."
        subheadline="Turn your special moments into magic. We make beautiful, custom party favors that show you care."
        ctaText="Start Gifting"
        imageUrl="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069"
        onCtaClick={() => window.location.href = '/demo-builder'}
      />

      {/* Value Proposition Section */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center border border-[var(--color-border-subtle)]">
              <Heart className="w-6 h-6 text-[var(--color-accent-gold)]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-h3 font-serif text-[var(--color-text-primary)] tracking-tight">Made by Hand to Bring Joy</h3>
              <p className="text-body-m text-[var(--color-text-secondary)] leading-relaxed max-w-sm font-light">
                Give favors that feel truly personal. Every gift is made with care and high-quality materials. It creates an unboxing moment your guests will treasure.
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
              <h3 className="text-h3 font-serif text-[var(--color-text-primary)] tracking-tight">Simple and Fun Customization</h3>
              <p className="text-body-m text-[var(--color-text-secondary)] leading-relaxed max-w-sm font-light">
                Designing custom gifts should be as fun as the party itself. Our easy GiftBuilder lets you choose your colors, scents, and sweet messages in seconds.
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
              <h3 className="text-h3 font-serif text-[var(--color-text-primary)] tracking-tight">Beautiful Gifts for Every Event</h3>
              <p className="text-body-m text-[var(--color-text-secondary)] leading-relaxed max-w-sm font-light">
                Are you planning a dream wedding or a sweet baby shower? Our collections blend elegant style with warm touches to leave a lasting impression.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GiftBuilder Carousel Preview */}
      <GiftBuilderCarousel />

      {/* Featured Categories */}
      <FeaturedCategories />

      <section className="py-32 px-6 max-w-[1440px] mx-auto border-t border-[var(--color-border-subtle)]/50">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 px-4">
           <div>
             <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-accent-gold)] mb-3 block">
               Season&apos;s Favorites
             </span>
             <h2 className="text-h2 font-serif text-[var(--color-text-primary)] mb-2">Featured Curations</h2>
             <p className="text-body-m text-[var(--color-text-secondary)] font-light italic">Hand-selected pieces for your upcoming celebrations.</p>
           </div>
           <a href="/demo-builder" className="group flex items-center gap-3 text-ui font-medium uppercase tracking-widest text-sm luxury-transition hover:text-[var(--color-accent-gold)] mt-6 md:mt-0">
             <span>View All</span>
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
            badge="New"
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

      {/* Lookbook Grid Showcase */}
      <section className="py-24 bg-[var(--color-bg-secondary)]/30">
        <div className="text-center mb-16">
           <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--color-text-tertiary)] mb-4 block">Visual Stories</span>
           <h2 className="text-h2 font-serif text-[var(--color-text-primary)] mb-4">The Lookbook</h2>
           <p className="text-body-m text-[var(--color-text-secondary)] font-light max-w-xl mx-auto italic">Real celebrations, real magic. See how our gifts transform moments into memories.</p>
        </div>
        <LookbookGrid items={lookbookItems} />
      </section>

      {/* Parallax Testimonial */}
      <TestimonialBlock
        quote="Our wedding guests loved these beautiful gifts. They felt so special and personal. Pure magic!"
        author="Sophia L."
        role="Bride"
      />

      {/* FAQ Section */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto bg-white rounded-3xl my-24 border border-[var(--color-border-subtle)] shadow-sm">
        <FAQSection 
          title="Common Gifting Questions"
          items={[
            {
              question: "How early should I place my order?",
              answer: "To make sure every detail is perfect, we suggest ordering your gifts 4 to 6 weeks before your big event."
            },
            {
              question: "Can I see what my custom gifts will look like?",
              answer: "Yes! Our easy GiftBuilder shows you a real-time preview of your colors, scents, and foil text."
            },
            {
              question: "Do you give discounts for very large orders?",
              answer: "Yes! We love big celebrations. We offer special bulk pricing for grand weddings and large corporate events."
            },
            {
              question: "Why do your gifts feel so premium?",
              answer: "We care about the little things. We use thick ivory paper, shiny gold foil, and high-quality natural wax to make everything feel luxurious."
            },
            {
              question: "Can I match my order to my exact wedding colors?",
              answer: "Of course. We have colors that match modern event themes beautifully, from soft pinks to deep greens and warm neutrals."
            },
            {
              question: "Will my custom gifts arrive fully put together?",
              answer: "Yes. Every beautiful piece arrives perfectly put together and ready to place on your event tables."
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

