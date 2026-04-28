import { client, urlFor } from "@/lib/sanity";
import { PRODUCT_BY_SLUG_QUERY } from "@/lib/queries";
import GiftBuilderWizard from "@/components/shop/GiftBuilderWizard";
import { MOCK_CANDLE_SCHEMA } from "@/types/customization"; // Fallback for demo
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { FAQSection } from "@/components/ui/FAQSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let product = null;
  try {
    product = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug });
  } catch (error) {
    console.warn("Could not fetch metadata from Sanity.", error);
  }
  
  return {
    title: `${product?.name || "Bespoke Gift"} | Celebration Finds`,
    description: product?.description || "Handcrafted, fully customizable party favours and gifts.",
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  let product = null;
  try {
    product = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug });
  } catch (error) {
    console.warn(`Could not fetch product with slug: ${slug} from Sanity.`, error);
  }
  
  if (!product && slug !== "all") {
    // In dev we keep it for fallback, but ideally:
    // return notFound();
  }

  const schema = product?.customization_schema || MOCK_CANDLE_SCHEMA;
  const productName = product?.name || "Bespoke Scented Candle";
  const basePrice = product?.price || 45.00;
  const description = product?.description || "A luxury handcrafted candle designed specifically for your special occasion.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    image: product?.images?.[0] || "",
    description: description,
    offers: {
      "@type": "Offer",
      price: basePrice,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://celebrationfinds.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: "https://celebrationfinds.com/shop",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: productName,
        item: `https://celebrationfinds.com/shop/${slug}`,
      },
    ],
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Editorial Header Section */}
      <section className="pt-32 pb-12 border-b border-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                {product?.category || "Signature Collection"}
              </p>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-accent tracking-tight leading-none">
                {productName}
              </h1>
            </div>
            <div className="flex flex-col md:items-end">
               <span className="font-serif text-3xl font-bold text-accent">${Number(basePrice || 0).toFixed(2)}</span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Starting at</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Builder Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
           <GiftBuilderWizard 
             schema={schema} 
             productName={productName} 
             basePrice={basePrice} 
           />
        </div>
      </section>

      {/* Product Details Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl font-bold text-accent">Product Details</h2>
                <p className="font-sans text-slate-500 leading-relaxed max-w-lg">
                  {description}
                </p>
              </div>

              <div className="space-y-8">
                 <div className="flex items-start space-x-6 pb-8 border-b border-slate-200">
                    <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">✨</span>
                    <div className="space-y-2">
                       <h4 className="font-bold text-sm tracking-wide uppercase">Made by Hand to Bring Joy</h4>
                       <p className="text-xs text-slate-400 leading-relaxed">Give favors that feel truly personal. Every gift is made with care and high-quality materials. It creates an unboxing moment your guests will treasure.</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-6 pb-8 border-b border-slate-200">
                    <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">🎨</span>
                    <div className="space-y-2">
                       <h4 className="font-bold text-sm tracking-wide uppercase">Simple and Fun Customization</h4>
                       <p className="text-xs text-slate-400 leading-relaxed">Designing custom gifts should be as fun as the party itself. Our easy GiftBuilder lets you choose your colors, scents, and sweet messages in seconds.</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-6">
                    <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">📦</span>
                    <div className="space-y-2">
                       <h4 className="font-bold text-sm tracking-wide uppercase">Beautiful Gifts for Every Event</h4>
                       <p className="text-xs text-slate-400 leading-relaxed">Are you planning a dream wedding? Our collections blend elegant style with warm touches to leave a lasting impression.</p>
                    </div>
                 </div>
              </div>
            </div>
 
             <div className="relative aspect-[4/5] lg:aspect-square bg-slate-200 overflow-hidden group">
               <Image 
                 src={product?.images?.[0] ? urlFor(product.images[0]).width(1200).url() : "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80"}
                 alt={productName}
                 fill
                 className="object-cover transition-transform duration-1000 group-hover:scale-105"
                 sizes="(max-width: 1024px) 100vw, 50vw"
               />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />
            </div>
          </div>
        </div>
      </section>
      {/* Product FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <FAQSection 
            title="Common Questions"
            items={[
              {
                question: "How long does shipping take?",
                answer: "Most custom gifts are ready in 1-2 weeks. After that, they ship quickly across Canada."
              },
              {
                question: "Can I use my own logo?",
                answer: "Yes! If you are planning a big party or a work event, we can put your own logo on our gifts. Just send us a note!"
              },
              {
                question: "Are the materials safe?",
                answer: "We use high-quality, pure wax and clean scents that are safe for your home and guests."
              }
            ]}
          />
        </div>
      </section>
    </div>
  );
}
